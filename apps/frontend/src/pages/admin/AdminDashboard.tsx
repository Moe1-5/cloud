import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Home,
  Loader2,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { listActivityLogs } from "../../api/activityLogsApi.js";
import { listDisasters } from "../../api/disastersApi.js";
import { listOrganisations } from "../../api/organisationsApi.js";
import { listShelters } from "../../api/sheltersApi.js";
import { listUsers } from "../../api/usersApi.js";

type DashboardData = {
  users: number;
  activeDisasters: number;
  shelters: number;
  organisations: number;
  activities: number;
};

const emptyDashboard: DashboardData = {
  users: 0,
  activeDisasters: 0,
  shelters: 0,
  organisations: 0,
  activities: 0,
};

export function AdminDashboard() {
  const [data, setData] =
    useState<DashboardData>(
      emptyDashboard
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadDashboard() {
    setLoading(true);
    setError(null);

    try {
      const [
        users,
        disasters,
        shelters,
        organisations,
        activities,
      ] = await Promise.all([
        listUsers(),
        listDisasters(),
        listShelters(),
        listOrganisations(),
        listActivityLogs(),
      ]);

      setData({
        users: users.length,

        activeDisasters:
          disasters.filter(
            (disaster) =>
              disaster.status === "active"
          ).length,

        shelters:
          shelters.length,

        organisations:
          organisations.length,

        activities:
          activities.length,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  return (
    <main className="app-shell">
      <section className="top-band">
        <div className="top-band__content">
          <div>
            <p className="eyebrow">
              Administration
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <p className="intro">
              Overview of the Disaster
              Relief Coordination System
              and important administration
              information.
            </p>
          </div>

          <div className="status-strip">
            <div>
              <span>
                {data.users}
              </span>

              <small>
                Users
              </small>
            </div>

            <div>
              <span>
                {
                  data.activeDisasters
                }
              </span>

              <small>
                Active disasters
              </small>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          width:
            "min(1180px, calc(100% - 32px))",
          margin:
            "-36px auto 64px",
        }}
      >
        {error ? (
          <div className="error-banner">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="loading-state">
            <Loader2
              className="spin"
              size={28}
            />

            Loading dashboard
          </div>
        ) : (
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",

              gap: "18px",
            }}
          >
            <DashboardCard
              title="User Accounts"
              value={data.users}
              icon={
                <Users size={25} />
              }
            />

            <DashboardCard
              title="Active Disasters"
              value={
                data.activeDisasters
              }
              icon={
                <AlertTriangle
                  size={25}
                />
              }
            />

            <DashboardCard
              title="Shelters"
              value={
                data.shelters
              }
              icon={
                <Home size={25} />
              }
            />

            <DashboardCard
              title="Organisations"
              value={
                data.organisations
              }
              icon={
                <Building2
                  size={25}
                />
              }
            />

            <DashboardCard
              title="Activity Records"
              value={
                data.activities
              }
              icon={
                <Activity
                  size={25}
                />
              }
            />
          </div>
        )}

        <section
          className="project-list"
          style={{
            marginTop: "18px",
            minHeight: "auto",
          }}
        >
          <div className="section-title">
            <BarChart3 size={18} />

            <h2>
              System Overview
            </h2>
          </div>

          <p
            style={{
              marginTop: "12px",
              lineHeight: "1.7",
            }}
          >
            Use the administrator
            navigation to manage user
            accounts, roles and
            permissions, relief
            organisations, system activity
            logs and reports.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              void loadDashboard()
            }
          >
            Refresh Dashboard
          </button>
        </section>
      </section>
    </main>
  );
}

type DashboardCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

function DashboardCard({
  title,
  value,
  icon,
}: DashboardCardProps) {
  return (
    <article
      className="record-card"
      style={{
        background: "white",

        boxShadow:
          "0 12px 35px rgba(25, 39, 52, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {icon}

        <strong>
          {title}
        </strong>
      </div>

      <div
        style={{
          fontSize: "2.3rem",
          fontWeight: "800",
          marginTop: "14px",
        }}
      >
        {value}
      </div>
    </article>
  );
}