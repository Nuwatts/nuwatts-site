"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ToolKey =
  | "home"
  | "thermal-studio"
  | "orbital-economics"
  | "orbit-effects"
  | "radiator-sizing"
  | "architecture-comparison"
  | "trade-study"
  | "materials"
  | "reports";

const tools: { key: ToolKey; label: string; href: string; blurb: string }[] = [
  { key: "home", label: "Tools Home", href: "/tools/", blurb: "Overview of Nuwatts engineering tools" },
  { key: "thermal-studio", label: "Thermal Studio", href: "/tools/thermal-studio/", blurb: "First-order orbital thermal sizing" },
  { key: "orbital-economics", label: "Orbital Economics", href: "/orbital-thermal-economics/", blurb: "Interactive thermal overhead, radiator area, and mass economics simulator" },
  { key: "orbit-effects", label: "Orbit Effects", href: "/tools/orbit-effects/", blurb: "Solar, albedo, Earth IR, eclipse factors" },
  { key: "radiator-sizing", label: "Radiator Sizing", href: "/tools/radiator-sizing/", blurb: "Area, mass, flux, and deployment burden" },
  { key: "architecture-comparison", label: "Architecture", href: "/tools/architecture-comparison/", blurb: "Centralized active vs distributed passive" },
  { key: "trade-study", label: "Trade Study", href: "/tools/trade-study/", blurb: "Compare mission cases side by side" },
  { key: "materials", label: "Materials", href: "/tools/materials/", blurb: "Starter thermal materials database" },
  { key: "reports", label: "Reports", href: "/tools/reports/", blurb: "Create a summary for investors or engineers" },
];

const materials = [
  ["Aluminum panel", "150–220", "2.7", "Mature radiator structures; high conductivity, simple manufacturing."],
  ["Carbon-carbon", "20–200+", "1.6–2.0", "High-temperature lightweight radiator concepts; qualification dependent."],
  ["Pyrolytic graphite sheet", "700–1700 in-plane", "2.0–2.3", "Excellent heat spreading; anisotropic and integration-sensitive."],
  ["Ammonia loop", "Working fluid", "—", "Common spacecraft thermal transport fluid for moderate temperature loops."],
  ["Variable-emissivity coating", "Surface control", "—", "Useful for thermal regulation, usually not primary MW heat rejection."],
];

function format(n: number, digits = 0) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function flux(tempK: number, sinkK: number, emissivity: number, derate: number) {
  const sigma = 5.670374419e-8;
  return Math.max(
    1,
    emissivity *
      sigma *
      (Math.pow(tempK, 4) - Math.pow(sinkK, 4)) *
      (derate / 100)
  );
}

type Inputs = {
  computeKW: number;
  heatFraction: number;
  radiatorTempK: number;
  sinkTempK: number;
  emissivity: number;
  derating: number;
  arealDensity: number;
  activeOverhead: number;
  passiveOverhead: number;
  activeHardware: number;
  passiveHardware: number;
  loopCapacityKW: number;
  albedo: number;
  earthIR: number;
  solarExposure: number;
  eclipseFraction: number;
};

function scenario(v: Inputs, overheadPct: number, hardwarePct: number) {
  const computeHeatKW = v.computeKW * (v.heatFraction / 100);
  const overheadKW = v.computeKW * (overheadPct / 100);
  const totalKW = computeHeatKW + overheadKW;
  const heatFlux = flux(
    v.radiatorTempK,
    v.sinkTempK,
    v.emissivity,
    v.derating
  );
  const area = (totalKW * 1000) / heatFlux;
  const radiatorMass = area * v.arealDensity;
  const hardwareMass = radiatorMass * (hardwarePct / 100);

  return {
    computeHeatKW,
    overheadKW,
    totalKW,
    heatFlux,
    area,
    radiatorMass,
    hardwareMass,
    totalMass: radiatorMass + hardwareMass,
  };
}

const defaults: Inputs = {
  computeKW: 100,
  heatFraction: 98,
  radiatorTempK: 350,
  sinkTempK: 3,
  emissivity: 0.9,
  derating: 70,
  arealDensity: 8,
  activeOverhead: 5,
  passiveOverhead: 0.2,
  activeHardware: 35,
  passiveHardware: 15,
  loopCapacityKW: 5,
  albedo: 0.3,
  earthIR: 237,
  solarExposure: 35,
  eclipseFraction: 35,
};

function Slider({
  label,
  value,
  set,
  min,
  max,
  step,
  unit,
  digits = 0,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  digits?: number;
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="text-white/70">{label}</span>
        <strong className="text-white">
          {format(value, digits)}
          {unit ? ` ${unit}` : ""}
        </strong>
      </div>
      <input
        className="w-full accent-cyan-300"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
    </label>
  );
}

function Card({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-glow">
      <div className="text-sm text-white/55">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      {note && <div className="mt-2 text-xs text-white/45">{note}</div>}
    </div>
  );
}

function MiniBars({
  active,
  passive,
}: {
  active: ReturnType<typeof scenario>;
  passive: ReturnType<typeof scenario>;
}) {
  const rows = [
    ["Area", active.area, passive.area, "m²"],
    ["Mass", active.totalMass, passive.totalMass, "kg"],
    ["Overhead", active.overheadKW, passive.overheadKW, "kW"],
  ] as const;

  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-black/20 p-5">
      {rows.map(([name, a, p, unit]) => {
        const max = Math.max(a, p, 1);

        return (
          <div key={name}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-white/65">{name}</span>
              <span className="text-white/45">Active vs passive</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs text-white/50">Active</span>
                <div className="h-3 flex-1 rounded-full bg-white/10">
                  <div
                    className="h-3 rounded-full bg-orange-300"
                    style={{ width: `${(a / max) * 100}%` }}
                  />
                </div>
                <span className="w-24 text-right text-xs text-white/65">
                  {format(a, a < 10 ? 1 : 0)} {unit}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-16 text-xs text-white/50">Passive</span>
                <div className="h-3 flex-1 rounded-full bg-white/10">
                  <div
                    className="h-3 rounded-full bg-cyan-300"
                    style={{ width: `${(p / max) * 100}%` }}
                  />
                </div>
                <span className="w-24 text-right text-xs text-white/65">
                  {format(p, p < 10 ? 1 : 0)} {unit}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EngineeringSuite({ tool = "home" }: { tool?: ToolKey }) {
  const [v, setV] = useState<Inputs>(defaults);
  const [inputsLoaded, setInputsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("nuwatts-engineering-inputs");

      if (saved) {
        const parsed = JSON.parse(saved);
        setV({
          ...defaults,
          ...parsed,
        });
      }
    } catch (error) {
      console.error("Unable to load saved Engineering Suite inputs:", error);
    } finally {
      setInputsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!inputsLoaded) return;

    try {
      window.localStorage.setItem(
        "nuwatts-engineering-inputs",
        JSON.stringify(v)
      );
    } catch (error) {
      console.error("Unable to save Engineering Suite inputs:", error);
    }
  }, [v, inputsLoaded]);

  const set = (k: keyof Inputs) => (n: number) =>
    setV((prev) => ({ ...prev, [k]: n }));
  
  const resetDefaults = () => {
  setV(defaults);
  window.localStorage.setItem(
    "nuwatts-engineering-inputs",
    JSON.stringify(defaults)
  );
};
  const active = useMemo(
    () => scenario(v, v.activeOverhead, v.activeHardware),
    [v]
  );
  const passive = useMemo(
    () => scenario(v, v.passiveOverhead, v.passiveHardware),
    [v]
  );
  const base = useMemo(() => scenario(v, 0, 0), [v]);
  const activeTool = tools.find((t) => t.key === tool) || tools[0];

  return (
    <div className="min-h-screen bg-space-gradient text-white">
      <header className="border-b border-white/10 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-4">
              <img
                src="/visuals/nuwatts-logo.png"
                alt="Nuwatts"
                className="h-11 w-auto rounded-sm"
              />
              <span className="hidden text-sm uppercase tracking-[.24em] text-white/55 sm:block">
                Engineering Suite
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={resetDefaults}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
              >
                Reset to Defaults
              </button>

              <Link
                href="/"
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
              >
                Back to Nuwatts
              </Link>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1">
            {tools.map((t) => (
              <Link
                key={t.key}
                href={t.href}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                  t.key === tool
                    ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                    : "border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/10"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="mb-8">
        
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[.22em] text-cyan-200/80">
            Nuwatts Thermal Infrastructure
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
            {activeTool.label}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/62">
            {activeTool.blurb}. These tools are first-order trade-study models
            for early orbital compute thermal architecture exploration.
          </p>
        </div>

        {tool === "home" && <Home />}
        {tool === "thermal-studio" && (
          <ThermalStudio
            v={v}
            set={set}
            base={base}
            active={active}
            passive={passive}
          />
        )}
        {tool === "orbit-effects" && <OrbitEffects v={v} set={set} />}
        {tool === "radiator-sizing" && (
          <RadiatorSizing v={v} set={set} base={base} />
        )}
        {tool === "architecture-comparison" && (
          <Architecture
            v={v}
            set={set}
            active={active}
            passive={passive}
          />
        )}
        {tool === "trade-study" && (
          <TradeStudy v={v} active={active} passive={passive} />
        )}
        {tool === "materials" && <Materials />}
        {tool === "reports" && (
          <Reports v={v} active={active} passive={passive} />
        )}
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tools
        .filter((t) => t.key !== "home")
        .map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]"
          >
            <h2 className="text-xl font-semibold">{t.label}</h2>
            <p className="mt-3 text-sm leading-6 text-white/55">{t.blurb}</p>
          </Link>
        ))}
    </div>
  );
}

function CommonControls({
  v,
  set,
}: {
  v: Inputs;
  set: (k: keyof Inputs) => (n: number) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Slider
        label="Compute power"
        value={v.computeKW}
        set={set("computeKW")}
        min={1}
        max={5000}
        step={1}
        unit="kW"
      />

      <Slider
        label="Radiator temperature"
        value={v.radiatorTempK}
        set={set("radiatorTempK")}
        min={250}
        max={500}
        step={1}
        unit="K"
      />

      <Slider
        label="Emissivity"
        value={v.emissivity}
        set={set("emissivity")}
        min={0.5}
        max={0.98}
        step={0.01}
        digits={2}
      />

      <Slider
        label="Environmental derating"
        value={v.derating}
        set={set("derating")}
        min={20}
        max={100}
        step={1}
        unit="%"
      />

      <Slider
        label="Areal density"
        value={v.arealDensity}
        set={set("arealDensity")}
        min={1}
        max={20}
        step={0.1}
        unit="kg/m²"
        digits={1}
      />

      <Slider
        label="Heat fraction"
        value={v.heatFraction}
        set={set("heatFraction")}
        min={80}
        max={100}
        step={1}
        unit="%"
      />
    </div>
  );
}

function ThermalStudio({
  v,
  set,
  base,
  active,
  passive,
}: {
  v: Inputs;
  set: (k: keyof Inputs) => (n: number) => void;
  base: ReturnType<typeof scenario>;
  active: ReturnType<typeof scenario>;
  passive: ReturnType<typeof scenario>;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.95fr]">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <h2 className="mb-5 text-xl font-semibold">Mission inputs</h2>
        <CommonControls v={v} set={set} />
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card
            label="Compute heat"
            value={`${format(base.computeHeatKW, 1)} kW`}
          />
          <Card label="Heat flux" value={`${format(base.heatFlux, 0)} W/m²`} />
          <Card label="Radiator area" value={`${format(base.area, 0)} m²`} />
          <Card
            label="Radiator mass"
            value={`${format(base.radiatorMass, 0)} kg`}
          />
        </div>

        <MiniBars active={active} passive={passive} />
      </section>
    </div>
  );
}

function OrbitEffects({
  v,
  set,
}: {
  v: Inputs;
  set: (k: keyof Inputs) => (n: number) => void;
}) {
  const absorbedSolar =
    1361 * (v.solarExposure / 100) * (1 + v.albedo);

  const netSink = Math.pow(
    Math.max(
      1,
      Math.pow(v.sinkTempK, 4) +
        ((absorbedSolar + v.earthIR) * (1 - v.eclipseFraction / 100)) /
          (5.670374419e-8 * 4)
    ),
    0.25
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <h2 className="mb-5 text-xl font-semibold">
          Orbit environment assumptions
        </h2>

        <div className="grid gap-4">
          <Slider
            label="Solar exposure"
            value={v.solarExposure}
            set={set("solarExposure")}
            min={0}
            max={100}
            step={1}
            unit="%"
          />

          <Slider
            label="Eclipse fraction"
            value={v.eclipseFraction}
            set={set("eclipseFraction")}
            min={0}
            max={70}
            step={1}
            unit="%"
          />

          <Slider
            label="Albedo factor"
            value={v.albedo}
            set={set("albedo")}
            min={0}
            max={0.6}
            step={0.01}
            digits={2}
          />

          <Slider
            label="Earth IR"
            value={v.earthIR}
            set={set("earthIR")}
            min={0}
            max={300}
            step={1}
            unit="W/m²"
          />
        </div>
      </section>

      <section className="grid content-start gap-4">
        <Card
          label="Approx. absorbed environment"
          value={`${format(absorbedSolar + v.earthIR, 0)} W/m²`}
          note="Simplified surface exposure estimate"
        />

        <Card
          label="Effective environment temperature proxy"
          value={`${format(netSink, 0)} K`}
          note="Not a replacement for orbit thermal modeling"
        />

        <Card
          label="Cooling penalty"
          value={`${format(Math.max(0, (netSink - 3) / 3), 0)}×`}
          note="Higher environment loading reduces thermal margin"
        />
      </section>
    </div>
  );
}

function RadiatorSizing({
  v,
  set,
  base,
}: {
  v: Inputs;
  set: (k: keyof Inputs) => (n: number) => void;
  base: ReturnType<typeof scenario>;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <h2 className="mb-5 text-xl font-semibold">Radiator sizing</h2>
        <CommonControls v={v} set={set} />
      </section>

      <section className="grid content-start gap-4">
        <Card label="Required area" value={`${format(base.area, 0)} m²`} />
        <Card
          label="Required mass"
          value={`${format(base.radiatorMass, 0)} kg`}
        />
        <Card
          label="Specific rejection"
          value={`${format(base.heatFlux / v.arealDensity, 1)} W/kg`}
          note="Heat flux divided by areal density"
        />
        <Card
          label="Panel equivalent"
          value={`${format(base.area / 25, 1)} panels`}
          note="Assumes 25 m² deployed panel equivalent"
        />
      </section>
    </div>
  );
}

function Architecture({
  v,
  set,
  active,
  passive,
}: {
  v: Inputs;
  set: (k: keyof Inputs) => (n: number) => void;
  active: ReturnType<typeof scenario>;
  passive: ReturnType<typeof scenario>;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <h2 className="mb-5 text-xl font-semibold">
          Architecture assumptions
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Slider
            label="Active overhead"
            value={v.activeOverhead}
            set={set("activeOverhead")}
            min={0}
            max={25}
            step={0.5}
            unit="%"
            digits={1}
          />

          <Slider
            label="Passive overhead"
            value={v.passiveOverhead}
            set={set("passiveOverhead")}
            min={0}
            max={5}
            step={0.1}
            unit="%"
            digits={1}
          />

          <Slider
            label="Active hardware mass"
            value={v.activeHardware}
            set={set("activeHardware")}
            min={0}
            max={100}
            step={1}
            unit="% of radiator"
          />

          <Slider
            label="Passive hardware mass"
            value={v.passiveHardware}
            set={set("passiveHardware")}
            min={0}
            max={100}
            step={1}
            unit="% of radiator"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ArchCard title="Centralized active" s={active} />
        <ArchCard title="Distributed passive" s={passive} />
      </div>

      <MiniBars active={active} passive={passive} />
    </div>
  );
}

function ArchCard({
  title,
  s,
}: {
  title: string;
  s: ReturnType<typeof scenario>;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>

      {[
        ["Heat to reject", `${format(s.totalKW, 1)} kW`],
        ["Radiator area", `${format(s.area, 0)} m²`],
        ["Radiator mass", `${format(s.radiatorMass, 0)} kg`],
        ["Transport hardware", `${format(s.hardwareMass, 0)} kg`],
        ["Total thermal mass", `${format(s.totalMass, 0)} kg`],
        ["Overhead power", `${format(s.overheadKW, 1)} kW`],
      ].map(([a, b]) => (
        <div
          key={a}
          className="mt-4 flex justify-between border-t border-white/10 pt-4 text-sm"
        >
          <span className="text-white/55">{a}</span>
          <strong>{b}</strong>
        </div>
      ))}
    </div>
  );
}

function TradeStudy({
  v,
  active,
  passive,
}: {
  v: Inputs;
  active: ReturnType<typeof scenario>;
  passive: ReturnType<typeof scenario>;
}) {
  const cases = [50, 100, 500, 1000, 5000].map((kW) => {
    const vv = { ...v, computeKW: kW };

    return {
      kW,
      a: scenario(vv, v.activeOverhead, v.activeHardware),
      p: scenario(vv, v.passiveOverhead, v.passiveHardware),
    };
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-white/10 text-white/70">
          <tr>
            <th className="p-4">Compute</th>
            <th className="p-4">Active mass</th>
            <th className="p-4">Passive mass</th>
            <th className="p-4">Mass delta</th>
            <th className="p-4">Overhead saved</th>
          </tr>
        </thead>

        <tbody>
          {cases.map((c) => (
            <tr key={c.kW} className="border-t border-white/10">
              <td className="p-4 font-semibold">{format(c.kW)} kW</td>
              <td className="p-4">{format(c.a.totalMass)} kg</td>
              <td className="p-4">{format(c.p.totalMass)} kg</td>
              <td className="p-4">
                {format(c.a.totalMass - c.p.totalMass)} kg
              </td>
              <td className="p-4">
                {format(c.a.overheadKW - c.p.overheadKW, 1)} kW
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Materials() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-white/10 text-white/70">
          <tr>
            <th className="p-4">Material / technology</th>
            <th className="p-4">Conductivity / role</th>
            <th className="p-4">Density</th>
            <th className="p-4">Notes</th>
          </tr>
        </thead>

        <tbody>
          {materials.map((r) => (
            <tr key={r[0]} className="border-t border-white/10">
              <td className="p-4 font-semibold">{r[0]}</td>
              <td className="p-4">{r[1]}</td>
              <td className="p-4">{r[2]}</td>
              <td className="p-4 text-white/60">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Reports({
  v,
  active,
  passive,
}: {
  v: Inputs;
  active: ReturnType<typeof scenario>;
  passive: ReturnType<typeof scenario>;
}) {
  const loops = Math.ceil(passive.totalKW / v.loopCapacityKW);
  const massReduction = active.totalMass - passive.totalMass;
  const massReductionPct =
    active.totalMass > 0 ? (massReduction / active.totalMass) * 100 : 0;
  const overheadReduction = active.overheadKW - passive.overheadKW;

  return (
    <div>
      <div
        id="print-report"
        className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"
      >
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[.2em] text-cyan-200/80">
            Nuwatts Engineering Suite
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            Thermal Infrastructure Summary Report
          </h2>
          <p className="mt-2 text-sm text-white/55">
            Preliminary orbital compute thermal trade study
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card
            label="Compute power"
            value={`${format(v.computeKW)} kW`}
          />
          <Card
            label="Radiator temperature"
            value={`${format(v.radiatorTempK)} K`}
          />
          <Card
            label="Active thermal mass"
            value={`${format(active.totalMass)} kg`}
          />
          <Card
            label="Passive thermal mass"
            value={`${format(passive.totalMass)} kg`}
          />
          <Card
            label="Mass reduction"
            value={`${format(massReduction)} kg`}
            note={`${format(massReductionPct, 1)}% reduction versus active baseline`}
          />
          <Card
            label="Overhead power reduction"
            value={`${format(overheadReduction, 1)} kW`}
          />
          <Card
            label="Active radiator area"
            value={`${format(active.area)} m²`}
          />
          <Card
            label="Passive radiator area"
            value={`${format(passive.area)} m²`}
          />
          <Card
            label="Estimated passive loops"
            value={`${format(loops)}`}
            note={`Assumes ${format(v.loopCapacityKW, 1)} kW per loop`}
          />
          <Card
            label="Passive heat rejection load"
            value={`${format(passive.totalKW, 1)} kW`}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5">
          <h3 className="text-lg font-semibold">Model assumptions</h3>

          <div className="mt-4 grid gap-x-8 gap-y-2 text-sm text-white/65 md:grid-cols-2">
            <p>Heat fraction: {format(v.heatFraction)}%</p>
            <p>Emissivity: {format(v.emissivity, 2)}</p>
            <p>Environmental derating: {format(v.derating)}%</p>
            <p>Sink temperature: {format(v.sinkTempK)} K</p>
            <p>
              Radiator areal density: {format(v.arealDensity, 1)} kg/m²
            </p>
            <p>
              Active overhead assumption: {format(v.activeOverhead, 1)}%
            </p>
            <p>
              Passive overhead assumption: {format(v.passiveOverhead, 1)}%
            </p>
            <p>
              Active transport hardware: {format(v.activeHardware)}% of radiator
              mass
            </p>
            <p>
              Passive transport hardware: {format(v.passiveHardware)}% of
              radiator mass
            </p>
            <p>
              Passive loop capacity: {format(v.loopCapacityKW, 1)} kW
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5">
          <h3 className="text-lg font-semibold">Interpretation</h3>
          <p className="mt-3 text-sm leading-7 text-white/65">
            Under the selected assumptions, the distributed passive case reduces
            modeled thermal-system mass by {format(massReduction)} kg (
            {format(massReductionPct, 1)}%) and thermal overhead by{" "}
            {format(overheadReduction, 1)} kW relative to the centralized active
            baseline. These values are first-order trade-study outputs and are
            highly sensitive to radiator temperature, emissivity, environmental
            loading, areal density, and architecture assumptions.
          </p>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-white/45">
          Nuwatts Engineering Suite — preliminary analysis only. This report is
          intended for early trade studies, investor/customer discussion, and
          architecture exploration. Replace default assumptions with
          mission-specific thermal analysis before engineering or flight use.
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => window.print()}
          className="rounded-full bg-cyan-300 px-5 py-3 font-semibold text-ink hover:bg-cyan-200"
        >
          Print / Save as PDF
        </button>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 0.5in;
          }

          body * {
            visibility: hidden !important;
          }

          #print-report,
          #print-report * {
            visibility: visible !important;
          }

          #print-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }

          #print-report * {
            color: black !important;
            background: transparent !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }

          #print-report > div,
          #print-report .rounded-2xl,
          #print-report .rounded-3xl {
            border-color: #d1d5db !important;
          }

          #print-report .grid {
            break-inside: avoid;
          }

          #print-report h2,
          #print-report h3,
          #print-report p {
            break-inside: avoid;
          }

          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
