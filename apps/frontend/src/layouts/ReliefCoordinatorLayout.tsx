import { useState } from "react";

import {
  AlertTriangle,
  BarChart3,
  Boxes,
  HeartPulse,
  Home,
  Siren,
  Truck,
  Users
} from "lucide-react";

import { DistributionWorkspace } from "../features/distributions/DistributionWorkspace.js";
import { EmergencyWorkspace } from "../features/emergency-requests/EmergencyWorkspace.js";
import { VictimVolunteerWorkspace } from "../features/people/VictimVolunteerWorkspace.js";
import { ReportsWorkspace } from "../features/reports/ReportsWorkspace.js";
import { ResourceWorkspace } from "../features/resources/ResourceWorkspace.js";
import { DisasterManagement } from "../pages/relief/DisasterManagement.js";
import { ReliefServicesManagement } from "../pages/relief/ReliefServicesManagement.js";
import { ShelterManagement } from "../pages/relief/ShelterManagement.js";
import { RoleNavigationProvider } from "./RoleNavigation.js";

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
  const [currentPage, setCurrentPage] = useState<ReliefPage>("disasters");

  const navigation = (
    <header className="role-navigation" aria-label="Relief coordinator navigation">
      <div className="role-navigation__content">
        <p className="role-navigation__label">Relief coordinator</p>
        <nav className="role-navigation__links">
          <button
            className={currentPage === "disasters" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("disasters")}
          >
            <AlertTriangle size={16} />
            Disasters
          </button>
          <button
            className={currentPage === "shelters" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("shelters")}
          >
            <Home size={16} />
            Shelters
          </button>
          <button
            className={currentPage === "reliefServices" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("reliefServices")}
          >
            <HeartPulse size={16} />
            Relief services
          </button>
          <button
            className={currentPage === "people" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("people")}
          >
            <Users size={16} />
            People
          </button>
          <button
            className={currentPage === "resources" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("resources")}
          >
            <Boxes size={16} />
            Resources
          </button>
          <button
            className={currentPage === "distributions" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("distributions")}
          >
            <Truck size={16} />
            Distributions
          </button>
          <button
            className={currentPage === "emergency" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("emergency")}
          >
            <Siren size={16} />
            Emergency cases
          </button>
          <button
            className={currentPage === "reports" ? "active" : ""}
            type="button"
            onClick={() => setCurrentPage("reports")}
          >
            <BarChart3 size={16} />
            Operations report
          </button>
        </nav>
      </div>
    </header>
  );

  return (
    <RoleNavigationProvider navigation={navigation}>
      {currentPage === "disasters" && <DisasterManagement />}
      {currentPage === "shelters" && <ShelterManagement />}
      {currentPage === "reliefServices" && <ReliefServicesManagement />}
      {currentPage === "people" && <VictimVolunteerWorkspace />}
      {currentPage === "resources" && <ResourceWorkspace />}
      {currentPage === "distributions" && <DistributionWorkspace />}
      {currentPage === "emergency" && <EmergencyWorkspace />}
      {currentPage === "reports" && <ReportsWorkspace />}
    </RoleNavigationProvider>
  );
}
