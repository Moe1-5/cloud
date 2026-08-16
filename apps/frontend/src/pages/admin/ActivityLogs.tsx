import type {
  ActivityAction,
  ActivityLogRecord,
} from "@ddac/shared";

import {
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  listActivityLogs,
} from "../../api/activityLogsApi.js";

const actionLabels: Record<
  ActivityAction,
  string
> = {
  create: "Create",
  update: "Update",
  delete: "Delete",
  login: "Login",
  logout: "Logout",
  statusChange: "Status Change",
};

export function ActivityLogs() {
  const [logs, setLogs] =
    useState<ActivityLogRecord[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const todayCount = useMemo(() => {
    const today =
      new Date().toDateString();

    return logs.filter(
      (log) =>
        new Date(
          log.createdAt
        ).toDateString() === today
    ).length;
  }, [logs]);

  async function refreshLogs() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data =
        await listActivityLogs();

      setLogs(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load activity logs."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshLogs();
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
              System Activity Logs
            </h1>

            <p className="intro">
              Review important system
              actions including record
              creation, updates, status
              changes and deletions.
            </p>
          </div>

          <div className="status-strip">
            <div>
              <span>
                {logs.length}
              </span>

              <small>
                Total activities
              </small>
            </div>

            <div>
              <span>
                {todayCount}
              </span>

              <small>
                Activities today
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
        <section className="project-list">
          <div className="list-header">
            <div className="section-title">
              <Activity
                size={18}
              />

              <h2>
                Activity History
              </h2>
            </div>

            <button
              className="icon-button"
              type="button"
              onClick={() =>
                void refreshLogs()
              }
              aria-label="Refresh activity logs"
            >
              <RefreshCw
                size={18}
              />
            </button>
          </div>

          {errorMessage ? (
            <div className="error-banner">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="loading-state">
              <Loader2
                className="spin"
                size={24}
              />

              Loading activity logs
            </div>
          ) : logs.length === 0 ? (
            <div className="empty-state">
              <Activity
                size={32}
              />

              <h3>
                No activity recorded
              </h3>

              <p>
                Create, update or
                delete a system record
                and the activity will
                appear here.
              </p>
            </div>
          ) : (
            <div className="records">
              {logs.map((log) => (
                <article
                  key={log.id}
                  className="record-card"
                >
                  <div className="record-card__main">
                    <div>
                      <h3>
                        {
                          actionLabels[
                            log.action
                          ]
                        }
                      </h3>

                      <p>
                        {
                          log.description
                        }
                      </p>
                    </div>
                  </div>

                  <div className="record-meta">
                    <span>
                      {
                        log.targetEntity
                      }
                    </span>

                    <span>
                      {
                        log.userName
                      }
                    </span>

                    <span>
                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>

                  {log.targetId ? (
                    <p
                      style={{
                        marginTop:
                          "10px",
                        marginBottom:
                          "0",
                        color:
                          "#64748b",
                        fontSize:
                          "0.8rem",
                      }}
                    >
                      Record ID:{" "}
                      {log.targetId}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}