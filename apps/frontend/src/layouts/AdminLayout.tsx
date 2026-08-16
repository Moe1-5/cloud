import { useState } from "react";

import {
  Activity,
  BarChart3,
  Building2,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

import { ActivityLogs } from "../pages/admin/ActivityLogs.js";
import { AdminDashboard } from "../pages/admin/AdminDashboard.js";
import { AdminReports } from "../pages/admin/AdminReports.js";
import { OrganisationManagement } from "../pages/admin/OrganisationManagement.js";
import { RoleManagement } from "../pages/admin/RoleManagement.js";
import { UserManagement } from "../pages/admin/UserManagement.js";

type AdminPage =
  | "dashboard"
  | "users"
  | "roles"
  | "organisations"
  | "activityLogs"
  | "reports";

export function AdminLayout() {
  const [currentPage, setCurrentPage] =
    useState<AdminPage>("dashboard");

  function buttonStyle(page: AdminPage) {
    return {
      border: "none",
      borderRadius: "6px",
      padding: "9px 14px",
      display: "flex",
      alignItems: "center",
      gap: "7px",
      cursor: "pointer",
      background:
        currentPage === page
          ? "#0f766e"
          : "#1e293b",
      color: "white",
    };
  }

  return (
    <div>
      <header
        style={{
          background: "#0f172a",
          color: "white",
          padding: "14px 20px",
        }}
      >
        <div
          style={{
            width:
              "min(1180px, calc(100% - 20px))",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              marginBottom: "12px",
            }}
          >
            Administrator
          </h2>

          <nav
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              style={buttonStyle("dashboard")}
              onClick={() =>
                setCurrentPage("dashboard")
              }
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>

            <button
              type="button"
              style={buttonStyle("users")}
              onClick={() =>
                setCurrentPage("users")
              }
            >
              <Users size={16} />
              Users
            </button>

            <button
              type="button"
              style={buttonStyle("roles")}
              onClick={() =>
                setCurrentPage("roles")
              }
            >
              <ShieldCheck size={16} />
              Roles
            </button>

            <button
              type="button"
              style={buttonStyle(
                "organisations"
              )}
              onClick={() =>
                setCurrentPage(
                  "organisations"
                )
              }
            >
              <Building2 size={16} />
              Organisations
            </button>

            <button
              type="button"
              style={buttonStyle(
                "activityLogs"
              )}
              onClick={() =>
                setCurrentPage(
                  "activityLogs"
                )
              }
            >
              <Activity size={16} />
              Activity Logs
            </button>

            <button
              type="button"
              style={buttonStyle("reports")}
              onClick={() =>
                setCurrentPage("reports")
              }
            >
              <BarChart3 size={16} />
              Reports
            </button>
          </nav>
        </div>
      </header>

      {currentPage === "dashboard" && (
        <AdminDashboard />
      )}

      {currentPage === "users" && (
        <UserManagement />
      )}

      {currentPage === "roles" && (
        <RoleManagement />
      )}

      {currentPage === "organisations" && (
        <OrganisationManagement />
      )}

      {currentPage === "activityLogs" && (
        <ActivityLogs />
      )}

      {currentPage === "reports" && (
        <AdminReports />
      )}
    </div>
  );
}