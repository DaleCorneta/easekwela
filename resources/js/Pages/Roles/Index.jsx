import { useState, useEffect } from "react";
import { Head, router, usePage, Link } from "@inertiajs/react";
import {
    HiOutlineSearch,
    HiOutlineEye,
    HiOutlineTrash,
    HiOutlineX,
    HiOutlinePlus,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";
import Drawer from "@/Components/Drawer";
import RoleFormDrawer from "@/Components/RoleFormDrawer";
import EditRoleDrawer from "@/Components/EditRoleDrawer";

export default function Index({ roles, allPermissions }) {
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("roles.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const confirmDelete = (role) => {
        if (role.name === "Super Admin") return;
        if (role.permissions.length > 0) {
            router.delete(route("roles.destroy", role.id));
            return;
        }
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    const deleteRole = () => {
        router.delete(route("roles.destroy", roleToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setRoleToDelete(null);
            },
        });
    };

    const clearSearch = () => setSearch("");

    const openEditDrawer = (role) => {
        setSelectedRole(role);
        setEditDrawerOpen(true);
    };

    const isSuperAdmin = (roleName) => roleName === "Super Admin";

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Role Management
                </h2>
            }
        >
            <Head title="Role Management" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        {/* Search bar + Add button */}
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="relative w-full max-w-96">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiOutlineSearch className="w-4 h-4 text-body dark:text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by role name..."
                                    className="block w-full pl-9 pr-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 text-heading dark:text-white text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body dark:placeholder-gray-400"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                {search && (
                                    <button
                                        onClick={clearSearch}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm flex items-center gap-1"
                                    >
                                        <HiOutlineX className="w-4 h-4" /> Clear
                                    </button>
                                )}
                                <button
                                    onClick={() => setCreateDrawerOpen(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-sm"
                                >
                                    <HiOutlinePlus className="w-5 h-5" />
                                    Add Role
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 font-medium"
                                    >
                                        Role Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 font-medium"
                                    >
                                        Permissions Count
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 font-medium"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.data.map((role) => {
                                    const cannotModify = isSuperAdmin(
                                        role.name,
                                    );
                                    return (
                                        <tr
                                            key={role.id}
                                            className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-heading dark:text-white whitespace-nowrap"
                                            >
                                                {role.name}
                                                {cannotModify && (
                                                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                                        System
                                                    </span>
                                                )}
                                            </th>
                                            <td className="px-6 py-4">
                                                {role.permissions.length}
                                            </td>
                                            <td className="px-6 py-4 flex gap-3">
                                                {cannotModify ? (
                                                    <span
                                                        className="text-gray-400 cursor-not-allowed"
                                                        title="Super Admin cannot be edited"
                                                    >
                                                        <HiOutlineEye className="w-5 h-5" />
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            openEditDrawer(role)
                                                        }
                                                        className="font-medium text-fg-brand hover:underline"
                                                        title="Edit Permissions"
                                                    >
                                                        <HiOutlineEye className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {cannotModify ? (
                                                    <span
                                                        className="text-gray-400 cursor-not-allowed"
                                                        title="Super Admin cannot be deleted"
                                                    >
                                                        <HiOutlineTrash className="w-5 h-5" />
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            confirmDelete(role)
                                                        }
                                                        className="font-medium text-red-600 hover:text-red-800 dark:text-red-400"
                                                        title="Delete Role"
                                                    >
                                                        <HiOutlineTrash className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {roles.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No roles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={roles.links} />
                    </div>
                </div>
            </div>

            {/* Create Role Drawer */}
            <Drawer
                isOpen={createDrawerOpen}
                onClose={() => setCreateDrawerOpen(false)}
                title="Create New Role"
                width="w-full max-w-3xl"
            >
                <RoleFormDrawer
                    permissions={allPermissions || {}}
                    onClose={() => setCreateDrawerOpen(false)}
                />
            </Drawer>

            {/* Edit Role Drawer */}
            {selectedRole && (
                <Drawer
                    isOpen={editDrawerOpen}
                    onClose={() => {
                        setEditDrawerOpen(false);
                        setSelectedRole(null);
                    }}
                    title={`Edit Role: ${selectedRole.name}`}
                    width="w-full max-w-3xl"
                >
                    <EditRoleDrawer
                        role={selectedRole}
                        permissions={allPermissions}
                        rolePermissions={selectedRole.permissions.map(
                            (p) => p.name,
                        )}
                        onClose={() => {
                            setEditDrawerOpen(false);
                            setSelectedRole(null);
                        }}
                    />
                </Drawer>
            )}

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteRole}
                title="Delete Role"
                message={`Are you sure you want to delete "${roleToDelete?.name}"?`}
                confirmText="Delete"
                variant="danger"
            />
        </AuthenticatedLayout>
    );
}
