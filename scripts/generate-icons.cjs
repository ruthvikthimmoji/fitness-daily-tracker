const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writePng(width, height, rgbaBuffer, outPath) {
  const rowLen = 1 + width * 4;
  const filtered = Buffer.alloc(height * rowLen);
  for (let y = 0; y < height; y++) {
    filtered[y * rowLen] = 0; // Filter 0
    rgbaBuffer.copy(filtered, y * rowLen + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlib.deflateSync(filtered);

  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    const crc = crc32(chunk.slice(4, 8 + len));
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  const pngBuf = Buffer.concat([header, ihdr, idat, iend]);
  fs.writeFileSync(outPath, pngBuf);
  return pngBuf;
}

// Decode PNG to RGBA
function decodePng(buf) {
  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  let pos = 8, idatChunks = [], width = 0, height = 0;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = 4;
  const rowLen = 1 + width * bpp;
  const raw = Buffer.alloc(width * height * bpp);
  let prevRow = Buffer.alloc(width * bpp);

  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * rowLen];
    const currentRow = Buffer.alloc(width * bpp);
    for (let x = 0; x < width * bpp; x++) {
      const rawVal = decompressed[y * rowLen + 1 + x];
      const a = x >= bpp ? currentRow[x - bpp] : 0;
      const b = prevRow[x];
      const c = x >= bpp ? prevRow[x - bpp] : 0;
      let val = 0;
      if (filter === 0) val = rawVal;
      else if (filter === 1) val = (rawVal + a) & 0xff;
      else if (filter === 2) val = (rawVal + b) & 0xff;
      else if (filter === 3) val = (rawVal + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) val = (rawVal + paeth(a, b, c)) & 0xff;
      currentRow[x] = val;
      raw[(y * width * bpp) + x] = val;
    }
    prevRow = currentRow;
  }
  return { width, height, data: raw };
}

// Bilinear sample from source image
function sampleBilinear(src, u, v) {
  // u, v in [0, 1]
  if (u < 0 || u > 1 || v < 0 || v > 1) return [0, 0, 0, 0];
  const sx = u * (src.width - 1);
  const sy = v * (src.height - 1);
  const x0 = Math.floor(sx);
  const y0 = Math.floor(sy);
  const x1 = Math.min(src.width - 1, x0 + 1);
  const y1 = Math.min(src.height - 1, y0 + 1);
  const fx = sx - x0;
  const fy = sy - y0;

  function getPixel(x, y) {
    const idx = (y * src.width + x) * 4;
    return [src.data[idx], src.data[idx+1], src.data[idx+2], src.data[idx+3]];
  }

  const p00 = getPixel(x0, y0);
  const p10 = getPixel(x1, y0);
  const p01 = getPixel(x0, y1);
  const p11 = getPixel(x1, y1);

  const res = [];
  for (let c = 0; c < 4; c++) {
    const top = p00[c] * (1 - fx) + p10[c] * fx;
    const bot = p01[c] * (1 - fx) + p11[c] * fx;
    res.push(Math.round(top * (1 - fy) + bot * fy));
  }
  return res;
}

// Generate squircle icon
// options: { size, borderRadiusRatio, logoScaleRatio, isMaskable, isFullBleed }
function renderEmblem(srcLogo, size, options = {}) {
  const {
    borderRadiusRatio = 0.22, // e.g. 112 / 512
    logoScaleRatio = 0.72,
    isMaskable = false,
  } = options;

  const buf = Buffer.alloc(size * size * 4);
  const radius = size * borderRadiusRatio;
  const half = size / 2;
  const rectHalf = half - radius;

  // Background color #16232B = (22, 35, 43)
  const bgR = 22, bgG = 35, bgB = 43;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      let bgAlpha = 1.0;
      if (!isMaskable) {
        // Distance to rounded rect boundary
        const dx = Math.max(0, Math.abs(x + 0.5 - half) - rectHalf);
        const dy = Math.max(0, Math.abs(y + 0.5 - half) - rectHalf);
        const dist = Math.sqrt(dx * dx + dy * dy);
        bgAlpha = Math.max(0, Math.min(1, radius - dist + 0.5));
      }

      if (bgAlpha <= 0) {
        buf[idx] = 0;
        buf[idx+1] = 0;
        buf[idx+2] = 0;
        buf[idx+3] = 0;
        continue;
      }

      // Sample logo
      const logoBoxSize = size * logoScaleRatio;
      const logoStart = (size - logoBoxSize) / 2;
      const lx = (x + 0.5 - logoStart) / logoBoxSize;
      const ly = (y + 0.5 - logoStart) / logoBoxSize;

      let fgR = 255, fgG = 255, fgB = 255, fgA = 0;
      if (lx >= 0 && lx <= 1 && ly >= 0 && ly <= 1) {
        const s = sampleBilinear(srcLogo, lx, ly);
        fgR = s[0];
        fgG = s[1];
        fgB = s[2];
        fgA = s[3] / 255;
      }

      // Composite foreground (white logo) onto background (#16232B)
      const outR = Math.round(fgR * fgA + bgR * (1 - fgA));
      const outG = Math.round(fgG * fgA + bgG * (1 - fgA));
      const outB = Math.round(fgB * fgA + bgB * (1 - fgA));
      const outA = Math.round(bgAlpha * 255);

      buf[idx] = outR;
      buf[idx+1] = outG;
      buf[idx+2] = outB;
      buf[idx+3] = outA;
    }
  }

  return buf;
}

// Build standard ICO file containing multiple PNG images
function createIco(images) {
  // images: array of { width, height, buffer }
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // Offset to image data
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const chunks = [header, ...dirEntries, ...images.map(img => img.buffer)];
  return Buffer.concat(chunks);
}

// Execute
const publicDir = path.join(__dirname, '../public');
const whiteLogoPath = path.join(publicDir, 'logo-white.png');
const whiteLogoFile = fs.readFileSync(whiteLogoPath);
const srcLogo = decodePng(whiteLogoFile);
console.log('Loaded source logo:', srcLogo.width, 'x', srcLogo.height);

// 1. icon-512.png (PWA & Desktop)
const buf512 = renderEmblem(srcLogo, 512, { borderRadiusRatio: 0.22, logoScaleRatio: 0.72, isMaskable: false });
const png512 = writePng(512, 512, buf512, path.join(publicDir, 'icon-512.png'));
console.log('Generated public/icon-512.png');

// 2. icon-192.png (PWA mobile standard)
const buf192 = renderEmblem(srcLogo, 192, { borderRadiusRatio: 0.22, logoScaleRatio: 0.72, isMaskable: false });
const png192 = writePng(192, 192, buf192, path.join(publicDir, 'icon-192.png'));
console.log('Generated public/icon-192.png');

// 3. icon-maskable-512.png (Android adaptive safe-zone icon)
const bufMask512 = renderEmblem(srcLogo, 512, { isMaskable: true, logoScaleRatio: 0.60 });
writePng(512, 512, bufMask512, path.join(publicDir, 'icon-maskable-512.png'));
console.log('Generated public/icon-maskable-512.png');

// 4. icon-maskable-192.png
const bufMask192 = renderEmblem(srcLogo, 192, { isMaskable: true, logoScaleRatio: 0.60 });
writePng(192, 192, bufMask192, path.join(publicDir, 'icon-maskable-192.png'));
console.log('Generated public/icon-maskable-192.png');

// 5. apple-touch-icon.png (Apple adds rounded corners, so solid background with 66% logo scale)
const bufApple = renderEmblem(srcLogo, 180, { isMaskable: true, logoScaleRatio: 0.68 });
writePng(180, 180, bufApple, path.join(publicDir, 'apple-touch-icon.png'));
console.log('Generated public/apple-touch-icon.png');

// 6. favicon.png (64x64) & favicon-32.png & favicon-16.png
const bufFavicon64 = renderEmblem(srcLogo, 64, { borderRadiusRatio: 0.22, logoScaleRatio: 0.74, isMaskable: false });
writePng(64, 64, bufFavicon64, path.join(publicDir, 'favicon.png'));

const bufFavicon32 = renderEmblem(srcLogo, 32, { borderRadiusRatio: 0.22, logoScaleRatio: 0.76, isMaskable: false });
const png32 = writePng(32, 32, bufFavicon32, path.join(publicDir, 'favicon-32x32.png'));

const bufFavicon16 = renderEmblem(srcLogo, 16, { borderRadiusRatio: 0.22, logoScaleRatio: 0.78, isMaskable: false });
const png16 = writePng(16, 16, bufFavicon16, path.join(publicDir, 'favicon-16x16.png'));
console.log('Generated favicons');

// 7. favicon.ico containing 32x32 and 16x16
const icoBuf = createIco([
  { width: 32, height: 32, buffer: png32 },
  { width: 16, height: 16, buffer: png16 }
]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
console.log('Generated public/favicon.ico');

// 8. logo.png (The master splash screen emblem)
// Overwrite public/logo.png with the 512x512 splash emblem so any <img src="/logo.png"> uses the splash screen emblem!
fs.writeFileSync(path.join(publicDir, 'logo.png'), png512);
console.log('Updated public/logo.png with splash screen emblem');
