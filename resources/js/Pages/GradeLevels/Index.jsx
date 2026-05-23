import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineX,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";
import Drawer from "@/Components/Drawer";
import GradeLevelFormDrawer from "@/Components/GradeLevelFormDrawer";

export default function Index({ gradeLevels, branches }) {
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [gradeLevelToDelete, setGradeLevelToDelete] = useState(null);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [gradeLevelToActivate, setGradeLevelToActivate] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [gradeLevelToDeactivate, setGradeLevelToDeactivate] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingGradeLevel, setEditingGradeLevel] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("grade-levels.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const confirmDelete = (gradeLevel) => {
        setGradeLevelToDelete(gradeLevel);
        setShowDeleteModal(true);
    };
    const deleteGradeLevel = () => {
        router.visit(route("grade-levels.destroy", gradeLevelToDelete.id), {
            method: "delete",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setGradeLevelToDelete(null);
            },
            onFinish: () => {
                setShowDeleteModal(false);
                setGradeLevelToDelete(null);
            },
        });
    };

    const confirmActivate = (gradeLevel) => {
        setGradeLevelToActivate(gradeLevel);
        setShowActivateModal(true);
    };
    const activateGradeLevel = () => {
        router.visit(route("grade-levels.activate", gradeLevelToActivate.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setGradeLevelToActivate(null);
            },
            onFinish: () => {
                setShowActivateModal(false);
                setGradeLevelToActivate(null);
            },
        });
    };

    const confirmDeactivate = (gradeLevel) => {
        setGradeLevelToDeactivate(gradeLevel);
        setShowDeactivateModal(true);
    };
    const deactivateGradeLevel = () => {
        router.visit(
            route("grade-levels.deactivate", gradeLevelToDeactivate.id),
            {
                method: "post",
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeactivateModal(false);
                    setGradeLevelToDeactivate(null);
                },
                onFinish: () => {
                    setShowDeactivateModal(false);
                    setGradeLevelToDeactivate(null);
                },
            },
        );
    };

    const openCreateDrawer = () => {
        setEditingGradeLevel(null);
        setDrawerOpen(true);
    };
    const openEditDrawer = (gradeLevel) => {
        setEditingGradeLevel(gradeLevel);
        setDrawerOpen(true);
    };
    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Grade Levels
                </h2>
            }
        >
            <Head title="Grade Levels" />
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
                                    placeholder="Search by name, code or stage..."
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
                                    Add Grade Level
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
                                        Grade Level
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Branch
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Educational Stage
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        SHS
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
                                {gradeLevels.data.map((gl) => (
                                    <tr
                                        key={gl.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {gl.code}
                                        </td>
                                        <td className="px-6 py-4">{gl.name}</td>
                                        <td className="px-6 py-4">
                                            {gl.branch?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {gl.educational_stage}
                                        </td>
                                        <td className="px-6 py-4">
                                            {gl.is_shs ? (
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
                                            {gl.is_active ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex flex-wrap gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditDrawer(gl)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            {!gl.is_active ? (
                                                <button
                                                    onClick={() =>
                                                        confirmActivate(gl)
                                                    }
                                                    className="text-green-600 hover:text-green-800 dark:text-green-400"
                                                    title="Activate"
                                                >
                                                    <HiOutlineCheckCircle className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        confirmDeactivate(gl)
                                                    }
                                                    className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                                    title="Deactivate"
                                                >
                                                    <HiOutlineXCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    confirmDelete(gl)
                                                }
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {gradeLevels.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No grade levels found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={gradeLevels.links} />
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingGradeLevel(null);
                }}
                title={
                    editingGradeLevel
                        ? "Edit Grade Level"
                        : "Create New Grade Level"
                }
                width="w-full max-w-2xl"
            >
                <GradeLevelFormDrawer
                    gradeLevel={editingGradeLevel}
                    branches={branches}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingGradeLevel(null);
                    }}
                />
            </Drawer>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteGradeLevel}
                title="Delete Grade Level"
                message={`Are you sure you want to delete "${gradeLevelToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />

            {/* Activate Modal */}
            <Modal
                isOpen={showActivateModal}
                onClose={() => setShowActivateModal(false)}
                onConfirm={activateGradeLevel}
                title="Activate Grade Level"
                message={`Activating "${gradeLevelToActivate?.name}" will make it available for selection. Continue?`}
                confirmText="Activate"
                variant="info"
            />

            {/* Deactivate Modal */}
            <Modal
                isOpen={showDeactivateModal}
                onClose={() => setShowDeactivateModal(false)}
                onConfirm={deactivateGradeLevel}
                title="Deactivate Grade Level"
                message={`Deactivating "${gradeLevelToDeactivate?.name}" will hide it from selection lists. Continue?`}
                confirmText="Deactivate"
                variant="warning"
            />
        </AuthenticatedLayout>
    );
}
