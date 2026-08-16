import { useState } from "react";

import { Activity, BarChart3, Building2, LayoutDashboard, ShieldCheck, Users } from "lucide-react";

import { ActivityLogs } from "../pages/admin/ActivityLogs.js";
import { AdminDashboard } from "../pages/admin/AdminDashboard.js";
import { AdminReports } from "../pages/admin/AdminReports.js";
import { OrganisationManagement } from "../pages/admin/OrganisationManagement.js";
import { RoleManagement } from "../pages/admin/RoleManagement.js";
import { UserManagement } from "../pages/admin/UserManagement.js";
import { RoleNavigationProvider } from "./RoleNavigation.js";

type AdminPage = "dashboard" | "users" | "roles" | "organisations" | "activityLogs" | "reports";

export function AdminLayout() {
  const [currentPage, setCurrentPage] = useState<AdminPage>("dashboard");

  const navigation = (
    <header className="role-navigation" aria-label="Administrator navigation">
      <div className="role-navigation__content">
        <p className="role-navigation__label">Administrator</p>
        <nav className="role-navigation__links">
          <button
            className={currentPage === "dashboard" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("dashboard")}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <button
            className={currentPage === "users" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("users")}
          >
            <Users size={16} />
            Users
          </button>
          <button
            className={currentPage === "roles" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("roles")}
          >
            <ShieldCheck size={16} />
            Roles
          </button>
          <button
            className={currentPage === "organisations" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("organisations")}
          >
            <Building2 size={16} />
            Organisations
          </button>
          <button
            className={currentPage === "activityLogs" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("activityLogs")}
          >
            <Activity size={16} />
            Activity logs
          </button>
          <button
            className={currentPage === "reports" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("reports")}
          >
            <BarChart3 size={16} />
            Reports
          </button>
        </nav>
      </div>
    </header>
  );

  return (
    <RoleNavigationProvider navigation={navigation}>
      {currentPage === "dashboard" && <AdminDashboard />}
      {currentPage === "users" && <UserManagement />}
      {currentPage === "roles" && <RoleManagement />}
      {currentPage === "organisations" && <OrganisationManagement />}
      {currentPage === "activityLogs" && <ActivityLogs />}
      {currentPage === "reports" && <AdminReports />}
    </RoleNavigationProvider>
  );
}
