import { Link, router, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineUserAdd,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineX,
    HiOutlineUserGroup,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import Drawer from "@/Components/Drawer";
import UserForm from "@/Components/UserForm";

export default function Index({ users, roles, branches }) {
    // ← added branches
    const flash = usePage().props.flash;
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState("");
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Debounced search & filter
    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("users.index"),
                {
                    search: search || undefined,
                    status: statusFilter || undefined,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search, statusFilter]);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("users.index"),
                {
                    search: search || undefined,
                    status: statusFilter || undefined,
                    role: roleFilter || undefined,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search, statusFilter, roleFilter]);

    const deleteUser = () => {
        if (userToDelete) {
            router.delete(route("users.destroy", userToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("");
        setRoleFilter("");
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Management" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Search, Filter, and Add User Bar */}
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700 mb-6">
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            {/* Search input */}
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiOutlineSearch className="w-4 h-4 text-body dark:text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, email, or employee ID..."
                                    className="block w-full pl-9 pr-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 text-heading dark:text-white text-sm rounded-base focus:ring-primary focus:border-primary placeholder:text-body dark:placeholder-gray-400"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Role Filter Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setRoleDropdownOpen(
                                                !roleDropdownOpen,
                                            )
                                        }
                                        className="shrink-0 inline-flex items-center justify-center text-body dark:text-gray-300 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 hover:bg-neutral-tertiary-medium dark:hover:bg-gray-600 hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium rounded-base text-sm px-3 py-2"
                                    >
                                        <HiOutlineUserGroup className="w-4 h-4 mr-1.5" />
                                        {roleFilter
                                            ? `Role: ${roleFilter}`
                                            : "Filter by role"}
                                    </button>
                                    {roleDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 z-10 bg-neutral-primary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base shadow-lg">
                                            <ul className="p-2 text-sm text-body dark:text-gray-300 font-medium max-h-60 overflow-y-auto">
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            setRoleFilter("");
                                                            setRoleDropdownOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className={`inline-flex w-full p-2 rounded hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700 ${!roleFilter ? "bg-neutral-tertiary-medium" : ""}`}
                                                    >
                                                        All Roles
                                                    </button>
                                                </li>
                                                {roles.map((role) => (
                                                    <li key={role.id}>
                                                        <button
                                                            onClick={() => {
                                                                setRoleFilter(
                                                                    role.name,
                                                                );
                                                                setRoleDropdownOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className={`inline-flex w-full p-2 rounded hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700 ${roleFilter === role.name ? "bg-neutral-tertiary-medium" : ""}`}
                                                        >
                                                            {role.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                {/* Filter Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setFilterDropdownOpen(
                                                !filterDropdownOpen,
                                            )
                                        }
                                        className="shrink-0 inline-flex items-center justify-center text-body dark:text-gray-300 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 hover:bg-neutral-tertiary-medium dark:hover:bg-gray-600 hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium rounded-base text-sm px-3 py-2"
                                    >
                                        <HiOutlineFilter className="w-4 h-4 mr-1.5" />
                                        Filter by status
                                    </button>
                                    {filterDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-40 z-10 bg-neutral-primary-medium dark:bg-gray-800 border border-default-medium dark:border-gray-700 rounded-base shadow-lg">
                                            <ul className="p-2 text-sm text-body dark:text-gray-300 font-medium">
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            setStatusFilter("");
                                                            setFilterDropdownOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className={`inline-flex w-full p-2 rounded hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700 ${!statusFilter ? "bg-neutral-tertiary-medium" : ""}`}
                                                    >
                                                        All
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            setStatusFilter(
                                                                "active",
                                                            );
                                                            setFilterDropdownOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className="inline-flex w-full p-2 rounded hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700"
                                                    >
                                                        Active
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            setStatusFilter(
                                                                "inactive",
                                                            );
                                                            setFilterDropdownOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className="inline-flex w-full p-2 rounded hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700"
                                                    >
                                                        Inactive
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            setStatusFilter(
                                                                "suspended",
                                                            );
                                                            setFilterDropdownOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className="inline-flex w-full p-2 rounded hover:bg-neutral-tertiary-medium dark:hover:bg-gray-700"
                                                    >
                                                        Suspended
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Add User Button */}
                                <button
                                    onClick={() => {
                                        setEditingUser(null);
                                        setDrawerOpen(true);
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-sm"
                                >
                                    <HiOutlineUserAdd className="w-5 h-5" />
                                    New User
                                </button>

                                {/* Clear filters */}
                                {(search || statusFilter || roleFilter) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm flex items-center gap-1"
                                    >
                                        <HiOutlineX className="w-4 h-4" /> Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Scrollable table */}
                        <div className="overflow-x-auto shadow-md sm:rounded-sm">
                            <div className="inline-block min-w-full align-middle">
                                <table className="min-w-[1000px] md:min-w-full w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                                    <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                        <tr>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">
                                                Employee ID
                                            </th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">
                                                Branch
                                            </th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">
                                                Roles
                                            </th>
                                            <th className="px-6 py-3 font-medium whitespace-nowrap">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                            >
                                                <th className="px-6 py-4 font-medium text-heading dark:text-white whitespace-nowrap">
                                                    {user.full_name}
                                                </th>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.employee_id || "—"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.branch?.name || "—"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${
                                                            user.status ===
                                                            "active"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                : user.status ===
                                                                    "inactive"
                                                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                        }`}
                                                    >
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.map(
                                                            (role) => (
                                                                <span
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap"
                                                                >
                                                                    {role.name}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 flex gap-3 whitespace-nowrap">
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(
                                                                user,
                                                            );
                                                            setDrawerOpen(true);
                                                        }}
                                                        className="text-fg-brand hover:underline"
                                                        title="Edit"
                                                    >
                                                        <HiOutlinePencil className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            confirmDelete(user)
                                                        }
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                        title="Delete"
                                                    >
                                                        <HiOutlineTrash className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.data.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                                >
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <Pagination links={users.links} />
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteUser}
                title="Delete User"
                message={`Are you sure you want to delete ${userToDelete?.full_name}? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />

            {/* Drawer for Create/Edit User – wider to accommodate all fields */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={editingUser ? "Edit User" : "Create New User"}
                width="w-full max-w-2xl"
            >
                <UserForm
                    user={editingUser}
                    roles={roles}
                    userRoles={editingUser?.roles?.map((r) => r.name) || []}
                    branches={branches} // ← added
                    onSuccess={() => setDrawerOpen(false)}
                    onCancel={() => setDrawerOpen(false)}
                />
            </Drawer>
        </AuthenticatedLayout>
    );
}
