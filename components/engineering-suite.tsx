"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type ToolMode = "home" | "thermal" | "orbit" | "radiator" | "architecture" | "trade" | "materials" | "reports";

const SIGMA = 5.670374419e-8;

const tools: { mode: ToolMode; label: string; href: string; description: string }[] = [
  { mode: "home", label: "Tools Home", href: "/tools", description: "Overview of Nuwatts engineering tools." },
  { mode: "thermal", label: "Thermal Calculator", href: "/tools/thermal-studio", description: "Size radiator area, mass, and thermal overhead." },
  { mode: "orbit", label: "Orbit Effects", href: "/tools/orbit-effects", description: "Estimate eclipse, albedo, Earth IR, and thermal environment." },
  { mode: "radiator", label: "Radiator Sizing", href: "/tools/radiator-sizing", description: "Compare radiator temperature, emissivity, density, and mass." },
  { mode: "architecture", label: "Architecture Comparison", href: "/tools/architecture-comparison", description: "Compare active loops with a passive Nuwatts-style thermal layer." },
  { mode: "trade", label: "Trade Study", href: "/tools/trade-study", description: "See sensitivity to temperature, emissivity, PUE, and IT load." },
  { mode: "materials", label: "Materials", href: "/tools/materials", description: "Reference values for common spacecraft thermal materials." },
  { mode: "reports", label: "Reports", href: "/tools/reports", description: "Generate a concise design-case summary." },
];

const materialRows = [
  ["Aluminum honeycomb panel", "5–12", "High heritage; structurally efficient; coatings matter"],
  ["Carbon-carbon radiator", "2–6", "High-temperature potential; less mature and more expensive"],
  ["Flexible / inflatable concept", "1–3", "Mass-efficient but lower TRL and durability concerns"],
  ["Pyrolytic graphite spreader", "0.5–2", "Excellent in-plane spreading; integration-specific"],
  ["White thermal coating", "—", "High emissivity; performance can degrade in orbit"],
];

function fmt(value: number, digits = 0) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function flux(tempK: number, sinkK: number, emissivity: number, effectiveness: number) {
  return Math.max(1, emissivity * SIGMA * (Math.pow(tempK, 4) - Math.pow(sinkK, 4)) * effectiveness);
}

function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-black/25">
          <input
            className="w-24 bg-transparent px-3 py-2 text-right text-sm text-white outline-none"
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          {unit ? <span className="border-l border-white/10 px-3 text-xs text-white/55">{unit}</span> : null}
        </div>
      </div>
      <input
        className="w-full accent-cyan-300"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="mt-1 flex justify-between text-[11px] text-white/40">
        <span>{min}</span><span>{max}</span>
      </div>
    </label>
  );
}

function ResultCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5 shadow-glow">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
      {sub ? <div className="mt-1 text-sm text-white/50">{sub}</div> : null}
    </div>
  );
}

function MiniBar({ label, value, max, suffix = "" }: { label: string; value: number; max: number; suffix?: string }) {
  const width = Math.max(2, Math.min(100, (value / max) * 100));
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-3 text-sm"><span className="text-white/70">{label}</span><b className="text-white">{fmt(value, 0)}{suffix}</b></div>
      <div className="h-3 rounded-full bg-white/10"><div className="h-3 rounded-full bg-cyan-300" style={{ width: `${width}%` }} /></div>
    </div>
  );
}

function AppFrame({ mode, children }: { mode: ToolMode; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-space-gradient text-white">
      <header className="border-b border-white/10 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <Link href="/" className="flex items-center gap-4">
              <Image src="/nuwatts-logo.png" alt="Nuwatts" width={160} height={86} className="h-16 w-auto object-contain" priority />
              <div className="hidden border-l border-white/15 pl-5 sm:block">
                <div className="text-xl font-semibold tracking-wide">Nuwatts Engineering Suite</div>
                <div className="text-sm text-cyan-200/80">Orbital thermal trade-study tools</div>
              </div>
            </Link>
            <div className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">Preliminary sizing model · v1.0</div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {tools.map((tool) => (
              <Link
                key={tool.mode}
                href={tool.href}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${mode === tool.mode ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"}`}
              >
                {tool.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">{children}</div>
    </main>
  );
}

export function EngineeringSuite({ mode }: { mode: ToolMode }) {
  const [itLoad, setItLoad] = useState(1000);
  const [radiatorTemp, setRadiatorTemp] = useState(323);
  const [sinkTemp, setSinkTemp] = useState(3);
  const [emissivity, setEmissivity] = useState(0.9);
  const [effectiveness, setEffectiveness] = useState(0.9);
  const [arealDensity, setArealDensity] = useState(2.0);
  const [activeOverheadPct, setActiveOverheadPct] = useState(5);
  const [passiveOverheadPct, setPassiveOverheadPct] = useState(0.2);
  const [orbit, setOrbit] = useState("LEO");

  const model = useMemo(() => {
    const qFlux = flux(radiatorTemp, sinkTemp, emissivity, effectiveness);
    const area = itLoad * 1000 / qFlux;
    const mass = area * arealDensity;
    const activeOverhead = itLoad * activeOverheadPct / 100;
    const passiveOverhead = itLoad * passiveOverheadPct / 100;
    const activeArea = (itLoad + activeOverhead) * 1000 / qFlux;
    const passiveArea = (itLoad + passiveOverhead) * 1000 / qFlux;
    const activeMass = activeArea * arealDensity * 1.35;
    const passiveMass = passiveArea * arealDensity * 1.15;
    return { qFlux, area, mass, activeOverhead, passiveOverhead, activeArea, passiveArea, activeMass, passiveMass };
  }, [itLoad, radiatorTemp, sinkTemp, emissivity, effectiveness, arealDensity, activeOverheadPct, passiveOverheadPct]);

  const Controls = (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="mb-4 text-lg font-semibold">Shared inputs</h2>
      <div className="grid gap-4">
        <Slider label="Thermal design power" value={itLoad} min={10} max={10000} step={10} unit="kW" onChange={setItLoad} />
        <Slider label="Radiator temperature" value={radiatorTemp} min={273} max={500} step={1} unit="K" onChange={setRadiatorTemp} />
        <Slider label="Emissivity" value={emissivity} min={0.5} max={0.98} step={0.01} onChange={setEmissivity} />
        <Slider label="Effectiveness / view factor" value={effectiveness} min={0.3} max={1} step={0.01} onChange={setEffectiveness} />
        <Slider label="Radiator areal density" value={arealDensity} min={1} max={15} step={0.1} unit="kg/m²" onChange={setArealDensity} />
      </div>
    </section>
  );

  if (mode === "home") {
    return (
      <AppFrame mode={mode}>
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Engineering tools</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">Nuwatts Thermal Studio</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">A practical suite of first-order calculators for orbital compute thermal trade studies. Use these tools to estimate radiator area, mass, thermal overhead, orbit effects, and architecture-level tradeoffs.</p>
        </section>
        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.filter((tool) => tool.mode !== "home").map((tool) => (
            <Link key={tool.mode} href={tool.href} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-300/50 hover:bg-white/[0.07]">
              <div className="text-xl font-semibold text-white">{tool.label}</div>
              <p className="mt-3 text-sm leading-6 text-white/60">{tool.description}</p>
            </Link>
          ))}
        </section>
      </AppFrame>
    );
  }

  if (mode === "thermal") {
    return <AppFrame mode={mode}><div className="grid gap-6 lg:grid-cols-[360px_1fr]">{Controls}<section className="space-y-6"><div className="grid gap-4 md:grid-cols-4"><ResultCard title="Radiator flux" value={`${fmt(model.qFlux)} W/m²`} /><ResultCard title="Required area" value={`${fmt(model.area)} m²`} /><ResultCard title="Radiator mass" value={`${fmt(model.mass)} kg`} /><ResultCard title="Cooling overhead" value={`${fmt(model.activeOverhead,1)} kW`} sub="active reference" /></div><ChartPanel model={model} /><Note /></section></div></AppFrame>;
  }

  if (mode === "orbit") {
    const orbitData: Record<string, { eclipse: number; solar: number; earthIR: number; albedo: number; note: string }> = {
      LEO: { eclipse: 35, solar: 1361, earthIR: 237, albedo: 410, note: "Highest Earth IR and albedo exposure; frequent eclipse cycling." },
      SSO: { eclipse: 30, solar: 1361, earthIR: 237, albedo: 380, note: "Thermal environment depends strongly on beta angle and local time." },
      GEO: { eclipse: 5, solar: 1361, earthIR: 20, albedo: 35, note: "Lower Earth loading but long continuous sun exposure." },
      Cislunar: { eclipse: 10, solar: 1361, earthIR: 5, albedo: 10, note: "Deep-space-like sink with mission-specific lunar effects." },
      DeepSpace: { eclipse: 0, solar: 1361, earthIR: 0, albedo: 0, note: "Best radiator sink, but solar attitude still matters." },
    };
    const d = orbitData[orbit];
    return <AppFrame mode={mode}><div className="grid gap-6 lg:grid-cols-[360px_1fr]"><section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="mb-4 text-lg font-semibold">Orbit selection</h2><select className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white" value={orbit} onChange={(e)=>setOrbit(e.target.value)}>{Object.keys(orbitData).map(o=><option key={o}>{o}</option>)}</select><p className="mt-4 text-sm leading-6 text-white/60">{d.note}</p></section><section className="space-y-6"><div className="grid gap-4 md:grid-cols-4"><ResultCard title="Solar flux" value={`${d.solar} W/m²`} /><ResultCard title="Eclipse fraction" value={`${d.eclipse}%`} /><ResultCard title="Earth IR" value={`${d.earthIR} W/m²`} /><ResultCard title="Albedo estimate" value={`${d.albedo} W/m²`} /></div><div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h2 className="mb-5 text-lg font-semibold">Environment loading</h2><MiniBar label="Solar" value={d.solar} max={1400} suffix=" W/m²"/><div className="mt-4"><MiniBar label="Earth IR" value={d.earthIR} max={1400} suffix=" W/m²"/></div><div className="mt-4"><MiniBar label="Albedo" value={d.albedo} max={1400} suffix=" W/m²"/></div></div><Note /></section></div></AppFrame>;
  }

  if (mode === "radiator") {
    return <AppFrame mode={mode}><div className="grid gap-6 lg:grid-cols-[360px_1fr]">{Controls}<section className="space-y-6"><div className="grid gap-4 md:grid-cols-3"><ResultCard title="Area" value={`${fmt(model.area)} m²`} /><ResultCard title="Mass" value={`${fmt(model.mass)} kg`} /><ResultCard title="Specific rejection" value={`${fmt(1000/arealDensity,0)} W/kg`} sub="at 1 kW/m² reference" /></div><div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h2 className="mb-5 text-lg font-semibold">Radiator type guide</h2><div className="overflow-hidden rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/10 text-white"><tr><th className="p-3">Architecture</th><th className="p-3">Areal density</th><th className="p-3">Best use</th></tr></thead><tbody className="divide-y divide-white/10 text-white/70"><tr><td className="p-3">Fixed</td><td className="p-3">8–15 kg/m²</td><td className="p-3">Mature small/medium spacecraft</td></tr><tr><td className="p-3">Deployable</td><td className="p-3">4–10 kg/m²</td><td className="p-3">Large area with flight heritage path</td></tr><tr><td className="p-3">Flexible / inflatable</td><td className="p-3">1–3 kg/m²</td><td className="p-3">Future MW-class concepts</td></tr></tbody></table></div></div></section></div></AppFrame>;
  }

  if (mode === "architecture") {
    return <AppFrame mode={mode}><div className="grid gap-6 lg:grid-cols-[360px_1fr]"><section className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="text-lg font-semibold">Architecture assumptions</h2><Slider label="Active overhead" value={activeOverheadPct} min={0} max={20} step={0.5} unit="%" onChange={setActiveOverheadPct}/><Slider label="Passive overhead" value={passiveOverheadPct} min={0} max={5} step={0.1} unit="%" onChange={setPassiveOverheadPct}/><Slider label="Thermal load" value={itLoad} min={10} max={10000} step={10} unit="kW" onChange={setItLoad}/></section><section className="space-y-6"><div className="grid gap-4 md:grid-cols-2"><ArchitectureCard title="Centralized active" rows={[['Heat rejected', `${fmt(itLoad+model.activeOverhead,1)} kW`], ['Overhead power', `${fmt(model.activeOverhead,1)} kW`], ['Radiator area', `${fmt(model.activeArea)} m²`], ['Subsystem mass', `${fmt(model.activeMass)} kg`], ['Transport', 'Pumped loop / active control']]}/><ArchitectureCard title="Nuwatts-style passive" rows={[['Heat rejected', `${fmt(itLoad+model.passiveOverhead,1)} kW`], ['Overhead power', `${fmt(model.passiveOverhead,1)} kW`], ['Radiator area', `${fmt(model.passiveArea)} m²`], ['Subsystem mass', `${fmt(model.passiveMass)} kg`], ['Transport', 'Passive thermomagnetic layer']]}/></div><div className="grid gap-4 md:grid-cols-3"><ResultCard title="Overhead reduction" value={`${fmt(model.activeOverhead-model.passiveOverhead,1)} kW`} /><ResultCard title="Mass difference" value={`${fmt(model.activeMass-model.passiveMass)} kg`} /><ResultCard title="Area difference" value={`${fmt(model.activeArea-model.passiveArea)} m²`} /></div><Note /></section></div></AppFrame>;
  }

  if (mode === "trade") {
    const tempLow = flux(radiatorTemp*0.8, sinkTemp, emissivity, effectiveness); const tempHigh = flux(radiatorTemp*1.2, sinkTemp, emissivity, effectiveness);
    return <AppFrame mode={mode}><div className="grid gap-6 lg:grid-cols-[360px_1fr]">{Controls}<section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h2 className="mb-5 text-lg font-semibold">Sensitivity dashboard</h2><div className="grid gap-5"><MiniBar label="Area at -20% radiator temperature" value={itLoad*1000/tempLow} max={Math.max(itLoad*1000/tempLow, model.area, itLoad*1000/tempHigh)} suffix=" m²"/><MiniBar label="Current area" value={model.area} max={Math.max(itLoad*1000/tempLow, model.area, itLoad*1000/tempHigh)} suffix=" m²"/><MiniBar label="Area at +20% radiator temperature" value={itLoad*1000/tempHigh} max={Math.max(itLoad*1000/tempLow, model.area, itLoad*1000/tempHigh)} suffix=" m²"/></div><p className="mt-6 text-sm leading-6 text-white/60">Temperature has a fourth-power effect through Stefan–Boltzmann radiation, so allowable radiator temperature is often the highest-leverage design variable.</p></section></div></AppFrame>;
  }

  if (mode === "materials") {
    return <AppFrame mode={mode}><section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h1 className="text-3xl font-semibold">Thermal materials reference</h1><p className="mt-3 max-w-3xl text-white/60">Starting values for early trade studies. Replace with mission-qualified vendor or literature data before formal design work.</p><div className="mt-6 overflow-hidden rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/10 text-white"><tr><th className="p-4">Material / component</th><th className="p-4">Typical kg/m²</th><th className="p-4">Notes</th></tr></thead><tbody className="divide-y divide-white/10 text-white/70">{materialRows.map((r)=><tr key={r[0]}><td className="p-4 font-medium text-white">{r[0]}</td><td className="p-4">{r[1]}</td><td className="p-4">{r[2]}</td></tr>)}</tbody></table></div></section></AppFrame>;
  }

  return <AppFrame mode={mode}><section className="grid gap-6 lg:grid-cols-[1fr_360px]"><div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h1 className="text-3xl font-semibold">Design-case report</h1><p className="mt-3 text-white/60">Copy this summary into an investor memo, engineering note, or customer discovery document.</p><pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white/75">{`Nuwatts Thermal Studio preliminary case\n\nThermal design load: ${fmt(itLoad)} kW\nRadiator temperature: ${fmt(radiatorTemp)} K\nRadiator flux: ${fmt(model.qFlux)} W/m²\nRequired radiator area: ${fmt(model.area)} m²\nEstimated radiator mass: ${fmt(model.mass)} kg\nActive overhead assumption: ${fmt(activeOverheadPct,1)}% (${fmt(model.activeOverhead,1)} kW)\nPassive overhead assumption: ${fmt(passiveOverheadPct,1)}% (${fmt(model.passiveOverhead,1)} kW)\nEstimated overhead reduction: ${fmt(model.activeOverhead-model.passiveOverhead,1)} kW\n\nNote: preliminary first-order model only.`}</pre></div><div className="space-y-4"><ResultCard title="Report status" value="Ready" sub="Copy/paste summary"/><ResultCard title="Model type" value="First order" sub="Not flight design"/></div></section></AppFrame>;
}

function ChartPanel({ model }: { model: { activeArea: number; passiveArea: number; activeMass: number; passiveMass: number } }) {
  const max = Math.max(model.activeArea, model.passiveArea, model.activeMass, model.passiveMass);
  return <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h2 className="mb-5 text-lg font-semibold">Live architecture comparison</h2><div className="grid gap-5"><MiniBar label="Active radiator area" value={model.activeArea} max={max} suffix=" m²"/><MiniBar label="Passive radiator area" value={model.passiveArea} max={max} suffix=" m²"/><MiniBar label="Active subsystem mass" value={model.activeMass} max={max} suffix=" kg"/><MiniBar label="Passive subsystem mass" value={model.passiveMass} max={max} suffix=" kg"/></div></div>;
}

function ArchitectureCard({ title, rows }: { title: string; rows: string[][] }) {
  return <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h2 className="mb-4 text-xl font-semibold">{title}</h2><div className="divide-y divide-white/10">{rows.map(([k,v])=><div key={k} className="flex justify-between gap-4 py-3 text-sm"><span className="text-white/60">{k}</span><b className="text-right text-white">{v}</b></div>)}</div></div>;
}

function Note() {
  return <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50/80">These tools are preliminary trade-study calculators. Results are useful for intuition, customer discovery, and investor discussions, but they are not a substitute for detailed spacecraft thermal analysis.</div>;
}
