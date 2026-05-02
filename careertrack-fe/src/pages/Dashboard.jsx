import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Funnel,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCircle2,
} from "lucide-react";
import api from "@/api/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("company-asc");
  const [displayName, setDisplayName] = useState("User");

  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    workType: "REMOTE",
    status: "PENDING",
  });

  const [editFormData, setEditFormData] = useState({
    companyName: "",
    position: "",
    workType: "REMOTE",
    status: "PENDING",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedName && storedName.trim()) {
      setDisplayName(toTitleCase(storedName.trim()));
      return;
    }

    if (storedEmail) {
      const localPart = storedEmail.split("@")[0]?.trim();

      if (localPart) {
        setDisplayName(toTitleCase(localPart));
        return;
      }
    }

    setDisplayName("User");
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/applications");

      setApplications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Veri çekme hatası:", error.response?.data || error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    try {
      setSubmitting(true);

      const payload = {
        companyName: formData.companyName,
        position: formData.position,
        workType: formData.workType,
        status: "PENDING",
      };

      await api.post("/applications", payload);
      await fetchApplications();
      closeModal();
    } catch (error) {
      console.error("Kayıt Hatası:", error.response?.data || error);
      alert("Kayıt başarısız! Backend'in istediği bilgileri kontrol et.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteApplication = async (id) => {
    const confirmed = window.confirm("Bu başvuruyu silmek istiyor musunuz?");

    if (!confirmed) return;

    try {
      await api.delete(`/applications/${id}`);
      await fetchApplications();
    } catch (error) {
      console.error("Silme hatası:", error.response?.data || error);
      alert("Silme başarısız.");
    }
  };

  const openModal = () => {
    setFormData({
      companyName: "",
      position: "",
      workType: "REMOTE",
      status: "PENDING",
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData({
      companyName: "",
      position: "",
      workType: "REMOTE",
      status: "PENDING",
    });

    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    navigate("/");
  };

  const openEditModal = (application) => {
    setSelectedApplication(application);

    setEditFormData({
      companyName: application.companyName || "",
      position: application.position || "",
      workType: application.workType || "REMOTE",
      status: application.status || "PENDING",
    });

    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedApplication(null);

    setEditFormData({
      companyName: "",
      position: "",
      workType: "REMOTE",
      status: "PENDING",
    });

    setIsEditModalOpen(false);
  };

  const updateApplication = async (e) => {
    e.preventDefault();

    if (!selectedApplication || updating) return;

    try {
      setUpdating(true);

      await api.put(`/applications/${selectedApplication.id}`, editFormData);

      await fetchApplications();
      closeEditModal();
    } catch (error) {
      console.error("Güncelleme hatası:", error.response?.data || error);
      alert("Başvuru güncellenemedi.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = applications.filter((app) => {
      const company = (app.companyName || "").toLowerCase();
      const position = (app.position || "").toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        company.includes(normalizedSearch) ||
        position.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "company-asc") {
        return (a.companyName || "").localeCompare(b.companyName || "");
      }

      if (sortBy === "company-desc") {
        return (b.companyName || "").localeCompare(a.companyName || "");
      }

      if (sortBy === "status") {
        return (a.status || "").localeCompare(b.status || "");
      }

      return 0;
    });
  }, [applications, searchTerm, statusFilter, sortBy]);

  const total = applications.length;
  const pending = applications.filter((app) => app.status === "PENDING").length;
  const interview = applications.filter(
    (app) => app.status === "INTERVIEW"
  ).length;
  const offer = applications.filter((app) => app.status === "OFFER").length;

  return (
    <>
      <div className="min-h-dvh w-full bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-3 sm:p-4 md:p-6">
        <div className="min-h-[calc(100dvh-1.5rem)] w-full rounded-3xl border border-white/60 bg-white/45 shadow-xl backdrop-blur-xl sm:min-h-[calc(100dvh-2rem)] md:min-h-[calc(100dvh-3rem)]">
          <header className="flex flex-col gap-4 border-b border-white/60 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="text-2xl font-black uppercase tracking-[0.2em] text-indigo-700 md:text-3xl">
                CareerTrack
              </p>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                Job Application Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                Track your pipeline with quick filters and edits.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 md:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-sm font-semibold text-gray-700 backdrop-blur-md">
                  <UserCircle2 size={18} className="text-indigo-600" />
                  <span>{`Hi ${displayName}!`}</span>
                </div>

                <button
                  onClick={handleLogout}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white/80 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>

              <button
                onClick={openModal}
                type="button"
                className="group mt-1 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-indigo-500/40"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition group-hover:bg-white/30">
                  <Plus size={16} />
                </span>
                Add Application
              </button>
            </div>
          </header>

          <main className="space-y-6 px-6 py-6 md:px-8 md:py-8">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Applications" value={total} />
              <StatCard label="Pending" value={pending} />
              <StatCard label="Interviews" value={interview} />
              <StatCard label="Offers" value={offer} />
            </section>

            <section className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-md backdrop-blur-md md:p-6">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Application List
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your applications, filters and status updates.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search company or position"
                      className="h-10 w-full rounded-xl border border-white/70 bg-white/80 pl-9 pr-3 text-sm outline-none ring-indigo-300 transition focus:ring sm:w-64"
                    />
                  </div>

                  <div className="relative">
                    <Funnel
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 rounded-xl border border-white/70 bg-white/80 pl-9 pr-8 text-sm outline-none ring-indigo-300 transition focus:ring"
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPLIED">Applied</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="OFFER">Offer</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-10 rounded-xl border border-white/70 bg-white/80 px-3 text-sm outline-none ring-indigo-300 transition focus:ring"
                  >
                    <option value="company-asc">Company (A-Z)</option>
                    <option value="company-desc">Company (Z-A)</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 py-16 text-center text-sm text-gray-500">
                  Loading applications...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/60 py-16 text-center">
                  <Briefcase className="mb-3 text-gray-400" size={28} />

                  <p className="text-sm font-medium text-gray-700">
                    No applications found
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Try changing search/filter options or add a new application.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/70 bg-white/70">
                  <table className="w-full text-left">
                    <thead className="border-b border-white/70 bg-white/65 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-4 py-3 md:px-6">Company</th>
                        <th className="px-4 py-3 md:px-6">Position</th>
                        <th className="px-4 py-3 md:px-6">Work Type</th>
                        <th className="px-4 py-3 md:px-6">Status</th>
                        <th className="px-4 py-3 text-right md:px-6">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredApplications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-b border-white/60 text-sm last:border-b-0 hover:bg-white/80"
                        >
                          <td className="px-4 py-4 font-semibold text-gray-900 md:px-6">
                            {app.companyName}
                          </td>

                          <td className="px-4 py-4 text-gray-700 md:px-6">
                            {app.position}
                          </td>

                          <td className="px-4 py-4 text-gray-700 md:px-6">
                            {formatEnumLabel(app.workType)}
                          </td>

                          <td className="px-4 py-4 md:px-6">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getStatusBadgeClass(
                                app.status
                              )}`}
                            >
                              {formatEnumLabel(app.status)}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-right md:px-6">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(app)}
                                type="button"
                                aria-label="Edit application"
                                title="Edit"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-indigo-600 transition hover:bg-indigo-100"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                onClick={() => deleteApplication(app.id)}
                                type="button"
                                aria-label="Delete application"
                                title="Delete"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition hover:bg-red-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-2 text-left text-2xl font-bold">
              Add New Application
            </h3>

            <p className="mb-6 text-sm text-gray-500">
              Create a new job application record.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Company
                </label>

                <input
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      companyName: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/70 bg-white/90 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Position
                </label>

                <input
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/70 bg-white/90 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Work Type
                </label>

                <select
                  value={formData.workType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workType: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/70 bg-white/90 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On Site</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg bg-gray-100 py-3 font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-2 text-left text-2xl font-bold">
              Edit Application
            </h3>

            <p className="mb-6 text-sm text-gray-500">
              Update application details.
            </p>

            <form onSubmit={updateApplication} className="space-y-4">
              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Company
                </label>

                <input
                  value={editFormData.companyName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      companyName: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/70 bg-white/90 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Position
                </label>

                <input
                  value={editFormData.position}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      position: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/70 bg-white/90 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Work Type
                </label>

                <select
                  value={editFormData.workType}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      workType: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/70 bg-white/90 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On Site</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Status
                </label>

                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/70 bg-white/90 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 rounded-lg bg-gray-100 py-3 font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/55 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <div className="mt-3">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "APPLIED":
      return "bg-sky-100 text-sky-700";
    case "INTERVIEW":
      return "bg-indigo-100 text-indigo-700";
    case "OFFER":
      return "bg-emerald-100 text-emerald-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatEnumLabel(value) {
  if (!value) return "-";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toTitleCase(value) {
  return value
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}