import {
  Activity,
  BarChart3,
  Boxes,
  HeartHandshake,
  ShieldCheck,
  Siren,
  Truck,
  UserRound
} from "lucide-react";
import { useState } from "react";
import { DistributionWorkspace } from "./features/distributions/DistributionWorkspace.js";
import { EmergencyWorkspace } from "./features/emergency-requests/EmergencyWorkspace.js";
import { ReportsWorkspace } from "./features/reports/ReportsWorkspace.js";
import { ResourceWorkspace } from "./features/resources/ResourceWorkspace.js";

type WorkspaceArea = "resources" | "distributions" | "emergency" | "reports";

const DELIVERY_AREAS = [
  { key: "resources", label: "Resource inventory", icon: Boxes, state: "ready" },
  { key: "distributions", label: "Distribution tracking", icon: Truck, state: "ready" },
  { key: "emergency", label: "Emergency requests", icon: Siren, state: "ready" },
  { key: "reports", label: "Reports", icon: BarChart3, state: "ready" }
] as const;

const HERO_CONTENT: Record<
  WorkspaceArea,
  { eyebrow: string; title: string; intro: string; focus: string }
> = {
  resources: {
    eyebrow: "Student 3 operations workspace",
    title: "Resources ready where relief teams need them.",
    intro:
      "Maintain accurate relief inventory, locations, and stock levels for every response team.",
    focus: "One clear inventory view for coordinators and response teams."
  },
  distributions: {
    eyebrow: "Distribution and activity control",
    title: "Track every supply movement from store to community.",
    intro:
      "Reserve available stock, coordinate dispatches, confirm delivery, and monitor ongoing relief activity.",
    focus: "Live distribution status and inventory alerts in one operational view."
  },
  emergency: {
    eyebrow: "Public assistance and case response",
    title: "Connect affected communities with the right relief team.",
    intro:
      "Submit and track emergency needs, then review, prioritise, assign, and resolve each case.",
    focus: "Clear public request status and accountable coordinator decisions."
  },
  reports: {
    eyebrow: "Student 3 operational reporting",
    title: "Turn live relief operations into clear decisions.",
    intro:
      "Review inventory health, distribution performance, represented households, and emergency-case workload.",
    focus: "A shared reporting boundary ready for the final system dashboard."
  }
};

export function App() {
  const [activeArea, setActiveArea] = useState<WorkspaceArea>("resources");
  const heroContent = HERO_CONTENT[activeArea];

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="site-header__content">
          <button
            className="brand"
            type="button"
            onClick={() => setActiveArea("resources")}
            aria-label="Relief operations home"
          >
            <span className="brand__mark">
              <HeartHandshake size={22} aria-hidden="true" />
            </span>
            <span>
              <strong>ReliefOps</strong>
              <small>Disaster coordination</small>
            </span>
          </button>

          <nav className="primary-nav" aria-label="Student 3 workspace">
            {DELIVERY_AREAS.map((area) => {
              const Icon = area.icon;

              return area.state === "ready" ? (
                <button
                  className={`primary-nav__item ${activeArea === area.key ? "selected" : ""}`}
                  type="button"
                  onClick={() => setActiveArea(area.key)}
                  aria-current={activeArea === area.key ? "page" : undefined}
                  key={area.key}
                >
                  <Icon size={16} aria-hidden="true" />
                  {area.label}
                </button>
              ) : (
                <span className="primary-nav__item muted" key={area.key}>
                  <Icon size={16} aria-hidden="true" />
                  {area.label}
                  <small>Soon</small>
                </span>
              );
            })}
          </nav>

          <div className="role-chip">
            <ShieldCheck size={17} aria-hidden="true" />
            Relief coordinator
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero__content">
          <div>
            <p className="eyebrow">{heroContent.eyebrow}</p>
            <h1>{heroContent.title}</h1>
            <p className="intro">{heroContent.intro}</p>
          </div>

          <aside className="hero-callout" aria-label="Workspace focus">
            <Activity size={24} aria-hidden="true" />
            <div>
              <strong>Operational visibility</strong>
              <span>{heroContent.focus}</span>
            </div>
            <UserRound size={44} aria-hidden="true" />
          </aside>
        </div>
      </section>

      {activeArea === "resources" ? (
        <ResourceWorkspace />
      ) : activeArea === "distributions" ? (
        <DistributionWorkspace />
      ) : activeArea === "emergency" ? (
        <EmergencyWorkspace />
      ) : (
        <ReportsWorkspace />
      )}
    </main>
  );
}
