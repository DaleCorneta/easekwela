import { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineX,
    HiOutlineCheckCircle,
    HiOutlineLockClosed,
    HiOutlineLockOpen,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";
import Drawer from "@/Components/Drawer";
import SchoolYearFormDrawer from "@/Components/SchoolYearFormDrawer";

export default function Index({ schoolYears, branches }) {
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [yearToDelete, setYearToDelete] = useState(null);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [yearToActivate, setYearToActivate] = useState(null);
    const [showLockModal, setShowLockModal] = useState(false);
    const [yearToLock, setYearToLock] = useState(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [yearToUnlock, setYearToUnlock] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingYear, setEditingYear] = useState(null);

    // Debounced search
    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("school-years.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    // Delete
    const confirmDelete = (year) => {
        setYearToDelete(year);
        setShowDeleteModal(true);
    };
    const deleteYear = () => {
        router.visit(route("school-years.destroy", yearToDelete.id), {
            method: "delete",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setYearToDelete(null);
            },
            onFinish: () => {
                setShowDeleteModal(false);
                setYearToDelete(null);
            },
        });
    };

    // Activate
    const confirmActivate = (year) => {
        setYearToActivate(year);
        setShowActivateModal(true);
    };
    const activateYear = () => {
        router.visit(route("school-years.activate", yearToActivate.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setYearToActivate(null);
            },
            onFinish: () => {
                setShowActivateModal(false);
                setYearToActivate(null);
            },
        });
    };

    // Lock
    const confirmLock = (year) => {
        setYearToLock(year);
        setShowLockModal(true);
    };
    const lockYear = () => {
        router.visit(route("school-years.lock", yearToLock.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowLockModal(false);
                setYearToLock(null);
            },
            onFinish: () => {
                setShowLockModal(false);
                setYearToLock(null);
            },
        });
    };

    // Unlock
    const confirmUnlock = (year) => {
        setYearToUnlock(year);
        setShowUnlockModal(true);
    };
    const unlockYear = () => {
        router.visit(route("school-years.unlock", yearToUnlock.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowUnlockModal(false);
                setYearToUnlock(null);
            },
            onFinish: () => {
                setShowUnlockModal(false);
                setYearToUnlock(null);
            },
        });
    };

    const openCreateDrawer = () => {
        setEditingYear(null);
        setDrawerOpen(true);
    };
    const openEditDrawer = (year) => {
        setEditingYear(year);
        setDrawerOpen(true);
    };
    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    School Years
                </h2>
            }
        >
            <Head title="School Years" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        {/* Search & Add Button (unchanged) */}
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="relative w-full max-w-96">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiOutlineSearch className="w-4 h-4 text-body dark:text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or branch..."
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
                                    Add School Year
                                </button>
                            </div>
                        </div>

                        {/* Table (unchanged) */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        School Year
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Branch
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        End Date
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Active
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Locked
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {schoolYears.data.map((year) => (
                                    <tr
                                        key={year.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {year.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {year.branch?.name || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {year.start_date}
                                        </td>
                                        <td className="px-6 py-4">
                                            {year.end_date}
                                        </td>
                                        <td className="px-6 py-4">
                                            {year.is_active ? (
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
                                            {year.is_locked ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                                    Locked
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Unlocked
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex flex-wrap gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditDrawer(year)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            {!year.is_active && (
                                                <button
                                                    onClick={() =>
                                                        confirmActivate(year)
                                                    }
                                                    className="text-green-600 hover:text-green-800 dark:text-green-400"
                                                    title="Activate"
                                                >
                                                    <HiOutlineCheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {!year.is_locked ? (
                                                <button
                                                    onClick={() =>
                                                        confirmLock(year)
                                                    }
                                                    className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                                    title="Lock"
                                                >
                                                    <HiOutlineLockClosed className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        confirmUnlock(year)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                    title="Unlock"
                                                >
                                                    <HiOutlineLockOpen className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    confirmDelete(year)
                                                }
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {schoolYears.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No school years found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={schoolYears.links} />
                    </div>
                </div>
            </div>

            {/* Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingYear(null);
                }}
                title={
                    editingYear ? "Edit School Year" : "Create New School Year"
                }
                width="w-full max-w-2xl"
            >
                <SchoolYearFormDrawer
                    schoolYear={editingYear}
                    branches={branches}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingYear(null);
                    }}
                />
            </Drawer>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteYear}
                title="Delete School Year"
                message={`Are you sure you want to delete "${yearToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />

            {/* Activate Modal */}
            <Modal
                isOpen={showActivateModal}
                onClose={() => setShowActivateModal(false)}
                onConfirm={activateYear}
                title="Activate School Year"
                message={`Activating "${yearToActivate?.name}" will deactivate any other active school year for the same branch. Continue?`}
                confirmText="Activate"
                variant="info"
            />

            {/* Lock Modal */}
            <Modal
                isOpen={showLockModal}
                onClose={() => setShowLockModal(false)}
                onConfirm={lockYear}
                title="Lock School Year"
                message={`Locking "${yearToLock?.name}" will prevent any further changes to this school year. Continue?`}
                confirmText="Lock"
                variant="warning"
            />

            {/* Unlock Modal */}
            <Modal
                isOpen={showUnlockModal}
                onClose={() => setShowUnlockModal(false)}
                onConfirm={unlockYear}
                title="Unlock School Year"
                message={`Unlocking "${yearToUnlock?.name}" will allow modifications to this school year again. Continue?`}
                confirmText="Unlock"
                variant="info"
            />
        </AuthenticatedLayout>
    );
}
