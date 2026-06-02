import Image from 'next/image';
import Link from 'next/link';
import { EmailCapture } from '@/components/email-capture';

const proofPoints = [
  ['Thermal overhead', 'Every watt spent moving heat becomes heat to reject'],
  ['Radiator burden', 'Thermal-management power increases radiator area and mass'],
  ['Compute density', 'Lower overhead enables more compute per kg'],
];

const thermalMatterCards = [
  {
    title: 'Compute Creates Heat',
    text: 'As AI workloads demand more processing power, waste heat increases proportionally.',
  },
  {
    title: 'Thermal Transport Consumes Power',
    text: 'Pumps, valves, compressors, controls, and coolant loops can add parasitic load.',
  },
  {
    title: 'Radiators Must Reject It All',
    text: 'Every watt used by thermal management becomes additional heat that must be radiated away.',
  },
];

const problemCards = [
  'No atmospheric convection in vacuum',
  'Radiator mass scales with total heat load',
  'Deployables add complexity and risk',
  'Thermal overhead compounds at GW scale',
];

const scaleRows = [
  ['50 kW', '2.5 kW', '0.1 kW', '2.4 kW'],
  ['1 MW', '50 kW', '2 kW', '48 kW'],
  ['100 MW', '5 MW', '0.2 MW', '4.8 MW'],
  ['1 GW', '50 MW', '2 MW', '48 MW'],
  ['5 GW', '250 MW', '10 MW', '240 MW'],
];

const solutionPillars = [
  {
    title: 'Reduce Thermal Overhead',
    text: 'Move heat with minimal parasitic power so less supporting energy is converted into additional heat.',
  },
  {
    title: 'Reduce Radiator Burden',
    text: 'Lower thermal-management overhead means less total heat sent to radiators and less radiator infrastructure.',
  },
  {
    title: 'Enable More Compute per kg',
    text: 'By reducing power, mass, and complexity in the thermal loop, orbital platforms can allocate more system capacity to compute.',
  },
];

const applications = [
  {
    title: 'Orbital Compute',
    text: 'Thermal infrastructure for future orbital data centers, AI satellites, edge compute platforms, and high-density spacecraft systems.',
  },
  {
    title: 'Terrestrial Data Centers',
    text: 'A near-term proving ground for high-density AI cooling, heat transport, and system-level thermal-overhead reduction.',
  },
];

const whyNow = [
  'Launch costs and orbital infrastructure are improving',
  'AI workloads are driving higher compute density',
  'Companies are exploring space-based data centers',
  'Thermal management becomes harder as systems scale',
];

const competition = [
  {
    title: 'Conventional Active Thermal Management',
    text: 'Uses energy to move heat, creating additional heat that must also be rejected.',
  },
  {
    title: 'Radiator-Only Thinking',
    text: 'Focuses on heat rejection area but misses the hidden cost of thermal transport overhead.',
  },
  {
    title: 'Nuwatts',
    text: 'Targets the overhead layer: moving heat with minimal parasitic power so orbital compute can scale more efficiently.',
    emphasis: true,
  },
];

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-ink text-white">
      <Background />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="text-lg font-semibold tracking-[0.24em] text-white/95">
            NUWATTS
          </a>
          <nav className="hidden gap-6 text-sm text-white/70 md:flex">
            <a href="#problem" className="hover:text-white">Problem</a>
            <a href="#hidden-cost" className="hover:text-white">Hidden Cost</a>
            <a href="#scale" className="hover:text-white">Scale</a>
            <a href="#solution" className="hover:text-white">Solution</a>
            <a href="#why-now" className="hover:text-white">Why Now</a>
            <a href="#team" className="hover:text-white">Team</a>
          </nav>
          <a
            href="#cta"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Get More Info
          </a>
        </div>
      </header>

      <main id="top" className="flex-1">
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-8 lg:pb-32 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-4 text-lg font-semibold tracking-[0.04em] text-cyan-200 md:text-xl">
                Thermal Infrastructure for Space Compute
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight text-white md:text-5xl lg:text-6xl">
                Thermal Infrastructure Is the
                <span className="block text-white">Hidden Cost of Orbital Compute</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
                As orbital AI scales from kilowatts to gigawatts, thermal-management overhead and radiator infrastructure become critical constraints on growth.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#hidden-cost"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
                >
                  Learn Why
                </a>
                <a
                  href="#scale"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  See the Scaling Impact
                </a>
              </div>

              <EmailCapture compact />

              <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
                {proofPoints.map(([title, sub]) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur"
                  >
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="mt-1 text-sm text-white/55">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <VisualCard src="/visuals/hero-system.png" alt="Nuwatts product architecture" priority />
          </div>
        </section>

        <Section
          id="problem"
          title="Space Compute Has a Heat Problem"
          copy="Space is cold, but it is also a vacuum. Without air or convection, heat from orbital compute must be transported to radiators and rejected by radiation."
        >
          <div className="space-y-12">
            <div className="mx-auto grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {problemCards.map((card) => (
                <GlassCard key={card}>{card}</GlassCard>
              ))}
            </div>

            <div className="w-full">
              <VisualCard
                src="/visuals/problem-slide.png"
                alt="Problem slide showing thermal challenges in orbital compute"
              />
            </div>
          </div>
        </Section>

        <Section
          id="hidden-cost"
          title="The Hidden Cost of Orbital Compute"
          copy="Nuwatts targets thermal-management overhead, not the compute heat itself. The compute still creates heat; the opportunity is reducing the extra energy and infrastructure required to move and reject that heat."
        >
          <div className="grid gap-8">
            <div className="mx-auto w-full max-w-6xl">
              <HiddenCostVisual />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {thermalMatterCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400/25 to-cyan-400/25 text-lg">
                    ✦
                  </div>
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-white/65">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="scale"
          title="Scale Changes Everything"
          copy="Small percentages become enormous at orbital data-center scale. A 5% conventional thermal-management overhead becomes 250 MW at 5 GW compute scale."
        >
          <div className="space-y-12">
            <Panel>
              <div className="mb-5 text-center text-sm uppercase tracking-[0.2em] text-white/50">
                Thermal-management overhead model
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-white/10 text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Compute Load</th>
                      <th className="px-4 py-3 font-semibold">Conventional</th>
                      <th className="px-4 py-3 font-semibold">Nuwatts</th>
                      <th className="px-4 py-3 font-semibold">Avoided</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scaleRows.map(([load, conventional, nuwatts, saved]) => (
                      <tr key={load} className="border-t border-white/10 text-white/70">
                        <td className="px-4 py-3 font-semibold text-white">{load}</td>
                        <td className="px-4 py-3">{conventional}</td>
                        <td className="px-4 py-3">{nuwatts}</td>
                        <td className="px-4 py-3 text-orange-300">{saved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 rounded-2xl bg-black/25 p-5 text-center">
                <div className="text-4xl font-semibold text-orange-300">240 MW</div>
                <div className="mt-2 text-white/65">
                  thermal-management overhead avoided at 5 GW scale under the model above
                </div>
              </div>
              <p className="mt-5 text-center text-sm leading-7 text-white/55">
                Assumptions: conventional active thermal management at 5% of compute load; Nuwatts passive thermal-management overhead at 0.2% of compute load.
              </p>
            </Panel>

            <div className="w-full">
              <VisualCard
                src="/visuals/density-slide.png"
                alt="Scaling graph showing thermal-management overhead as orbital compute grows"
              />
            </div>
          </div>
        </Section>

        <Section
          id="solution"
          title="Nuwatts Reduces the Overhead Layer"
          copy="Nuwatts is building passive thermal infrastructure for orbital compute: move heat with minimal parasitic power, reduce thermal-management overhead, and lower the radiator infrastructure required to reject it."
        >
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-6">
              {solutionPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400/25 to-cyan-400/25 text-lg">
                    ✦
                  </div>
                  <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-3 text-white/65">{pillar.text}</p>
                </div>
              ))}
            </div>
            <VisualCard src="/visuals/hero-system.png" alt="Nuwatts system architecture diagram" />
          </div>
        </Section>

        <Section
          id="why-now"
          title="Why Now"
          copy="Orbital compute is moving from concept to infrastructure. As systems move from kilowatts to megawatts and beyond, heat transport becomes a defining constraint."
        >
          <div className="space-y-12">
            <div className="mx-auto grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {whyNow.map((item) => (
                <GlassCard key={item}>{item}</GlassCard>
              ))}
            </div>

            <div className="w-full">
              <VisualCard
                src="/visuals/why-now-slide.png"
                alt="Why now slide showing orbital compute companies and scaling trends"
              />
            </div>
          </div>
        </Section>

        <Section
          id="why-it-matters"
          title="Every Degree Still Matters"
          copy="Radiator performance scales with temperature to the fourth power. Preserving temperature through transport can materially reduce radiator area and mass."
        >
          <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
            <VisualCard
              src="/visuals/every-degree-slide.png"
              alt="Why every degree matters"
            />

            <Panel>
              <div className="mb-5 text-sm uppercase tracking-[0.2em] text-white/50">Reference case</div>
              <div className="space-y-4">
                <MiniRow left="Chip max temp" right="85°C" />
                <MiniRow left="Transport drop" right="15°C" accent />
                <MiniRow left="Radiator temp" right="70°C" />
                <MiniRow left="Reference heat load" right="100,000 kW" />
              </div>
              <div className="mt-6 rounded-2xl bg-black/25 p-5">
                <div className="text-4xl font-semibold text-orange-300">~3,000 m²</div>
                <div className="mt-2 text-white/65">
                  radiator area saved per 1°C recovered in a 100 MW system
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/65">
                The important takeaway is not just efficiency. It is geometry. Preserve temperature in
                transport and the same heat can be rejected with materially less radiator area.
              </div>
            </Panel>
          </div>
        </Section>

        <Section
          id="applications"
          title="Built for the Next Generation of Compute"
          copy="The long-term opportunity is orbital compute. Terrestrial high-density AI data centers remain a useful proving ground for thermal-overhead reduction."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {applications.map((app) => (
              <div
                key={app.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <div className="text-sm uppercase tracking-[0.18em] text-white/50">Application</div>
                <h3 className="mt-3 text-2xl font-semibold text-white">{app.title}</h3>
                <p className="mt-4 text-white/65">{app.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="competition"
          title="Not a Component. A Thermal Infrastructure Layer."
          copy="The clearest competitive framing: others optimize cooling components. Nuwatts targets the system-level overhead that grows as orbital compute scales."
        >
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-6">
              {competition.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-[1.75rem] border p-7 backdrop-blur-xl ${
                    item.emphasis
                      ? 'border-emerald-300/30 bg-emerald-400/10 shadow-[0_0_40px_rgba(16,185,129,0.12)]'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="text-sm uppercase tracking-[0.18em] text-white/50">
                    {item.emphasis ? 'System layer' : 'Alternative'}
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-4 text-white/65">{item.text}</p>
                </div>
              ))}
            </div>
            <VisualCard
              src="/visuals/competition-slide.png"
              alt="Competition visual comparing thermal-management alternatives and Nuwatts"
            />
          </div>
        </Section>

        <Section
          id="team"
          title="Team"
          copy="Nuwatts combines deep technical, operational, and strategic expertise across chemistry, commercialization, and company building."
        >
          <VisualCard
            src="/visuals/team-slide.jpg"
            alt="Nuwatts team visual showing James Ross and Colin Baillie"
          />
        </Section>

        <section id="cta" className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-8 lg:pb-32">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl lg:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.14),transparent_30%)]" />
            <div className="relative grid gap-10 lg:grid-cols-1 lg:items-center">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/50">Partner with us</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Building the thermal infrastructure layer for orbital compute.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
                  If you are exploring space compute, orbital data centers, advanced thermal architectures,
                  or high-density AI infrastructure, this is the right time to talk.
                </p>
                <EmailCapture />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl text-center text-sm text-white/50">
          <Link href="/privacy/" className="hover:text-white">
            Privacy Policy
          </Link>
        </div>
      </footer>
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


function HiddenCostVisual() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.18),transparent_32%)]" />
      <div className="relative">
        <div className="mb-6 text-sm uppercase tracking-[0.2em] text-white/50">50 kW reference case</div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.4rem] border border-orange-300/25 bg-orange-400/10 p-5">
            <div className="text-sm uppercase tracking-[0.16em] text-orange-200/80">Conventional</div>
            <div className="mt-4 space-y-3">
              <MiniRow left="Compute heat" right="50 kW" />
              <MiniRow left="Thermal overhead" right="2.5 kW" accent />
              <div className="rounded-2xl bg-black/30 p-4">
                <div className="text-sm text-white/55">Total radiator burden</div>
                <div className="mt-1 text-3xl font-semibold text-orange-300">52.5 kW</div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-cyan-300/25 bg-cyan-400/10 p-5">
            <div className="text-sm uppercase tracking-[0.16em] text-cyan-200/80">Nuwatts</div>
            <div className="mt-4 space-y-3">
              <MiniRow left="Compute heat" right="50 kW" />
              <MiniRow left="Thermal overhead" right="0.1 kW" />
              <div className="rounded-2xl bg-black/30 p-4">
                <div className="text-sm text-white/55">Total radiator burden</div>
                <div className="mt-1 text-3xl font-semibold text-cyan-200">50.1 kW</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/25 p-5">
          <div className="text-sm uppercase tracking-[0.16em] text-white/50">Overhead avoided</div>
          <div className="mt-2 text-5xl font-semibold text-emerald-300">2.4 kW</div>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Nuwatts does not remove the compute heat. It reduces the extra thermal-management power required to move and reject that heat.
          </p>
        </div>
      </div>
    </div>
  );
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
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
        accent ? 'border-orange-300/20 bg-orange-400/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <span className="text-white/65">{left}</span>
      <span className="font-semibold text-white">{right}</span>
    </div>
  );
}
