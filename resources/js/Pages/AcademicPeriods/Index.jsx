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
import AcademicPeriodFormDrawer from "@/Components/AcademicPeriodFormDrawer";

export default function Index({ periods, schoolYears }) {
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [periodToDelete, setPeriodToDelete] = useState(null);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [periodToActivate, setPeriodToActivate] = useState(null);
    const [showLockModal, setShowLockModal] = useState(false);
    const [periodToLock, setPeriodToLock] = useState(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [periodToUnlock, setPeriodToUnlock] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("academic-periods.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const confirmDelete = (period) => {
        setPeriodToDelete(period);
        setShowDeleteModal(true);
    };
    const deletePeriod = () => {
        router.visit(route("academic-periods.destroy", periodToDelete.id), {
            method: "delete",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setPeriodToDelete(null);
            },
            onFinish: () => {
                setShowDeleteModal(false);
                setPeriodToDelete(null);
            },
        });
    };

    const confirmActivate = (period) => {
        setPeriodToActivate(period);
        setShowActivateModal(true);
    };
    const activatePeriod = () => {
        router.visit(route("academic-periods.activate", periodToActivate.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setPeriodToActivate(null);
            },
            onFinish: () => {
                setShowActivateModal(false);
                setPeriodToActivate(null);
            },
        });
    };

    const confirmLock = (period) => {
        setPeriodToLock(period);
        setShowLockModal(true);
    };
    const lockPeriod = () => {
        router.visit(route("academic-periods.lock", periodToLock.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowLockModal(false);
                setPeriodToLock(null);
            },
            onFinish: () => {
                setShowLockModal(false);
                setPeriodToLock(null);
            },
        });
    };

    const confirmUnlock = (period) => {
        setPeriodToUnlock(period);
        setShowUnlockModal(true);
    };
    const unlockPeriod = () => {
        router.visit(route("academic-periods.unlock", periodToUnlock.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowUnlockModal(false);
                setPeriodToUnlock(null);
            },
            onFinish: () => {
                setShowUnlockModal(false);
                setPeriodToUnlock(null);
            },
        });
    };

    const openCreateDrawer = () => {
        setEditingPeriod(null);
        setDrawerOpen(true);
    };
    const openEditDrawer = (period) => {
        setEditingPeriod(period);
        setDrawerOpen(true);
    };
    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Academic Periods
                </h2>
            }
        >
            <Head title="Academic Periods" />
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
                                    placeholder="Search by name or school year..."
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
                                    Add Period
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        School Year
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Order
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
                                {periods.data.map((period) => (
                                    <tr
                                        key={period.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {period.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {period.school_year?.name} (
                                            {period.school_year?.branch?.name})
                                        </td>
                                        <td className="px-6 py-4">
                                            {period.order}
                                        </td>
                                        <td className="px-6 py-4">
                                            {period.start_date}
                                        </td>
                                        <td className="px-6 py-4">
                                            {period.end_date}
                                        </td>
                                        <td className="px-6 py-4">
                                            {period.is_active ? (
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
                                            {period.is_locked ? (
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
                                                    openEditDrawer(period)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            {!period.is_active && (
                                                <button
                                                    onClick={() =>
                                                        confirmActivate(period)
                                                    }
                                                    className="text-green-600 hover:text-green-800 dark:text-green-400"
                                                    title="Activate"
                                                >
                                                    <HiOutlineCheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {!period.is_locked ? (
                                                <button
                                                    onClick={() =>
                                                        confirmLock(period)
                                                    }
                                                    className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                                    title="Lock"
                                                >
                                                    <HiOutlineLockClosed className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        confirmUnlock(period)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                    title="Unlock"
                                                >
                                                    <HiOutlineLockOpen className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    confirmDelete(period)
                                                }
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {periods.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No academic periods found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={periods.links} />
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingPeriod(null);
                }}
                title={
                    editingPeriod
                        ? "Edit Academic Period"
                        : "Create New Academic Period"
                }
                width="w-full max-w-2xl"
            >
                <AcademicPeriodFormDrawer
                    period={editingPeriod}
                    schoolYears={schoolYears}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingPeriod(null);
                    }}
                />
            </Drawer>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deletePeriod}
                title="Delete Period"
                message={`Are you sure you want to delete "${periodToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />

            {/* Activate Modal */}
            <Modal
                isOpen={showActivateModal}
                onClose={() => setShowActivateModal(false)}
                onConfirm={activatePeriod}
                title="Activate Period"
                message={`Activating "${periodToActivate?.name}" will deactivate any other active period for the same school year. Continue?`}
                confirmText="Activate"
                variant="info"
            />

            {/* Lock Modal */}
            <Modal
                isOpen={showLockModal}
                onClose={() => setShowLockModal(false)}
                onConfirm={lockPeriod}
                title="Lock Period"
                message={`Locking "${periodToLock?.name}" will prevent any further modifications. Continue?`}
                confirmText="Lock"
                variant="warning"
            />

            {/* Unlock Modal */}
            <Modal
                isOpen={showUnlockModal}
                onClose={() => setShowUnlockModal(false)}
                onConfirm={unlockPeriod}
                title="Unlock Period"
                message={`Unlocking "${periodToUnlock?.name}" will allow modifications again. Continue?`}
                confirmText="Unlock"
                variant="info"
            />
        </AuthenticatedLayout>
    );
}
