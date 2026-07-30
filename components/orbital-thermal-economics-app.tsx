"use client";

import React, { useMemo, useState } from "react";

type OrbitKey = "LEO" | "SSO" | "GEO" | "Cislunar";
type PayloadKey = "AI Compute" | "Optical Comms" | "SAR / RF" | "General Avionics";
type ArchitectureKey = "Heat Pipes" | "Loop Heat Pipes" | "Pumped Loop" | "Hybrid Thermal Bus";

const sigma = 5.670374419e-8;
const launchCostPerKg = 10000;
const solarSpecificPowerWkg = 150;

const orbitFactors: Record<OrbitKey, number> = {
  LEO: 1.2,
  SSO: 1.3,
  GEO: 1.1,
  Cislunar: 1.0,
};

const payloadDefaults: Record<PayloadKey, { conventionalOverhead: number; description: string }> = {
  "AI Compute": { conventionalOverhead: 10, description: "High-density onboard processing and inference payloads" },
  "Optical Comms": { conventionalOverhead: 7, description: "Thermally sensitive laser communication terminals" },
  "SAR / RF": { conventionalOverhead: 12, description: "High-power RF electronics and duty-cycle-driven thermal loads" },
  "General Avionics": { conventionalOverhead: 5, description: "Distributed spacecraft electronics and avionics bays" },
};

const architectureMass: Record<ArchitectureKey, number> = {
  "Heat Pipes": 4,
  "Loop Heat Pipes": 5,
  "Pumped Loop": 7,
  "Hybrid Thermal Bus": 6,
};

function formatPower(kW: number) {
  if (Math.abs(kW) >= 1_000_000) return `${(kW / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 })} GW`;
  if (Math.abs(kW) >= 1_000) return `${(kW / 1_000).toLocaleString(undefined, { maximumFractionDigits: 2 })} MW`;
  return `${kW.toLocaleString(undefined, { maximumFractionDigits: 1 })} kW`;
}

function fmt(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function dollars(value: number) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
}

function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix: string }) {
  const width = max > 0 ? Math.max(3, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-4 text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-950">{fmt(value)} {suffix}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-3 rounded-full bg-slate-950 transition-all duration-300" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm leading-5 text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      {note && <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>}
    </div>
  );
}

function ArchitectureDiagram({
  heatKw,
  overheadKw,
  area,
  nuwattsEnabled,
}: {
  heatKw: number;
  overheadKw: number;
  area: number;
  nuwattsEnabled: boolean;
}) {
  const radiatorScale = Math.max(52, Math.min(155, 48 + Math.log10(Math.max(area, 1)) * 32));
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">System Architecture View</h2>
          <p className="mt-1 text-sm text-slate-500">
            Visual screening model: payload heat moves through the thermal transport layer to the spacecraft heat rejection system.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${nuwattsEnabled ? "bg-cyan-100 text-cyan-900" : "bg-orange-100 text-orange-900"}`}>
          {nuwattsEnabled ? "Nuwatts enabled" : "Conventional"}
        </span>
      </div>

      <div className="mt-8 grid items-center gap-4 md:grid-cols-[1fr_60px_1fr_60px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Payload</div>
          <div className="mt-3 h-24 rounded-xl bg-slate-950 shadow-inner" />
          <p className="mt-3 text-sm text-slate-600">Compute / payload load</p>
          <p className="text-xl font-bold">{formatPower(heatKw)}</p>
        </div>

        <div className="hidden text-center text-4xl font-bold text-red-600 md:block">→</div>

        <div className={`rounded-2xl border p-5 ${nuwattsEnabled ? "border-cyan-200 bg-cyan-50" : "border-orange-200 bg-orange-50"}`}>
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Thermal Transport</div>
          <div className="mt-4 rounded-full border-4 border-slate-900 p-4">
            <div className={`h-10 rounded-full ${nuwattsEnabled ? "bg-cyan-500" : "bg-orange-500"}`} />
          </div>
          <p className="mt-3 text-sm text-slate-600">Parasitic overhead</p>
          <p className="text-xl font-bold">{formatPower(overheadKw)}</p>
        </div>

        <div className="hidden text-center text-4xl font-bold text-blue-600 md:block">→</div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Heat Rejection</div>
          <div className="mt-3 flex h-24 items-end gap-2">
            <div className="rounded bg-slate-900" style={{ width: 26, height: radiatorScale }} />
            <div className="rounded bg-slate-800" style={{ width: 26, height: radiatorScale * 0.9 }} />
            <div className="rounded bg-slate-700" style={{ width: 26, height: radiatorScale * 0.8 }} />
            <div className="ml-3 text-3xl text-blue-500">≈≈≈</div>
          </div>
          <p className="mt-3 text-sm text-slate-600">Radiator area</p>
          <p className="text-xl font-bold">{fmt(area)} m²</p>
        </div>
      </div>
    </div>
  );
}


function SystemReport({
  computeKw,
  orbit,
  payload,
  architecture,
  radiatorTempK,
  emissivity,
  nuwattsOverhead,
  specificMass,
  conventionalOverheadPct,
  results,
  onClose,
}: {
  computeKw: number;
  orbit: OrbitKey;
  payload: PayloadKey;
  architecture: ArchitectureKey;
  radiatorTempK: number;
  emissivity: number;
  nuwattsOverhead: number;
  specificMass: number;
  conventionalOverheadPct: number;
  results: {
    conventionalOverheadKw: number;
    nuwattsOverheadKw: number;
    powerSavedKw: number;
    conventionalHeatKw: number;
    nuwattsHeatKw: number;
    representativeFluxKwM2: number;
    conventionalArea: number;
    nuwattsArea: number;
    conventionalMass: number;
    nuwattsMass: number;
    massSavings: number;
    areaReduction: number;
    launchCostSavings: number;
    solarArrayMassReduction: number;
    annualEnergySavedKwh: number;
  };
  onClose: () => void;
}) {
  const massReductionPct =
    results.conventionalMass > 0
      ? (results.massSavings / results.conventionalMass) * 100
      : 0;

  const areaReductionPct =
    results.conventionalArea > 0
      ? (results.areaReduction / results.conventionalArea) * 100
      : 0;

  const overheadReductionPct =
    results.conventionalOverheadKw > 0
      ? (results.powerSavedKw / results.conventionalOverheadKw) * 100
      : 0;

  return (
    <div className="mt-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Return to Simulator
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-cyan-600 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-700"
        >
          Print / Save as PDF
        </button>
      </div>

      <article
        id="system-report"
        className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-10"
      >
        <header className="border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Nuwatts Engineering Suite
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Orbital Thermal System Report
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Preliminary system-level comparison of a conventional spacecraft
                thermal architecture and a Nuwatts-enabled thermal architecture.
              </p>
            </div>

            <img
              src="/visuals/nuwatts-logo.png"
              alt="Nuwatts"
              className="h-12 w-auto"
            />
          </div>
        </header>

        <section className="mt-7">
          <h2 className="text-xl font-bold text-slate-950">Mission Summary</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Payload load", formatPower(computeKw)],
              ["Payload type", payload],
              ["Orbit", orbit],
              ["Conventional architecture", architecture],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-2 font-bold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-950">Architecture Comparison</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Metric</th>
                  <th className="px-4 py-3 font-semibold">Conventional</th>
                  <th className="px-4 py-3 font-semibold">Nuwatts</th>
                  <th className="px-4 py-3 font-semibold">Difference</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Thermal overhead", formatPower(results.conventionalOverheadKw), formatPower(results.nuwattsOverheadKw), `${formatPower(results.powerSavedKw)} saved`],
                  ["Total heat rejected", formatPower(results.conventionalHeatKw), formatPower(results.nuwattsHeatKw), `${formatPower(results.powerSavedKw)} lower`],
                  ["Radiator area", `${fmt(results.conventionalArea)} m²`, `${fmt(results.nuwattsArea)} m²`, `${fmt(results.areaReduction)} m² lower`],
                  ["Estimated thermal mass", `${fmt(results.conventionalMass)} kg`, `${fmt(results.nuwattsMass)} kg`, `${fmt(results.massSavings)} kg lower`],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-slate-200">
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${index}`}
                        className={`px-4 py-3 ${index === 0 ? "font-semibold text-slate-950" : "text-slate-700"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-950">System Impact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Thermal overhead reduction", `${fmt(overheadReductionPct)}%`, `${formatPower(results.powerSavedKw)} recovered`],
              ["Thermal mass reduction", `${fmt(massReductionPct)}%`, `${fmt(results.massSavings)} kg modeled reduction`],
              ["Radiator area reduction", `${fmt(areaReductionPct)}%`, `${fmt(results.areaReduction)} m² modeled reduction`],
              ["Estimated launch-cost impact", dollars(results.launchCostSavings), `Based on $${launchCostPerKg.toLocaleString()}/kg`],
              ["Solar-array mass reduction", `${fmt(results.solarArrayMassReduction)} kg`, `Based on ${solarSpecificPowerWkg} W/kg`],
              ["Annual power allocation avoided", `${fmt(results.annualEnergySavedKwh, 0)} kWh`, "Continuous annual equivalent"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-2xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-950">Model Assumptions</h2>
          <div className="mt-4 grid gap-x-8 gap-y-3 rounded-2xl border border-slate-200 p-5 text-sm text-slate-700 sm:grid-cols-2">
            <p>Conventional overhead: {fmt(conventionalOverheadPct)}%</p>
            <p>Nuwatts overhead: {fmt(nuwattsOverhead, 2)}%</p>
            <p>Radiator temperature: {fmt(radiatorTempK, 0)} K</p>
            <p>Radiator emissivity: {fmt(emissivity, 2)}</p>
            <p>Specific radiator mass: {fmt(specificMass)} kg/m²</p>
            <p>Representative radiator flux: {fmt(results.representativeFluxKwM2, 2)} kW/m²</p>
            <p>Launch-cost assumption: ${launchCostPerKg.toLocaleString()}/kg</p>
            <p>Solar specific power: {solarSpecificPowerWkg} W/kg</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-bold text-slate-950">Interpretation and Limitations</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Under the selected assumptions, the Nuwatts-enabled case reduces modeled
            thermal overhead by {formatPower(results.powerSavedKw)}, radiator area by{" "}
            {fmt(results.areaReduction)} m², and thermal-system mass by{" "}
            {fmt(results.massSavings)} kg relative to the selected conventional
            architecture. These values are first-order screening estimates and are
            sensitive to mission-specific assumptions.
          </p>
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">
          Nuwatts Engineering Suite — preliminary analysis only. This report is
          intended for early trade studies, customer and investor discussion, and
          architecture exploration. It is not a substitute for mission-specific
          thermal analysis, component qualification, or flight design.
        </footer>
      </article>

      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 0.45in;
          }

          body * {
            visibility: hidden !important;
          }

          #system-report,
          #system-report * {
            visibility: visible !important;
          }

          #system-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
          }

          #system-report * {
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }

          #system-report section,
          #system-report table,
          #system-report .rounded-2xl {
            break-inside: avoid;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function OrbitalThermalEconomicsApp() {
  const [computeKw, setComputeKw] = useState(50);
  const [orbit, setOrbit] = useState<OrbitKey>("LEO");
  const [payload, setPayload] = useState<PayloadKey>("AI Compute");
  const [architecture, setArchitecture] = useState<ArchitectureKey>("Pumped Loop");
  const [radiatorTempK, setRadiatorTempK] = useState(300);
  const [emissivity, setEmissivity] = useState(0.9);
  const [nuwattsOverhead, setNuwattsOverhead] = useState(0.2);
  const [specificMass, setSpecificMass] = useState(5);
  const [nuwattsEnabled, setNuwattsEnabled] = useState(true);
  const [showReport, setShowReport] = useState(false);

  const conventionalOverheadPct = payloadDefaults[payload].conventionalOverhead;

  const results = useMemo(() => {
    const conventionalOverheadKw = computeKw * conventionalOverheadPct / 100;
    const nuwattsOverheadKw = computeKw * nuwattsOverhead / 100;
    const selectedOverheadKw = nuwattsEnabled ? nuwattsOverheadKw : conventionalOverheadKw;
    const powerSavedKw = conventionalOverheadKw - nuwattsOverheadKw;

    const conventionalHeatKw = computeKw + conventionalOverheadKw;
    const nuwattsHeatKw = computeKw + nuwattsOverheadKw;
    const selectedHeatKw = computeKw + selectedOverheadKw;

    const fluxWm2 = emissivity * sigma * Math.pow(radiatorTempK, 4);
    const representativeFluxKwM2 = (fluxWm2 / 1000) / orbitFactors[orbit];

    const conventionalArea = conventionalHeatKw / representativeFluxKwM2;
    const nuwattsArea = nuwattsHeatKw / representativeFluxKwM2;
    const selectedArea = selectedHeatKw / representativeFluxKwM2;

    const conventionalSpecificMass = Math.max(specificMass, architectureMass[architecture]);
    const conventionalMass = conventionalArea * conventionalSpecificMass;
    const nuwattsMass = nuwattsArea * specificMass;
    const selectedMass = nuwattsEnabled ? nuwattsMass : conventionalMass;

    const massSavings = conventionalMass - nuwattsMass;
    const areaReduction = conventionalArea - nuwattsArea;
    const launchCostSavings = massSavings * launchCostPerKg;
    const solarArrayMassReduction = (powerSavedKw * 1000) / solarSpecificPowerWkg;
    const annualEnergySavedKwh = powerSavedKw * 8760;

    return {
      conventionalOverheadKw,
      nuwattsOverheadKw,
      selectedOverheadKw,
      powerSavedKw,
      conventionalHeatKw,
      nuwattsHeatKw,
      selectedHeatKw,
      representativeFluxKwM2,
      conventionalArea,
      nuwattsArea,
      selectedArea,
      conventionalMass,
      nuwattsMass,
      selectedMass,
      massSavings,
      areaReduction,
      launchCostSavings,
      solarArrayMassReduction,
      annualEnergySavedKwh,
    };
  }, [computeKw, conventionalOverheadPct, nuwattsOverhead, radiatorTempK, emissivity, orbit, specificMass, architecture, nuwattsEnabled]);

  const maxPower = Math.max(results.conventionalOverheadKw, results.nuwattsOverheadKw);
  const maxArea = Math.max(results.conventionalArea, results.nuwattsArea);
  const maxMass = Math.max(results.conventionalMass, results.nuwattsMass);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-7xl px-6 py-10">
        {showReport ? (
          <SystemReport
            computeKw={computeKw}
            orbit={orbit}
            payload={payload}
            architecture={architecture}
            radiatorTempK={radiatorTempK}
            emissivity={emissivity}
            nuwattsOverhead={nuwattsOverhead}
            specificMass={specificMass}
            conventionalOverheadPct={conventionalOverheadPct}
            results={results}
            onClose={() => setShowReport(false)}
          />
        ) : (
          <>
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <img src="/visuals/nuwatts-logo.png" alt="Nuwatts" className="h-14 w-auto" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Nuwatts Engineering Suite</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                  Orbital Thermal Economics Simulator
                </h1>
              </div>
            </div>
            <a href="/tools/" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Back to Engineering Suite
            </a>
          </div>
          <p className="mt-5 max-w-4xl text-lg text-slate-600">
            Interactive trade-study tool for spacecraft and orbital compute thermal architectures. Explore how payload power,
            orbit, radiator temperature, and thermal architecture affect radiator area, thermal subsystem mass, and parasitic power.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
          <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">Inputs</h2>

            <label className="mt-6 block">
              <div className="flex justify-between text-sm font-medium">
                <span>Compute / payload load</span>
                <span>{formatPower(computeKw)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={1}
                max={5000000}
                step={computeKw < 10000 ? 1 : 1000}
                value={computeKw}
                onChange={(e) => setComputeKw(Number(e.target.value))}
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>1 kW</span><span>5 GW</span>
              </div>
            </label>

            <label className="mt-5 block text-sm font-medium">Payload type</label>
            <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900" value={payload} onChange={(e) => setPayload(e.target.value as PayloadKey)}>
              {Object.keys(payloadDefaults).map((p) => <option key={p}>{p}</option>)}
            </select>
            <p className="mt-2 text-xs text-slate-500">{payloadDefaults[payload].description}</p>

            <label className="mt-5 block text-sm font-medium">Orbit</label>
            <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900" value={orbit} onChange={(e) => setOrbit(e.target.value as OrbitKey)}>
              {Object.keys(orbitFactors).map((o) => <option key={o}>{o}</option>)}
            </select>

            <label className="mt-5 block text-sm font-medium">Conventional architecture</label>
            <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900" value={architecture} onChange={(e) => setArchitecture(e.target.value as ArchitectureKey)}>
              {Object.keys(architectureMass).map((a) => <option key={a}>{a}</option>)}
            </select>

            <div className="mt-5 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Scenario view</p>
                  <p className="text-xs text-slate-500">Toggle results between baseline and Nuwatts-enabled architecture.</p>
                </div>
                <button
                  onClick={() => setNuwattsEnabled(!nuwattsEnabled)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${nuwattsEnabled ? "bg-cyan-600 text-white" : "bg-orange-500 text-white"}`}
                >
                  {nuwattsEnabled ? "Nuwatts Enabled" : "Conventional"}
                </button>
              </div>
            </div>

            <label className="mt-5 block">
              <div className="flex justify-between text-sm font-medium">
                <span>Radiator temperature</span>
                <span>{radiatorTempK} K</span>
              </div>
              <input className="mt-2 w-full" type="range" min={260} max={380} step={5} value={radiatorTempK} onChange={(e) => setRadiatorTempK(Number(e.target.value))} />
            </label>

            <label className="mt-5 block">
              <div className="flex justify-between text-sm font-medium">
                <span>Radiator emissivity</span>
                <span>{emissivity.toFixed(2)}</span>
              </div>
              <input className="mt-2 w-full" type="range" min={0.5} max={0.95} step={0.01} value={emissivity} onChange={(e) => setEmissivity(Number(e.target.value))} />
            </label>

            <label className="mt-5 block">
              <div className="flex justify-between text-sm font-medium">
                <span>Nuwatts thermal overhead</span>
                <span>{nuwattsOverhead.toFixed(2)}%</span>
              </div>
              <input className="mt-2 w-full" type="range" min={0.05} max={3} step={0.05} value={nuwattsOverhead} onChange={(e) => setNuwattsOverhead(Number(e.target.value))} />
            </label>

            <label className="mt-5 block">
              <div className="flex justify-between text-sm font-medium">
                <span>Specific radiator mass</span>
                <span>{specificMass.toFixed(1)} kg/m²</span>
              </div>
              <input className="mt-2 w-full" type="range" min={2} max={15} step={0.5} value={specificMass} onChange={(e) => setSpecificMass(Number(e.target.value))} />
            </label>
          </aside>

          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <KpiCard label="Additional payload power enabled" value={formatPower(results.powerSavedKw)} note="Thermal overhead reduction" />
              <KpiCard label="Estimated launch cost savings" value={dollars(results.launchCostSavings)} note={`Assumes $${launchCostPerKg.toLocaleString()}/kg`} />
              <KpiCard label="Estimated solar array mass reduction" value={`${fmt(results.solarArrayMassReduction)} kg`} note={`Assumes ${solarSpecificPowerWkg} W/kg`} />
              <KpiCard label="Representative radiator flux" value={`${results.representativeFluxKwM2.toFixed(2)} kW/m²`} note="Screening estimate, not mission analysis" />
            </div>

            <ArchitectureDiagram
              heatKw={computeKw}
              overheadKw={results.selectedOverheadKw}
              area={results.selectedArea}
              nuwattsEnabled={nuwattsEnabled}
            />

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-bold">Scenario Comparison</h2>
              <div className="mt-6 space-y-6">
                <Bar label="Conventional thermal overhead" value={results.conventionalOverheadKw} max={maxPower} suffix="kW" />
                <Bar label="Nuwatts thermal overhead" value={results.nuwattsOverheadKw} max={maxPower} suffix="kW" />
                <Bar label="Conventional radiator area" value={results.conventionalArea} max={maxArea} suffix="m²" />
                <Bar label="Nuwatts radiator area" value={results.nuwattsArea} max={maxArea} suffix="m²" />
                <Bar label="Conventional estimated thermal mass" value={results.conventionalMass} max={maxMass} suffix="kg" />
                <Bar label="Nuwatts estimated thermal mass" value={results.nuwattsMass} max={maxMass} suffix="kg" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold">Investor Readout</h2>
                <p className="mt-3 text-slate-600">
                  At <b>{formatPower(computeKw)}</b> of payload load, this scenario estimates <b>{formatPower(results.powerSavedKw)}</b> of
                  additional payload power enabled and approximately <b>{fmt(results.massSavings)} kg</b> of potential thermal-system mass reduction.
                </p>
                <p className="mt-3 text-slate-600">
                  The avoided parasitic load is equivalent to approximately <b>{fmt(results.annualEnergySavedKwh, 0)} kWh/year</b> of continuous
                  electrical allocation that could instead support payload, communications, or compute operations.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold">Assumption Notes</h2>
                <p className="mt-3 text-slate-600">
                  This is a preliminary screening model. Radiator area is estimated using Stefan-Boltzmann scaling with a simple orbit derating factor.
                  It is not a spacecraft thermal design tool and should be validated against mission-specific thermal analysis.
                </p>
                <p className="mt-3 text-slate-600">
                  Launch cost savings assume $10,000/kg. Solar array mass reduction assumes 150 W/kg. Both are placeholders for early trade-study discussion.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowReport(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-cyan-700"
              >
                Generate System Report
              </button>
            </div>
          </section>
        </div>
          </>
        )}
      </section>
    </main>
  );
}
