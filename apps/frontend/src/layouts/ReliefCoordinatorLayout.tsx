import { useState } from "react";

import {
  AlertTriangle,
  BarChart3,
  Boxes,
  HeartPulse,
  Home,
  Siren,
  Truck,
  Users,
} from "lucide-react";

import { DistributionWorkspace } from "../features/distributions/DistributionWorkspace.js";
import { EmergencyWorkspace } from "../features/emergency-requests/EmergencyWorkspace.js";
import { VictimVolunteerWorkspace } from "../features/people/VictimVolunteerWorkspace.js";
import { ReportsWorkspace } from "../features/reports/ReportsWorkspace.js";
import { ResourceWorkspace } from "../features/resources/ResourceWorkspace.js";
import { DisasterManagement } from "../pages/relief/DisasterManagement.js";
import { ReliefServicesManagement } from "../pages/relief/ReliefServicesManagement.js";
import { ShelterManagement } from "../pages/relief/ShelterManagement.js";

type ReliefPage =
  | "disasters"
  | "shelters"
  | "reliefServices"
  | "people"
  | "resources"
  | "distributions"
  | "emergency"
  | "reports";

export function ReliefCoordinatorLayout() {
  const [currentPage, setCurrentPage] =
    useState<ReliefPage>("disasters");

  function buttonStyle(page: ReliefPage) {
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
            width: "min(1180px, calc(100% - 20px))",
            margin: "0 auto",
          }}
        >
          <h2>Relief Coordinator</h2>

          <nav
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              style={buttonStyle(
                "disasters"
              )}
              onClick={() =>
                setCurrentPage(
                  "disasters"
                )
              }
            >
              <AlertTriangle size={16} />
              Disasters
            </button>

            <button
              type="button"
              style={buttonStyle(
                "shelters"
              )}
              onClick={() =>
                setCurrentPage(
                  "shelters"
                )
              }
            >
              <Home size={16} />
              Shelters
            </button>

            <button
              type="button"
              style={buttonStyle(
                "reliefServices"
              )}
              onClick={() =>
                setCurrentPage(
                  "reliefServices"
                )
              }
            >
              <HeartPulse size={16} />
              Relief Services
            </button>

            <button
              type="button"
              style={buttonStyle("people")}
              onClick={() => setCurrentPage("people")}
            >
              <Users size={16} />
              People
            </button>

            <button type="button" style={buttonStyle("resources")} onClick={() => setCurrentPage("resources")}>
              <Boxes size={16} />
              Resources
            </button>

            <button type="button" style={buttonStyle("distributions")} onClick={() => setCurrentPage("distributions")}>
              <Truck size={16} />
              Distributions
            </button>

            <button type="button" style={buttonStyle("emergency")} onClick={() => setCurrentPage("emergency")}>
              <Siren size={16} />
              Emergency cases
            </button>

            <button type="button" style={buttonStyle("reports")} onClick={() => setCurrentPage("reports")}>
              <BarChart3 size={16} />
              Operations report
            </button>
          </nav>
        </div>
      </header>

      {currentPage === "disasters" && (
        <DisasterManagement />
      )}

      {currentPage === "shelters" && (
        <ShelterManagement />
      )}

      {currentPage === "reliefServices" && (
        <ReliefServicesManagement />
      )}

      {currentPage === "people" && (
        <VictimVolunteerWorkspace />
      )}

      {currentPage === "resources" && <ResourceWorkspace />}
      {currentPage === "distributions" && <DistributionWorkspace />}
      {currentPage === "emergency" && <EmergencyWorkspace />}
      {currentPage === "reports" && <ReportsWorkspace />}
    </div>
  );
}
