'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';
import type { PacerPreset } from '../types/topic';
import { cn } from '../utils/cn';

type Phase = 'inhale' | 'hold' | 'exhale';

const phaseCopy: Record<Phase, string> = {
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Breathe out'
};

interface BreathingPacerProps {
  presets: PacerPreset[];
  showPresetPicker?: boolean;
}

export function BreathingPacer({ presets, showPresetPicker = false }: BreathingPacerProps) {
  const [presetIndex, setPresetIndex] = useState(0);
  const preset = presets[presetIndex];
  const reduceMotion = useReducedMotion();

  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [remaining, setRemaining] = useState(preset.inhale);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    setRunning(false);
    setPhase('inhale');
    setRemaining(preset.inhale);
    setCycles(0);
  }, [preset]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (remaining > 1) {
        setRemaining((value) => value - 1);
        return;
      }
      const next: Phase =
      phase === 'inhale' ? preset.hold > 0 ? 'hold' : 'exhale' : phase === 'hold' ? 'exhale' : 'inhale';
      setPhase(next);
      setRemaining(next === 'inhale' ? preset.inhale : next === 'hold' ? preset.hold : preset.exhale);
      if (next === 'inhale') setCycles((value) => value + 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [running, remaining, phase, preset]);

  const { scale, duration } = useMemo(() => {
    if (phase === 'inhale') return { scale: 1, duration: preset.inhale };
    if (phase === 'exhale') return { scale: 0.62, duration: preset.exhale };
    return { scale: 1, duration: 0.2 };
  }, [phase, preset]);

  function reset() {
    setRunning(false);
    setPhase('inhale');
    setRemaining(preset.inhale);
    setCycles(0);
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center">
          <div className="relative flex h-48 w-48 items-center justify-center">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-brand-tint"
              animate={{ scale: running && !reduceMotion ? scale : 0.86 }}
              transition={{ duration: running && !reduceMotion ? duration : 0.3, ease: 'linear' }} />
            
            <motion.span
              aria-hidden="true"
              className="absolute inset-6 rounded-full border border-line"
              animate={{ scale: running && !reduceMotion ? scale : 0.9 }}
              transition={{ duration: running && !reduceMotion ? duration : 0.3, ease: 'linear' }} />
            
            <div className="relative text-center" aria-live="polite">
              <p className="font-serif text-2xl text-ink">{running ? phaseCopy[phase] : 'Ready'}</p>
              <p className="mt-1 text-4xl font-semibold tabular-nums text-brand">
                {running ? remaining : preset.inhale}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-widest text-brand">Grounding pacer</p>
          <h3 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
            {preset.inhale}–{preset.hold}–{preset.exhale} breathing
          </h3>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-body">{preset.description}</p>

          {showPresetPicker && presets.length > 1 &&
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Pacing mode">
              {presets.map((option, index) =>
            <button
              key={option.label}
              type="button"
              onClick={() => setPresetIndex(index)}
              aria-pressed={index === presetIndex}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-150 ease-gentle',
                index === presetIndex ?
                'border-brand bg-brand text-white' :
                'border-line bg-surface text-body hover:border-brand hover:text-ink'
              )}>
              
                  {option.label}
                </button>
            )}
            </div>
          }

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setRunning((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-transform duration-150 ease-gentle hover:scale-[1.02] active:scale-[0.99]">
              
              {running ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              {running ? 'Pause' : 'Start breathing'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-body transition-colors duration-150 ease-gentle hover:border-brand hover:text-ink">
              
              <RotateCcwIcon className="h-4 w-4" />
              Reset
            </button>
            <p className="text-sm text-body">
              {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed
            </p>
          </div>
        </div>
      </div>
    </div>);

}