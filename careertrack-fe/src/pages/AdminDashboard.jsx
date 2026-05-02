import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  CalendarCheck,
  Clock,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import api from "@/api/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [usersPage, setUsersPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const currentUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    setUsersPage(1);
  }, [usersPerPage]);

  const totalUserPages = Math.ceil(users.length / usersPerPage) || 1;

  useEffect(() => {
    if (usersPage > totalUserPages) {
      setUsersPage(totalUserPages);
    }
  }, [usersPage, totalUserPages]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [usersResponse, applicationsResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/applications"),
      ]);

      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      setApplications(
        Array.isArray(applicationsResponse.data)
          ? applicationsResponse.data
          : []
      );
    } catch (error) {
      console.error("Admin data fetch error:", error.response?.data || error);
      setUsers([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    navigate("/");
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role?role=${newRole}`);
      await fetchAdminData();
    } catch (error) {
      console.error("Role update error:", error.response?.data || error);
      alert("User role could not be updated.");
    }
  };

  const openAddUserModal = () => {
    setNewUserForm({
      name: "",
      email: "",
      password: "",
      role: "USER",
    });

    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setNewUserForm({
      name: "",
      email: "",
      password: "",
      role: "USER",
    });

    setIsAddUserModalOpen(false);
  };

  const createUser = async (e) => {
    e.preventDefault();

    if (creatingUser) return;

    try {
      setCreatingUser(true);

      await api.post("/admin/users", newUserForm);

      await fetchAdminData();
      closeAddUserModal();
    } catch (error) {
      console.error("Create user error:", error.response?.data || error);
      alert("User could not be created.");
    } finally {
      setCreatingUser(false);
    }
  };

  const filteredApplications = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) return applications;

    return applications.filter((app) => {
      const company = (app.companyName || "").toLowerCase();
      const position = (app.position || "").toLowerCase();
      const userEmail = (app.user?.email || "").toLowerCase();
      const userName = (app.user?.name || "").toLowerCase();

      return (
        company.includes(normalized) ||
        position.includes(normalized) ||
        userEmail.includes(normalized) ||
        userName.includes(normalized)
      );
    });
  }, [applications, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (usersPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;

    return users.slice(startIndex, endIndex);
  }, [users, usersPage, usersPerPage]);

  const totalUsers = users.length;
  const totalApplications = applications.length;
  const pending = applications.filter((app) => app.status === "PENDING").length;
  const interviews = applications.filter(
    (app) => app.status === "INTERVIEW"
  ).length;
  const offers = applications.filter((app) => app.status === "OFFER").length;

  return (
    <>
      <div className="min-h-dvh w-full bg-gradient-to-br from-slate-100 via-indigo-50 to-violet-100 p-3 sm:p-4 md:p-6">
        <div className="min-h-[calc(100dvh-1.5rem)] rounded-3xl border border-white/60 bg-white/45 shadow-xl backdrop-blur-xl sm:min-h-[calc(100dvh-2rem)] md:min-h-[calc(100dvh-3rem)]">
          <header className="flex flex-col gap-4 border-b border-white/60 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                <ShieldCheck size={16} />
                Admin Panel
              </div>

              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                CareerTrack Admin Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                Monitor users, applications and system-wide job tracking
                activity.
              </p>
            </div>

            <button
              onClick={handleLogout}
              type="button"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 bg-white/80 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 md:self-auto"
            >
              <LogOut size={16} />
              Logout
            </button>
          </header>

          <main className="space-y-6 px-6 py-6 md:px-8 md:py-8">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <AdminStatCard
                icon={<Users size={20} />}
                label="Total Users"
                value={totalUsers}
              />
              <AdminStatCard
                icon={<Briefcase size={20} />}
                label="Applications"
                value={totalApplications}
              />
              <AdminStatCard
                icon={<Clock size={20} />}
                label="Pending"
                value={pending}
              />
              <AdminStatCard
                icon={<CalendarCheck size={20} />}
                label="Interviews"
                value={interviews}
              />
              <AdminStatCard
                icon={<Trophy size={20} />}
                label="Offers"
                value={offers}
              />
            </section>

            <section className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-md backdrop-blur-md md:p-6">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    User Management
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    View users, create new accounts and update their roles.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3 py-2">
                    <span className="text-sm text-gray-500">Show</span>

                    <select
                      value={usersPerPage}
                      onChange={(e) =>
                        setUsersPerPage(Number(e.target.value))
                      }
                      className="h-8 rounded-lg border border-white/70 bg-white/90 px-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>

                    <span className="text-sm text-gray-500">users</span>
                  </div>

                  <button
                    type="button"
                    onClick={openAddUserModal}
                    className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-indigo-500/40"
                  >
                    <Plus size={18} />
                    Add User
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 py-10 text-center text-sm text-gray-500">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 py-10 text-center text-sm text-gray-500">
                  No users found.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-white/70 bg-white/70">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="border-b border-white/70 bg-white/65 text-xs uppercase tracking-wide text-gray-500">
                        <tr>
                          <th className="px-4 py-3 md:px-6">Name</th>
                          <th className="px-4 py-3 md:px-6">Email</th>
                          <th className="px-4 py-3 md:px-6">Current Role</th>
                          <th className="px-4 py-3 text-right md:px-6">
                            Change Role
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-white/60 text-sm last:border-b-0 hover:bg-white/80"
                          >
                            <td className="px-4 py-4 font-semibold text-gray-900 md:px-6">
                              {user.name || "Unknown User"}
                            </td>

                            <td className="px-4 py-4 text-gray-700 md:px-6">
                              {user.email}
                            </td>

                            <td className="px-4 py-4 md:px-6">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getRoleBadgeClass(
                                  user.role
                                )}`}
                              >
                                {user.role}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-right md:px-6">
                              <select
                                value={user.role}
                                disabled={user.email === currentUserEmail}
                                onChange={(e) =>
                                  updateUserRole(user.id, e.target.value)
                                }
                                className="rounded-lg border border-white/70 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                    <p className="text-sm text-gray-500">
                      Showing{" "}
                      <span className="font-semibold text-gray-700">
                        {users.length === 0
                          ? 0
                          : (usersPage - 1) * usersPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-gray-700">
                        {Math.min(usersPage * usersPerPage, users.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-700">
                        {users.length}
                      </span>{" "}
                      users
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setUsersPage((page) => Math.max(page - 1, 1))
                        }
                        disabled={usersPage === 1}
                        className="rounded-lg border border-white/70 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Previous
                      </button>

                      {Array.from(
                        { length: totalUserPages },
                        (_, index) => index + 1
                      ).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setUsersPage(page)}
                          className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                            usersPage === page
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "border border-white/70 bg-white/80 text-gray-700 hover:bg-white"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          setUsersPage((page) =>
                            Math.min(page + 1, totalUserPages)
                          )
                        }
                        disabled={usersPage === totalUserPages}
                        className="rounded-lg border border-white/70 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-md backdrop-blur-md md:p-6">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Applications
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    View applications from all registered users.
                  </p>
                </div>

                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search company, position or user email"
                    className="h-10 w-full rounded-xl border border-white/70 bg-white/80 pl-9 pr-3 text-sm outline-none ring-indigo-300 transition focus:ring sm:w-80"
                  />
                </div>
              </div>

              {loading ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 py-16 text-center text-sm text-gray-500">
                  Loading admin data...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 py-16 text-center text-sm text-gray-500">
                  No applications found.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/70 bg-white/70">
                  <table className="w-full text-left">
                    <thead className="border-b border-white/70 bg-white/65 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-4 py-3 md:px-6">User</th>
                        <th className="px-4 py-3 md:px-6">Company</th>
                        <th className="px-4 py-3 md:px-6">Position</th>
                        <th className="px-4 py-3 md:px-6">Work Type</th>
                        <th className="px-4 py-3 md:px-6">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredApplications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-b border-white/60 text-sm last:border-b-0 hover:bg-white/80"
                        >
                          <td className="px-4 py-4 md:px-6">
                            <p className="font-semibold text-gray-900">
                              {app.user?.name || "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {app.user?.email || "-"}
                            </p>
                          </td>

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

      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-2 text-left text-2xl font-bold">
              Add New User
            </h3>

            <p className="mb-6 text-sm text-gray-500">
              Create a new user account and assign a role.
            </p>

            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  value={newUserForm.name}
                  onChange={(e) =>
                    setNewUserForm({
                      ...newUserForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Test User"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm({
                      ...newUserForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. user@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) =>
                    setNewUserForm({
                      ...newUserForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-left text-sm font-semibold text-gray-700">
                  Role
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm({
                      ...newUserForm,
                      role: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeAddUserModal}
                  className="flex-1 rounded-lg bg-gray-100 py-3 font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingUser}
                  className="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingUser ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function AdminStatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/55 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
        {icon}
      </div>

      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function getRoleBadgeClass(role) {
  switch (role) {
    case "ADMIN":
      return "bg-violet-100 text-violet-700";
    case "USER":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
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