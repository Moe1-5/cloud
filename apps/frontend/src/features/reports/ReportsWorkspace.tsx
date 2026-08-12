import type { ResourceCategory, Student3OperationalReport } from "@ddac/shared";
import { RESOURCE_CATEGORY_VALUES } from "@ddac/shared";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Siren,
  Truck,
  UsersRound
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { getStudent3OperationalReport } from "../../api/reportsApi.js";

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  food: "Food",
  water: "Water",
  medical: "Medical",
  shelter: "Shelter",
  hygiene: "Hygiene",
  other: "Other"
};

export function ReportsWorkspace() {
  const [report, setReport] = useState<Student3OperationalReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maximumCategoryCount = useMemo(
    () => (report ? Math.max(1, ...Object.values(report.inventory.categoryCounts)) : 1),
    [report]
  );

  async function refreshReport() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setReport(await getStudent3OperationalReport());
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to generate the operational report."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshReport();
  }, []);

  return (
    <section
      className="resource-workspace reports-workspace"
      id="reports"
      aria-label="Student 3 operational report"
    >
      {errorMessage ? (
        <div className="error-banner workspace-error" role="alert">
          <AlertTriangle size={18} aria-hidden="true" />
          {errorMessage}
        </div>
      ) : null}

      {isLoading || !report ? (
        <section className="panel report-loading">
          <Loader2 className="spin" size={28} aria-hidden="true" />
          <strong>Generating operational report</strong>
        </section>
      ) : (
        <>
          <div className="report-toolbar panel">
            <div>
              <p className="panel-kicker">Operational snapshot</p>
              <h2>Student 3 contribution report</h2>
              <span>
                Generated{" "}
                {new Date(report.generatedAt).toLocaleString("en-MY", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={() => void refreshReport()}
              aria-label="Regenerate operational report"
            >
              <RefreshCw size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="report-summary-grid">
            <ReportMetric
              icon={Boxes}
              tone="teal"
              label="Resource records"
              value={report.inventory.totalResources}
              note={`${report.inventory.stockAlerts} stock alerts`}
            />
            <ReportMetric
              icon={Truck}
              tone="navy"
              label="Active distributions"
              value={report.distributions.active}
              note={`${report.distributions.completionRate}% completed or closed`}
            />
            <ReportMetric
              icon={Siren}
              tone="amber"
              label="Open emergency cases"
              value={report.emergencyRequests.open}
              note={`${report.emergencyRequests.unassigned} unassigned`}
            />
            <ReportMetric
              icon={UsersRound}
              tone="teal"
              label="People represented"
              value={report.affectedUsers.representedHouseholdMembers}
              note={`${report.affectedUsers.registeredProfiles} profiles`}
            />
          </div>

          <div className="report-grid">
            <section className="panel report-panel">
              <div className="list-header">
                <div>
                  <p className="panel-kicker">Inventory composition</p>
                  <h2>Resources by category</h2>
                </div>
                <BarChart3 size={20} aria-hidden="true" />
              </div>
              <div className="report-bars">
                {RESOURCE_CATEGORY_VALUES.map((category) => {
                  const count = report.inventory.categoryCounts[category];
                  const width = `${Math.round((count / maximumCategoryCount) * 100)}%`;

                  return (
                    <div className="report-bar" key={category}>
                      <div>
                        <span>{CATEGORY_LABELS[category]}</span>
                        <strong>{count}</strong>
                      </div>
                      <span className="report-bar__track">
                        <span style={{ width }} />
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="report-inline-stats">
                <span>
                  <Boxes size={16} aria-hidden="true" />
                  <strong>{report.inventory.activeLocations}</strong> storage locations
                </span>
                <span>
                  <AlertTriangle size={16} aria-hidden="true" />
                  <strong>{report.inventory.stockAlerts}</strong> resources need attention
                </span>
              </div>
            </section>

            <section className="panel report-panel">
              <div className="list-header">
                <div>
                  <p className="panel-kicker">Delivery performance</p>
                  <h2>Distribution status</h2>
                </div>
                <Truck size={20} aria-hidden="true" />
              </div>
              <div className="report-donut-row">
                <div
                  className="completion-ring"
                  style={
                    {
                      "--completion": `${report.distributions.completionRate * 3.6}deg`
                    } as CSSProperties
                  }
                >
                  <span>
                    <strong>{report.distributions.completionRate}%</strong>closed
                  </span>
                </div>
                <div className="report-status-list">
                  <ReportStatus
                    icon={Clock3}
                    label="Active"
                    value={report.distributions.active}
                    tone="active"
                  />
                  <ReportStatus
                    icon={CheckCircle2}
                    label="Delivered"
                    value={report.distributions.delivered}
                    tone="completed"
                  />
                  <ReportStatus
                    icon={AlertTriangle}
                    label="Cancelled"
                    value={report.distributions.cancelled}
                    tone="cancelled"
                  />
                </div>
              </div>
            </section>

            <section className="panel report-panel report-panel--wide">
              <div className="list-header">
                <div>
                  <p className="panel-kicker">Emergency response load</p>
                  <h2>Case readiness</h2>
                </div>
                <Siren size={20} aria-hidden="true" />
              </div>
              <div className="case-readiness-grid">
                <div>
                  <span>Total requests</span>
                  <strong>{report.emergencyRequests.total}</strong>
                </div>
                <div>
                  <span>Open cases</span>
                  <strong>{report.emergencyRequests.open}</strong>
                </div>
                <div className="danger">
                  <span>Critical</span>
                  <strong>{report.emergencyRequests.critical}</strong>
                </div>
                <div className="warning">
                  <span>Unassigned</span>
                  <strong>{report.emergencyRequests.unassigned}</strong>
                </div>
                <div className="success">
                  <span>Resolved</span>
                  <strong>{report.emergencyRequests.resolved}</strong>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </section>
  );
}

function ReportMetric({
  icon: Icon,
  tone,
  label,
  value,
  note
}: {
  icon: typeof Boxes;
  tone: "teal" | "navy" | "amber";
  label: string;
  value: number;
  note: string;
}) {
  return (
    <article className="summary-card">
      <span className={`summary-card__icon ${tone}`}>
        <Icon size={21} aria-hidden="true" />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
      <span className="summary-card__note">{note}</span>
    </article>
  );
}

function ReportStatus({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: typeof Clock3;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="report-status">
      <span className={`activity-dot ${tone}`} aria-hidden="true" />
      <Icon size={16} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
