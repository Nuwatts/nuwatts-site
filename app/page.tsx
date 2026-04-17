import Image from 'next/image';
import { DeltaRelationship } from '@/components/delta-relationship';
import { EmailCapture } from '@/components/email-capture';

const proofPoints = [
  ['Less heat to reject', 'System-level thermal reduction'],
  ['Smaller radiators', 'Lower mass and fewer deployables'],
  ['More compute per kg', 'Better economics for space compute'],
];

const problemCards = [
  'Radiator mass scales with heat load',
  'Deployables add complexity and risk',
  'Pointing constraints limit architecture freedom',
  'Thermal bottlenecks reduce system reliability',
];

const solutionPillars = [
  {
    title: 'Move Heat Efficiently',
    text: 'Preserve temperature through transport so the radiator can operate hotter and reject more heat per square meter.',
  },
  {
    title: 'Recover Energy',
    text: 'Turn a portion of waste heat back into useful electrical value instead of forcing every watt to the radiator.',
  },
  {
    title: 'Reduce Radiator Burden',
    text: 'Less heat to reject means less radiator area, lower mass, simpler integration, and more room for compute.',
  },
];

const applications = [
  {
    title: 'Space Compute',
    text: 'Orbital data centers, satellite payloads, edge compute in orbit, and future high-density spacecraft platforms.',
  },
  {
    title: 'Data Centers',
    text: 'A near-term proving ground with measurable cooling pain, clearer ROI, and a practical path to first deployment.',
  },
];

const competition = [
  {
    title: 'Incumbent Cooling Vendors',
    text: 'Move heat, then reject it. Complexity scales with power and radiator burden remains.',
  },
  {
    title: 'Commodity Thermoelectrics',
    text: 'Convert heat, but do not solve transport or system-level thermal bottlenecks.',
  },
  {
    title: 'Nuwatts',
    text: 'Move heat, recover energy, and reduce radiator area in one integrated thermal architecture.',
    emphasis: true,
  },
];

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <Background />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="text-lg font-semibold tracking-[0.24em] text-white/95">NUWATTS</a>
          <nav className="hidden gap-6 text-sm text-white/70 md:flex">
            <a href="#problem" className="hover:text-white">Problem</a>
            <a href="#solution" className="hover:text-white">Solution</a>
            <a href="#why-it-matters" className="hover:text-white">Why It Matters</a>
            <a href="#applications" className="hover:text-white">Applications</a>
            <a href="#competition" className="hover:text-white">Competition</a>
          </nav>
          <a href="#cta" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15">
            Request Brief
          </a>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-8 lg:pb-32 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
                Thermal Infrastructure for Space Compute
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                Cooling is the bottleneck. Nuwatts is the fix.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
                AI in space is limited by heat, not power. Nuwatts reduces radiator burden by preserving temperature in transport and recovering part of waste heat into useful energy.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#cta" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90">
                  Request Technical Brief
                </a>
                <a href="#why-it-matters" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  See Why Every Degree Matters
                </a>
              </div>
              <EmailCapture compact />
              <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
                {proofPoints.map(([title, sub]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur">
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="mt-1 text-sm text-white/55">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <VisualCard src="/visuals/hero-system.png" alt="Nuwatts product architecture" priority />
          </div>
        </section>

        <Section id="problem" title="Cooling, Not Power, Limits Space Compute" copy="In space, heat cannot be removed through convection. Every watt must be transported to a radiator and radiated away. That single constraint drives radiator area, deployables, pointing requirements, and reliability.">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-5 sm:grid-cols-2">
              {problemCards.map((card) => (
                <GlassCard key={card}>{card}</GlassCard>
              ))}
            </div>
            <VisualCard src="/visuals/problem-slide.png" alt="Problem slide showing data center electricity demand growth and no convection in vacuum" />
          </div>
        </Section>

        <Section id="solution" title="A New Thermal Architecture" copy="Nuwatts treats heat as a resource, not just a burden. By combining efficient heat transport with energy recovery, we reduce the amount of heat that must ultimately be radiated away.">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-6">
              {solutionPillars.map((pillar) => (
                <div key={pillar.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400/25 to-cyan-400/25 text-lg">✦</div>
                  <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-3 text-white/65">{pillar.text}</p>
                </div>
              ))}
            </div>
            <VisualCard src="/visuals/hero-system.png" alt="Nuwatts system architecture diagram" />
          </div>
        </Section>

        <Section id="why-it-matters" title="Every Degree Matters" copy="Radiator performance scales with temperature to the fourth power. Small losses in thermal transport can dramatically increase required radiator area.">
          <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
  <VisualCard
    src="/visuals/deltaT-visual.png"
    alt="Why every degree matters - radiator efficiency vs temperature"
  />

  <Panel>
              <div className="mb-5 text-sm uppercase tracking-[0.2em] text-white/50">Reference case</div>
              <div className="space-y-4">
                <MiniRow left="Chip max temp" right="85°C" />
                <MiniRow left="Transport drop" right="15°C" accent />
                <MiniRow left="Radiator temp" right="70°C" />
                <MiniRow left="Reference heat load" right="1 kW" />
              </div>
              <div className="mt-6 rounded-2xl bg-black/25 p-5">
                <div className="text-4xl font-semibold text-orange-300">~0.03 m²</div>
                <div className="mt-2 text-white/65">radiator area saved per 1°C recovered in the current 1 kW reference case</div>
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/65">
                The important takeaway is not just efficiency. It is geometry. Preserve temperature in transport and the same heat can be rejected with materially less radiator area.
              </div>
            </Panel>
          </div>
        </Section>

        <Section id="applications" title="Built for the Next Generation of Compute" copy="The near-term wedge is terrestrial data centers. The long-term upside is space compute, where thermal constraints define the hardware envelope.">
          <div className="grid gap-6 md:grid-cols-2">
            {applications.map((app) => (
              <div key={app.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <div className="text-sm uppercase tracking-[0.18em] text-white/50">Application</div>
                <h3 className="mt-3 text-2xl font-semibold text-white">{app.title}</h3>
                <p className="mt-4 text-white/65">{app.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="competition" title="Not a Component. A System Layer." copy="This is the clearest competitive framing: others optimize components. Nuwatts optimizes the thermal system.">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-6">
              {competition.map((item) => (
                <div key={item.title} className={`rounded-[1.75rem] border p-7 backdrop-blur-xl ${item.emphasis ? 'border-emerald-300/30 bg-emerald-400/10 shadow-[0_0_40px_rgba(16,185,129,0.12)]' : 'border-white/10 bg-white/5'}`}>
                  <div className="text-sm uppercase tracking-[0.18em] text-white/50">{item.emphasis ? 'System layer' : 'Alternative'}</div>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-4 text-white/65">{item.text}</p>
                </div>
              ))}
            </div>
            <VisualCard src="/visuals/competition-slide.png" alt="Competition visual comparing incumbents, commodity thermoelectrics, and Nuwatts" />
          </div>
        </Section>

        <section id="cta" className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-8 lg:pb-32">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl lg:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.14),transparent_30%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/50">Partner with us</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Seeking pilot partners in data centers and space systems.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
                  We are building the thermal infrastructure layer for next-generation compute. If you are exploring space compute, advanced thermal architectures, or high-density cooling constraints, this is the right time to talk.
                </p>
                <EmailCapture />
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6 text-sm leading-7 text-white/65 lg:max-w-sm">
                Best use on GitHub Pages: connect email capture with Formspree, add a GA4 measurement ID, and publish with the included workflow. The site is static-export compatible and ready for project-page hosting.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Section({ id, title, copy, children }: { id: string; title: string; copy: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      <div className="mb-10 max-w-3xl">
        <div className="mb-3 h-px w-16 bg-gradient-to-r from-orange-400 to-transparent" />
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
        <p className="mt-4 text-lg leading-8 text-white/70">{copy}</p>
      </div>
      {children}
    </section>
  );
}

function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-space-gradient" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 140px 80px, rgba(255,255,255,0.65), transparent), radial-gradient(1.5px 1.5px at 60px 140px, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 220px 170px, rgba(255,255,255,0.55), transparent)',
          backgroundSize: '260px 220px',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_60%)]" />
    </div>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-white/75 backdrop-blur-xl">
      <div className="text-base leading-7">{children}</div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">{children}</div>;
}

function VisualCard({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const basePath = '/nuwatts-site';

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-[0_0_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-orange-400/10 opacity-0 transition duration-500 group-hover:opacity-100" />
      <Image
        src={`${basePath}${src}`}
        alt={alt}
        width={1600}
        height={900}
        priority={priority}
        className="relative h-auto w-full rounded-[1.4rem] border border-white/8 transition duration-500 group-hover:scale-[1.01]"
      />
    </div>
  );
}

function MiniRow({ left, right, accent = false }: { left: string; right: string; accent?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${accent ? 'border-orange-300/20 bg-orange-400/10' : 'border-white/10 bg-white/5'}`}>
      <span className="text-white/65">{left}</span>
      <span className="font-semibold text-white">{right}</span>
    </div>
  );
}
