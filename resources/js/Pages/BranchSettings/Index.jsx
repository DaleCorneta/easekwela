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
import BranchSettingForm from "@/Components/BranchSetingForm";

export default function Index({ settings, branches }) {
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [settingToDelete, setSettingToDelete] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingSetting, setEditingSetting] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("branch-settings.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const confirmDelete = (setting) => {
        setSettingToDelete(setting);
        setShowDeleteModal(true);
    };

    const deleteSetting = () => {
        router.delete(route("branch-settings.destroy", settingToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSettingToDelete(null);
            },
        });
    };

    const openCreateDrawer = () => {
        setEditingSetting(null);
        setDrawerOpen(true);
    };

    const openEditDrawer = (setting) => {
        setEditingSetting(setting);
        setDrawerOpen(true);
    };

    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Branch Settings
                </h2>
            }
        >
            <Head title="Branch Settings" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        {/* Search + Add Button */}
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="relative w-full max-w-96">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiOutlineSearch className="w-4 h-4 text-body dark:text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by branch, group, or key..."
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
                                    Add Setting
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        Branch
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Group
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Key
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Value (preview)
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings.data.map((setting) => (
                                    <tr
                                        key={setting.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4">
                                            {setting.branch?.code} -{" "}
                                            {setting.branch?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {setting.group}
                                        </td>
                                        <td className="px-6 py-4">
                                            {setting.key}
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-xs">
                                            {setting.value
                                                ? setting.value.length > 50
                                                    ? setting.value.substring(
                                                          0,
                                                          50,
                                                      ) + "…"
                                                    : setting.value
                                                : "—"}
                                        </td>
                                        <td className="px-6 py-4 flex gap-3">
                                            <button
                                                onClick={() =>
                                                    openEditDrawer(setting)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit Setting"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    confirmDelete(setting)
                                                }
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                title="Delete Setting"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {settings.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No branch settings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={settings.links} />
                    </div>
                </div>
            </div>

            {/* Create/Edit Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingSetting(null);
                }}
                title={editingSetting ? "Edit Setting" : "Create New Setting"}
                width="w-full max-w-2xl"
            >
                <BranchSettingForm
                    setting={editingSetting}
                    branches={branches}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingSetting(null);
                    }}
                />
            </Drawer>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteSetting}
                title="Delete Setting"
                message={`Are you sure you want to delete "${settingToDelete?.key}" for branch "${settingToDelete?.branch?.name}"?`}
                confirmText="Delete"
                variant="danger"
            />
        </AuthenticatedLayout>
    );
}
