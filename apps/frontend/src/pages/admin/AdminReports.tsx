import { Activity, AlertTriangle, Building2, HeartPulse, Home, Loader2, Users } from "lucide-react";

import { useEffect, useState } from "react";

import { listDisasters } from "../../api/disastersApi.js";
import { listOrganisations } from "../../api/organisationsApi.js";
import { listReliefServices } from "../../api/reliefServicesApi.js";
import { listShelters } from "../../api/sheltersApi.js";
import { listUsers } from "../../api/usersApi.js";
import { RoleNavigation } from "../../layouts/RoleNavigation.js";

type ReportData = {
  totalUsers: number;
  activeUsers: number;

  totalDisasters: number;
  activeDisasters: number;

  totalShelters: number;
  openShelters: number;

  totalReliefServices: number;
  availableReliefServices: number;

  totalOrganisations: number;
  activeOrganisations: number;
};

const emptyReport: ReportData = {
  totalUsers: 0,
  activeUsers: 0,

  totalDisasters: 0,
  activeDisasters: 0,

  totalShelters: 0,
  openShelters: 0,

  totalReliefServices: 0,
  availableReliefServices: 0,

  totalOrganisations: 0,
  activeOrganisations: 0
};

export function AdminReports() {
  const [report, setReport] = useState<ReportData>(emptyReport);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadReport() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [users, disasters, shelters, reliefServices, organisations] = await Promise.all([
        listUsers(),
        listDisasters(),
        listShelters(),
        listReliefServices(),
        listOrganisations()
      ]);

      setReport({
        totalUsers: users.length,

        activeUsers: users.filter((user) => user.status === "active").length,

        totalDisasters: disasters.length,

        activeDisasters: disasters.filter((disaster) => disaster.status === "active").length,

        totalShelters: shelters.length,

        openShelters: shelters.filter((shelter) => shelter.status === "open").length,

        totalReliefServices: reliefServices.length,

        availableReliefServices: reliefServices.filter((service) => service.status === "available")
          .length,

        totalOrganisations: organisations.length,

        activeOrganisations: organisations.filter(
          (organisation) => organisation.status === "active"
        ).length
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load report data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadReport();
  }, []);

  if (isLoading) {
    return (
      <main className="app-shell">
        <section className="top-band">
          <div className="top-band__content">
            <div>
              <p className="eyebrow">Administration</p>

              <h1>System Reports</h1>
            </div>
          </div>
        </section>

        <RoleNavigation />

        <div className="loading-state">
          <Loader2 className="spin" size={28} />
          Loading system report
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">Administration</p>

            <h1>System Reports</h1>

            <p className="intro">
              View a summary of system users, disaster records, shelters, relief services and
              participating relief organisations.
            </p>
          </div>

          <div className="status-strip">
            <div>
              <span>{report.totalUsers}</span>

              <small>Total users</small>
            </div>

            <div>
              <span>{report.activeDisasters}</span>

              <small>Active disasters</small>
            </div>
          </div>
        </div>
      </section>

      <RoleNavigation />

      <section className="admin-content">
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "18px"
          }}
        >
          <ReportCard
            title="User Accounts"
            icon={<Users size={24} />}
            total={report.totalUsers}
            detail={`${report.activeUsers} active`}
          />

          <ReportCard
            title="Disasters"
            icon={<AlertTriangle size={24} />}
            total={report.totalDisasters}
            detail={`${report.activeDisasters} active`}
          />

          <ReportCard
            title="Shelters"
            icon={<Home size={24} />}
            total={report.totalShelters}
            detail={`${report.openShelters} open`}
          />

          <ReportCard
            title="Relief Services"
            icon={<HeartPulse size={24} />}
            total={report.totalReliefServices}
            detail={`${report.availableReliefServices} available`}
          />

          <ReportCard
            title="Relief Organisations"
            icon={<Building2 size={24} />}
            total={report.totalOrganisations}
            detail={`${report.activeOrganisations} active`}
          />
        </div>

        <section
          className="project-list"
          style={{
            marginTop: "18px",
            minHeight: "auto"
          }}
        >
          <div className="section-title">
            <Activity size={18} />

            <h2>Report Summary</h2>
          </div>

          <div
            style={{
              marginTop: "18px",
              lineHeight: "1.8"
            }}
          >
            <p>
              <strong>Active user accounts:</strong> {report.activeUsers} of {report.totalUsers}
            </p>

            <p>
              <strong>Active disasters:</strong> {report.activeDisasters} of {report.totalDisasters}
            </p>

            <p>
              <strong>Open shelters:</strong> {report.openShelters} of {report.totalShelters}
            </p>

            <p>
              <strong>Available relief services:</strong> {report.availableReliefServices} of{" "}
              {report.totalReliefServices}
            </p>

            <p>
              <strong>Active relief organisations:</strong> {report.activeOrganisations} of{" "}
              {report.totalOrganisations}
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => void loadReport()}
            style={{
              marginTop: "16px"
            }}
          >
            Refresh Report
          </button>
        </section>
      </section>
    </main>
  );
}

type ReportCardProps = {
  title: string;
  icon: React.ReactNode;
  total: number;
  detail: string;
};

function ReportCard({ title, icon, total, detail }: ReportCardProps) {
  return (
    <article
      className="record-card"
      style={{
        background: "white",
        boxShadow: "0 12px 35px rgba(25, 39, 52, 0.08)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px"
        }}
      >
        {icon}

        <strong>{title}</strong>
      </div>

      <div
        style={{
          fontSize: "2.2rem",
          fontWeight: "800",
          marginBottom: "6px"
        }}
      >
        {total}
      </div>

      <div
        style={{
          color: "#64748b",
          fontWeight: "700"
        }}
      >
        {detail}
      </div>
    </article>
  );
}
