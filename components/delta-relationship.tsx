'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const steps = [
  { drop: 20, radiatorTemp: 65, height: 92 },
  { drop: 15, radiatorTemp: 70, height: 74 },
  { drop: 10, radiatorTemp: 75, height: 57 },
  { drop: 5, radiatorTemp: 80, height: 42 },
];

export function DeltaRelationship() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/20 p-3">
        <Image
          src="/visuals/delta-relationship.png"
          alt="Why every degree matters visual"
          width={1600}
          height={900}
          className="h-auto w-full rounded-[1.2rem] border border-white/10"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {steps.map((step, idx) => (
          <motion.div
            key={step.drop}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">ΔT loss</div>
            <div className="mt-2 text-2xl font-semibold text-orange-200">{step.drop}°C</div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/45">Radiator</div>
            <div className="mt-1 text-lg text-cyan-100">{step.radiatorTemp}°C</div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
          <div className="mb-5 text-sm uppercase tracking-[0.2em] text-white/45">Animated area impact</div>
          <div className="flex items-end justify-between gap-3 pt-8">
            {steps.map((step, idx) => (
              <div key={step.drop} className="flex flex-1 flex-col items-center gap-3">
                <motion.div
                  initial={{ height: 32 }}
                  whileInView={{ height: step.height }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.75, delay: idx * 0.1 }}
                  className="w-full rounded-t-3xl bg-gradient-to-t from-cyan-400 to-blue-300 shadow-[0_0_28px_rgba(34,211,238,0.25)]"
                />
                <div className="text-xs text-white/55">{step.drop}°C</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/40">
            <span>Higher loss</span>
            <span>Lower loss</span>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
          <div className="mb-5 text-sm uppercase tracking-[0.2em] text-white/45">What changes</div>
          <div className="space-y-3">
            {[
              'Lose temperature moving heat',
              'Radiator runs colder',
              'Radiates less heat per m²',
              'Required radiator area increases',
            ].map((line, idx) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.75 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/75"
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
