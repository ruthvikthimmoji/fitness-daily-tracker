import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Briefcase, CheckCircle2, Clock, Check, ChevronRight, Play, Square, BarChart3, TrendingUp, Target } from 'lucide-react';
import { WorkItem, DailyHistoryItem } from '../types';
import { triggerHaptic } from '../utils/formatters';

interface WorkTabProps {
  workItems: WorkItem[];
  history?: DailyHistoryItem[];
  onOpenAddModal: (categoryPreset?: string) => void;
  onDeleteWork: (item: WorkItem) => void;
  onToggleStatus: (item: WorkItem) => void;
  onQuickAdd: (work: Omit<WorkItem, 'date'>) => void;
  onSelectDetail: (item: WorkItem) => void;
  onShowToast?: (msg: string, actionLabel?: string, onAction?: () => void) => void;
}

export const WorkTab: React.FC<WorkTabProps> = ({
  workItems,
  history = [],
  onOpenAddModal,
  onDeleteWork,
  onToggleStatus,
  onQuickAdd,
  onSelectDetail,
  onShowToast
}) => {
  // Top Segment: Tasks vs Stats
  const [activeSegment, setActiveSegment] = useState<'tasks' | 'stats'>('tasks');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAllPresets, setShowAllPresets] = useState<boolean>(false);
  const [statsTimeframe, setStatsTimeframe] = useState<'7D' | '14D' | '30D'>('7D');

  // Focus Timer state
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleStopAndLogTimer = () => {
    setTimerRunning(false);
    triggerHaptic(20);
    const hrs = Math.max(0.25, Math.round((timerSeconds / 3600) * 100) / 100);
    onQuickAdd({
      task: 'Focus session',
      category: 'Work',
      hours: hrs,
      status: 'Done'
    });
    if (onShowToast) {
      onShowToast(`Logged ${hrs} hrs focus session`, 'UNDO', () => {});
    }
    setTimerSeconds(0);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const categories = ['Work', 'Study', 'Personal Project', 'Errands', 'Reading'];

  const totalHours = workItems.reduce((sum, item) => sum + (item.hours || 0), 0);
  const doneCount = workItems.filter(item => item.status === 'Done').length;
  const completionRate = workItems.length > 0 ? Math.round((doneCount / workItems.length) * 100) : 0;

  // Presets in sentence case
  const quickTasks: Omit<WorkItem, 'date'>[] = [
    { task: 'Deep work: coding', category: 'Work', hours: 2.5, status: 'Done' },
    { task: 'Study & research', category: 'Study', hours: 1.5, status: 'Done' },
    { task: 'Project build', category: 'Personal Project', hours: 2.0, status: 'Done' },
    { task: 'Reading & notes', category: 'Reading', hours: 0.75, status: 'Done' },
    { task: 'Planning & review', category: 'Work', hours: 0.5, status: 'Done' },
  ];

  const visiblePresets = showAllPresets ? quickTasks : quickTasks.slice(0, 4);

  const filteredItems = activeCategory === 'All'
    ? workItems
    : workItems.filter(w => w.category.toLowerCase() === activeCategory.toLowerCase());

  // --------------------------------------------------------------------------
  // WORK STATS CALCULATIONS
  // --------------------------------------------------------------------------
  const daysLimit = statsTimeframe === '7D' ? 7 : statsTimeframe === '14D' ? 14 : 30;
  const recentHistory = history.slice(-daysLimit);

  const maxWorkHours = Math.max(4, ...recentHistory.map(h => h.workHours || 0), totalHours);
  const totalHistoryWorkHours = recentHistory.reduce((sum, h) => sum + (h.workHours || 0), 0) + (totalHours > 0 ? totalHours : 0);
  const activeWorkDays = recentHistory.filter(h => (h.workHours || 0) > 0).length + (totalHours > 0 ? 1 : 0);
  const avgHoursPerActiveDay = activeWorkDays > 0 ? (totalHistoryWorkHours / activeWorkDays).toFixed(1) : '0';

  // Work category counts & hours
  const categoryHoursMap: Record<string, number> = {};
  workItems.forEach(item => {
    const cat = item.category || 'Other';
    categoryHoursMap[cat] = (categoryHoursMap[cat] || 0) + (item.hours || 0);
  });

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-150 relative">
      
      {/* 1. TOP SEGMENTED CONTROL: Tasks & Focus | Work Stats */}
      <div className="bg-white rounded-2xl p-1.5 border border-[#E8E3D5] shadow-xs flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveSegment('tasks');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-button-s text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'tasks'
              ? 'bg-[#16232B] text-white shadow-sm font-bold'
              : 'text-[#526673] hover:text-[#16232B] hover:bg-[#FFFFF0]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Tasks & Focus</span>
          {workItems.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeSegment === 'tasks' ? 'bg-white/25 text-white' : 'bg-[#FFFFF0] text-[#16232B]'
            }`}>
              {workItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveSegment('stats');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-button-s text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'stats'
              ? 'bg-[#FF5B04] text-white shadow-sm font-bold'
              : 'text-[#526673] hover:text-[#16232B] hover:bg-[#FFFFF0]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Work Stats</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* SEGMENT 1: TASKS & FOCUS VIEW                                        */}
      {/* ==================================================================== */}
      {activeSegment === 'tasks' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          
          {/* Summary Strip */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8E3D5] shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#E6F2F3] text-[#075056]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="font-title text-sm text-[#16232B]">Daily Focus</div>
                <div className="font-caption text-[11px] text-[#526673]">
                  {totalHours > 0 ? `${totalHours} hrs logged today` : 'Focus goal: 4 hrs'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-right">
              <div>
                <div className="flex items-center space-x-1 font-caption text-[#526673] justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#075056]" />
                  <span className="font-button-s text-xs text-[#16232B]">{doneCount} of {workItems.length || 0} done</span>
                </div>
                <div className="font-caption text-[10px] text-[#075056] font-bold mt-0.5">
                  {completionRate}% completed
                </div>
              </div>
            </div>
          </div>

          {/* Focus Timer Strip */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8E3D5] shadow-2xs flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 rounded-xl ${timerRunning ? 'bg-[#FFF0E8] text-[#FF5B04]' : 'bg-[#FFFFF0] text-[#526673]'}`}>
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-label text-[10px] text-[#526673] block">FOCUS TIMER</span>
                <span className="font-timer text-lg text-[#16232B] font-bold leading-none">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!timerRunning ? (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    setTimerRunning(true);
                  }}
                  className="px-4 py-2 bg-[#FF5B04] text-white rounded-xl font-button-s text-xs flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopAndLogTimer}
                  className="px-4 py-2 bg-[#16232B] text-white rounded-xl font-button-s text-xs flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop & Log</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Add Presets First */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8E3D5] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label text-[10px] text-[#526673] tracking-wider uppercase">
                Quick Add Presets
              </span>
              <button
                type="button"
                onClick={() => setShowAllPresets(!showAllPresets)}
                className="font-button-s text-xs text-[#FF5B04] hover:underline"
              >
                {showAllPresets ? 'Show less' : 'View all'}
              </button>
            </div>

            <div className="space-y-2">
              {visiblePresets.map((preset, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-[#FFFFF0]/40 hover:bg-[#FFFFF0] rounded-xl border border-[#E8E3D5] transition-colors gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-title text-xs text-[#16232B] truncate">{preset.task}</div>
                    <div className="font-caption text-[11px] text-[#526673] mt-0.5">
                      {preset.category} · {preset.hours} hrs
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(15);
                      onQuickAdd(preset);
                      if (onShowToast) {
                        onShowToast(`Logged ${preset.task}`, 'UNDO', () => {});
                      }
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E8E3D5] hover:border-[#FF5B04] hover:bg-[#FFF0E8] text-[#16232B] hover:text-[#FF5B04] flex items-center justify-center shrink-0 transition-transform active:scale-90"
                    title={`Log ${preset.task}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="chips flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['All', ...categories].map((cat) => {
              const isSel = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setActiveCategory(cat);
                  }}
                  className={`chip px-3 py-1.5 font-button-s text-xs rounded-xl border transition-all whitespace-nowrap ${
                    isSel
                      ? 'bg-[#16232B] text-white border-[#16232B] shadow-xs font-bold'
                      : 'bg-white text-[#526673] border-[#E8E3D5] hover:bg-[#FFFFF0]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Logged Tasks List */}
          <div className="space-y-2">
            <div className="font-label text-[10px] text-[#526673] px-1 uppercase tracking-wider">
              Today's Tasks
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-[#E8E3D5] text-center shadow-2xs">
                <p className="font-body-m text-xs text-[#526673]">
                  Nothing logged yet. Tap + to add a task.
                </p>
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isDone = item.status === 'Done';

                return (
                  <div
                    key={idx}
                    onClick={() => onSelectDetail(item)}
                    className="bg-white rounded-2xl p-3.5 border border-[#E8E3D5] cursor-pointer hover:border-[#16232B] transition-all shadow-2xs group"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E3D5]/60 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-label text-[10px] bg-[#16232B] text-white px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <span className="font-label text-[10px] text-[#FF5B04] font-bold">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-caption text-[#526673] flex items-center gap-0.5 group-hover:text-[#16232B] transition-colors">
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic(10);
                            onDeleteWork(item);
                          }}
                          className="text-[#E8E3D5] hover:text-[#D32F2F] p-1 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic(15);
                          onToggleStatus(item);
                        }}
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                          isDone
                            ? 'bg-[#075056] border-[#075056] text-white'
                            : 'border-[#E8E3D5] hover:border-[#075056] bg-white'
                        }`}
                        title="Toggle Status"
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className={`font-title text-sm truncate ${
                            isDone ? 'text-[#526673] line-through' : 'text-[#16232B]'
                          }`}>
                            {item.task}
                          </h3>
                          <span className="font-stat text-xs text-[#16232B] font-bold shrink-0">
                            {item.hours} hrs
                          </span>
                        </div>

                        <div className="font-caption text-[11px] text-[#526673] mt-0.5">
                          Status: {item.status}
                        </div>

                        {item.notes && (
                          <div className="text-[11px] font-body-s text-[#526673] italic mt-1.5 pt-1 border-t border-[#E8E3D5]/40 truncate">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-20 right-4 z-30">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onOpenAddModal(activeCategory !== 'All' ? activeCategory : 'Work');
              }}
              className="px-4 py-3 rounded-full bg-[#16232B] text-white font-button-s text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Task</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* SEGMENT 2: WORK STATS VIEW                                           */}
      {/* ==================================================================== */}
      {activeSegment === 'stats' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Timeframe Selector */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-h2 text-base text-[#16232B]">Focus Analytics</h2>
              <p className="font-caption text-xs text-[#526673]">Deep work, study & task velocity</p>
            </div>
            <div className="flex rounded-xl bg-white border border-[#E8E3D5] p-0.5 text-xs">
              {(['7D', '14D', '30D'] as const).map(tf => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setStatsTimeframe(tf);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-button-s transition-all ${
                    statsTimeframe === tf
                      ? 'bg-[#16232B] text-white font-bold'
                      : 'text-[#526673] hover:text-[#16232B]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl p-3 border border-[#E8E3D5] shadow-2xs">
              <div className="font-caption text-[11px] text-[#526673]">Total Focus</div>
              <div className="font-score-m text-base text-[#16232B] mt-1">
                {totalHistoryWorkHours.toFixed(1)} <span className="text-[10px] text-[#526673]">hrs</span>
              </div>
              <div className="font-caption text-[10px] text-[#526673] mt-0.5">In {daysLimit} days</div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#E8E3D5] shadow-2xs">
              <div className="font-caption text-[11px] text-[#526673]">Avg Daily</div>
              <div className="font-score-m text-base text-[#FF5B04] mt-1">
                {avgHoursPerActiveDay} <span className="text-[10px] text-[#526673]">hrs</span>
              </div>
              <div className="font-caption text-[10px] text-[#526673] mt-0.5">per active day</div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#E8E3D5] shadow-2xs">
              <div className="font-caption text-[11px] text-[#526673]">Task Rate</div>
              <div className="font-score-m text-base text-[#075056] mt-1">
                {completionRate}%
              </div>
              <div className="font-caption text-[10px] text-[#526673] mt-0.5">{doneCount} tasks done</div>
            </div>
          </div>

          {/* Focus Hours Trend Chart */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#075056]" />
                <span className="font-title text-sm text-[#16232B]">Daily Focus Trend</span>
              </div>
              <span className="font-caption text-[11px] text-[#526673]">Hours / Day</span>
            </div>

            <div className="h-36 flex items-end justify-between gap-1.5 pt-4 pb-1 border-b border-[#E8E3D5]">
              {recentHistory.map((day, idx) => {
                const hrs = day.workHours || 0;
                const heightPct = Math.max(8, Math.round((hrs / maxWorkHours) * 100));
                const dayLabel = day.day ? day.day.slice(0, 3) : `D${idx + 1}`;
                const hasHours = hrs > 0;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <span className="opacity-0 group-hover:opacity-100 font-caption text-[9px] text-[#16232B] transition-opacity mb-1">
                      {hrs > 0 ? `${hrs}h` : '0'}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-lg transition-all ${
                        hasHours
                          ? 'bg-gradient-to-t from-[#075056] to-[#0E7780] shadow-2xs'
                          : 'bg-[#E8E3D5]/40'
                      }`}
                    />
                    <span className="font-caption text-[9px] text-[#526673] mt-1.5 block">
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Allocation By Category */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[#FF5B04]" />
              <span className="font-title text-sm text-[#16232B]">Time Allocation by Category</span>
            </div>

            {Object.keys(categoryHoursMap).length === 0 ? (
              <p className="font-caption text-xs text-[#526673]">
                Log tasks with categories (Work, Study, Project, Reading) to see your productivity breakdown.
              </p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(categoryHoursMap).map(([cat, hrs]) => {
                  const pct = totalHours > 0 ? Math.round((hrs / totalHours) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between font-caption text-xs mb-1">
                        <span className="text-[#16232B] font-bold">{cat}</span>
                        <span className="text-[#526673]">{hrs} hrs ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#FFFFF0] overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full rounded-full bg-[#FF5B04]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
