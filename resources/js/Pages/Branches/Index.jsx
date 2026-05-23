import { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineX,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";
import Drawer from "@/Components/Drawer";
import BranchFormDrawer from "@/Components/BranchFormDrawer";

export default function Index({ branches }) {
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);

    // Debounced search
    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("branches.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const confirmDelete = (branch) => {
        setBranchToDelete(branch);
        setShowDeleteModal(true);
    };

    const deleteBranch = () => {
        router.delete(route("branches.destroy", branchToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setBranchToDelete(null);
            },
        });
    };

    const openCreateDrawer = () => {
        setEditingBranch(null);
        setDrawerOpen(true);
    };

    const openEditDrawer = (branch) => {
        setEditingBranch(branch);
        setDrawerOpen(true);
    };

    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Branch Management
                </h2>
            }
        >
            <Head title="Branch Management" />
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
                                    placeholder="Search by code, name, or email..."
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
                                    onClick={openCreateDrawer}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-sm"
                                >
                                    <HiOutlinePlus className="w-5 h-5" />
                                    Add Branch
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Main
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Active
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {branches.data.map((branch) => (
                                    <tr
                                        key={branch.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4">
                                            {branch.code}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {branch.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {branch.type || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {branch.email || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {branch.phone || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {branch.is_main ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {branch.is_active ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex gap-3">
                                            <button
                                                onClick={() =>
                                                    openEditDrawer(branch)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit Branch"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    confirmDelete(branch)
                                                }
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                title="Delete Branch"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {branches.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No branches found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={branches.links} />
                    </div>
                </div>
            </div>

            {/* Create/Edit Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingBranch(null);
                }}
                title={editingBranch ? "Edit Branch" : "Create New Branch"}
                width="w-full max-w-2xl"
            >
                <BranchFormDrawer
                    branch={editingBranch}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingBranch(null);
                    }}
                />
            </Drawer>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteBranch}
                title="Delete Branch"
                message={`Are you sure you want to delete "${branchToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </AuthenticatedLayout>
    );
}
