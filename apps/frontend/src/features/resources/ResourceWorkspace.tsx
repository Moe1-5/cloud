import type {
  CreateResourceInput,
  ResourceCategory,
  ResourceRecord,
  ResourceStockStatus
} from "@ddac/shared";
import { RESOURCE_CATEGORY_VALUES } from "@ddac/shared";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  CircleOff,
  Loader2,
  MapPin,
  PackagePlus,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  X
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  createResource,
  deleteResource,
  listResources,
  updateResource
} from "../../api/resourcesApi.js";
import { CoordinatorPageHero, RoleNavigation } from "../../layouts/RoleNavigation.js";

const INITIAL_FORM: CreateResourceInput = {
  name: "",
  category: "food",
  quantity: 0,
  unit: "packs",
  location: "",
  reorderLevel: 0
};

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  food: "Food",
  water: "Water",
  medical: "Medical",
  shelter: "Shelter",
  hygiene: "Hygiene",
  other: "Other"
};

const STOCK_LABELS: Record<ResourceStockStatus, string> = {
  available: "Available",
  low_stock: "Low stock",
  out_of_stock: "Out of stock"
};

type StockFilter = "all" | ResourceStockStatus;

export function ResourceWorkspace() {
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [formState, setFormState] = useState<CreateResourceInput>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const lowStockCount = useMemo(
    () => resources.filter((resource) => resource.stockStatus !== "available").length,
    [resources]
  );

  const locationCount = useMemo(
    () => new Set(resources.map((resource) => resource.location)).size,
    [resources]
  );

  const filteredResources = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [resource.name, resource.location, CATEGORY_LABELS[resource.category]].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );
      const matchesStock = stockFilter === "all" || resource.stockStatus === stockFilter;

      return matchesSearch && matchesStock;
    });
  }, [resources, searchQuery, stockFilter]);

  async function refreshResources() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setResources(await listResources());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load relief resources.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshResources();
  }, []);

  function resetForm() {
    setFormState(INITIAL_FORM);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (editingId) {
        const updatedResource = await updateResource(editingId, formState);
        setResources((currentResources) =>
          currentResources.map((resource) =>
            resource.id === editingId ? updatedResource : resource
          )
        );
      } else {
        const createdResource = await createResource(formState);
        setResources((currentResources) => [createdResource, ...currentResources]);
      }

      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save the resource.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(resource: ResourceRecord) {
    setEditingId(resource.id);
    setFormState({
      name: resource.name,
      category: resource.category,
      quantity: resource.quantity,
      unit: resource.unit,
      location: resource.location,
      reorderLevel: resource.reorderLevel
    });
    document.querySelector("#resource-form")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleDelete(resource: ResourceRecord) {
    const confirmed = window.confirm(`Delete ${resource.name} from the resource inventory?`);

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);

    try {
      await deleteResource(resource.id);
      setResources((currentResources) =>
        currentResources.filter((item) => item.id !== resource.id)
      );

      if (editingId === resource.id) {
        resetForm();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete the resource.");
    }
  }

  return (
    <>
      <CoordinatorPageHero
        title="Relief resource inventory"
        description="Monitor essential supplies, stock levels, and available relief resources."
      />
      <RoleNavigation />
      <section className="resource-workspace" id="resources" aria-label="Relief resource inventory">
        <div className="summary-grid" aria-label="Resource inventory summary">
          <article className="summary-card">
            <span className="summary-card__icon teal">
              <Boxes size={21} aria-hidden="true" />
            </span>
            <div>
              <small>Inventory records</small>
              <strong>{resources.length}</strong>
            </div>
            <span className="summary-card__note">Tracked supplies</span>
          </article>

          <article className="summary-card">
            <span className="summary-card__icon amber">
              <AlertTriangle size={21} aria-hidden="true" />
            </span>
            <div>
              <small>Needs attention</small>
              <strong>{lowStockCount}</strong>
            </div>
            <span className="summary-card__note">Low or empty</span>
          </article>

          <article className="summary-card">
            <span className="summary-card__icon navy">
              <MapPin size={21} aria-hidden="true" />
            </span>
            <div>
              <small>Active locations</small>
              <strong>{locationCount}</strong>
            </div>
            <span className="summary-card__note">Storage points</span>
          </article>
        </div>

        <div className="workspace-grid">
          <form className="resource-form panel" id="resource-form" onSubmit={handleSubmit}>
            <div className="panel-heading">
              <span className="section-icon">
                {editingId ? (
                  <Pencil size={18} aria-hidden="true" />
                ) : (
                  <PackagePlus size={18} aria-hidden="true" />
                )}
              </span>
              <div>
                <p className="panel-kicker">Inventory record</p>
                <h2>{editingId ? "Update resource" : "Add relief resource"}</h2>
              </div>
              {editingId ? (
                <button
                  className="icon-button"
                  type="button"
                  onClick={resetForm}
                  aria-label="Cancel editing"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              ) : null}
            </div>

            <label>
              Resource name
              <input
                required
                minLength={2}
                maxLength={120}
                value={formState.name}
                onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                placeholder="Family food packs"
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select
                  value={formState.category}
                  onChange={(event) =>
                    setFormState({ ...formState, category: event.target.value as ResourceCategory })
                  }
                >
                  {RESOURCE_CATEGORY_VALUES.map((category) => (
                    <option key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Unit
                <input
                  required
                  maxLength={40}
                  value={formState.unit}
                  onChange={(event) => setFormState({ ...formState, unit: event.target.value })}
                  placeholder="packs"
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Quantity
                <input
                  required
                  min={0}
                  step="any"
                  type="number"
                  value={formState.quantity}
                  onChange={(event) =>
                    setFormState({ ...formState, quantity: Number(event.target.value) })
                  }
                />
              </label>

              <label>
                Reorder level
                <input
                  required
                  min={0}
                  step="any"
                  type="number"
                  value={formState.reorderLevel}
                  onChange={(event) =>
                    setFormState({ ...formState, reorderLevel: Number(event.target.value) })
                  }
                />
              </label>
            </div>

            <label>
              Storage location
              <input
                required
                minLength={2}
                maxLength={200}
                value={formState.location}
                onChange={(event) => setFormState({ ...formState, location: event.target.value })}
                placeholder="Central Relief Warehouse"
              />
            </label>

            <button className="primary-button" type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="spin" size={18} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={18} aria-hidden="true" />
              )}
              {isSaving ? "Saving..." : editingId ? "Save changes" : "Add to inventory"}
            </button>
          </form>

          <section className="resource-list panel" aria-live="polite">
            <div className="list-header">
              <div>
                <p className="panel-kicker">Live inventory</p>
                <h2>Relief resources</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => void refreshResources()}
                aria-label="Refresh relief resources"
              >
                <RefreshCw size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="filter-bar">
              <label className="search-field">
                <span className="sr-only">Search resources</span>
                <Search size={17} aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search resource or location"
                />
              </label>

              <label className="filter-field">
                <span className="sr-only">Filter stock status</span>
                <select
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value as StockFilter)}
                >
                  <option value="all">All stock levels</option>
                  <option value="available">Available</option>
                  <option value="low_stock">Low stock</option>
                  <option value="out_of_stock">Out of stock</option>
                </select>
              </label>
            </div>

            {errorMessage ? (
              <div className="error-banner" role="alert">
                <AlertTriangle size={18} aria-hidden="true" />
                {errorMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="state-panel">
                <Loader2 className="spin" size={26} aria-hidden="true" />
                <strong>Loading resource inventory</strong>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="state-panel">
                <CircleOff size={30} aria-hidden="true" />
                <strong>No matching resources</strong>
                <p>Adjust the filters or add a new inventory record.</p>
              </div>
            ) : (
              <div className="resource-table-wrap">
                <table className="resource-table">
                  <thead>
                    <tr>
                      <th scope="col">Resource</th>
                      <th scope="col">Stock</th>
                      <th scope="col">Location</th>
                      <th scope="col">Updated</th>
                      <th scope="col">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResources.map((resource) => (
                      <tr key={resource.id}>
                        <td data-label="Resource">
                          <strong>{resource.name}</strong>
                          <small>{CATEGORY_LABELS[resource.category]}</small>
                        </td>
                        <td data-label="Stock">
                          <strong>
                            {resource.quantity.toLocaleString()} {resource.unit}
                          </strong>
                          <span className={`status-badge ${resource.stockStatus}`}>
                            {STOCK_LABELS[resource.stockStatus]}
                          </span>
                        </td>
                        <td data-label="Location">
                          <span className="location-cell">
                            <MapPin size={15} aria-hidden="true" />
                            {resource.location}
                          </span>
                        </td>
                        <td data-label="Updated">
                          {new Date(resource.updatedAt).toLocaleDateString("en-MY", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="table-actions">
                          <button
                            className="icon-button"
                            type="button"
                            onClick={() => handleEdit(resource)}
                            aria-label={`Edit ${resource.name}`}
                          >
                            <Pencil size={16} aria-hidden="true" />
                          </button>
                          <button
                            className="icon-button danger"
                            type="button"
                            onClick={() => void handleDelete(resource)}
                            aria-label={`Delete ${resource.name}`}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>
    </>
  );
}
