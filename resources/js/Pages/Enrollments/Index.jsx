import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineX,
    HiOutlineCheck,
    HiOutlineXCircle,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";
import Drawer from "@/Components/Drawer";
import EnrollmentFormDrawer from "@/Components/EnrollmentFormDrawer";

export default function Index({
    enrollments,
    schoolYears,
    statuses,
    students,
    gradeLevels,
    strands,
    sections,
}) {
    const [search, setSearch] = useState("");
    const [schoolYearFilter, setSchoolYearFilter] = useState(
        route().params.school_year || "",
    );
    const [statusFilter, setStatusFilter] = useState(
        route().params.status || "",
    );

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingEnrollment, setEditingEnrollment] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("enrollments.index"),
                {
                    search: search || undefined,
                    school_year: schoolYearFilter || undefined,
                    status: statusFilter || undefined,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search, schoolYearFilter, statusFilter]);

    const confirmDelete = (enrollment) => {
        setDeleteTarget(enrollment);
        setShowDeleteModal(true);
    };
    const handleDelete = () => {
        router.delete(route("enrollments.destroy", deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteTarget(null);
            },
            onFinish: () => {
                setShowDeleteModal(false);
                setDeleteTarget(null);
            },
        });
    };

    const openEdit = (enrollment) => {
        setEditingEnrollment(enrollment);
        setDrawerOpen(true);
    };
    const openCreate = () => {
        setEditingEnrollment(null);
        setDrawerOpen(true);
    };

    const approveEnrollment = (enrollment) => {
        router.post(
            route("enrollments.approve", enrollment.id),
            {},
            { preserveScroll: true },
        );
    };
    const rejectEnrollment = (enrollment) => {
        router.post(
            route("enrollments.reject", enrollment.id),
            {},
            { preserveScroll: true },
        );
    };

    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Enrollment Processing / Records
                </h2>
            }
        >
            <Head title="Enrollment Processing" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        {/* Filters */}
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                                <div className="relative w-full sm:w-56">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <HiOutlineSearch className="w-4 h-4 text-body dark:text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search by student name..."
                                        className="block w-full pl-9 pr-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 text-heading dark:text-white text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body dark:placeholder-gray-400"
                                    />
                                </div>
                                <select
                                    value={schoolYearFilter}
                                    onChange={(e) =>
                                        setSchoolYearFilter(e.target.value)
                                    }
                                    className="border border-default-medium dark:border-gray-600 bg-neutral-secondary-medium dark:bg-gray-700 text-heading dark:text-white text-sm rounded-base pl-3 pr-8 py-2"
                                >
                                    <option value="">All School Years</option>
                                    {schoolYears
                                        .filter((sy) => !sy.is_locked)
                                        .map((sy) => (
                                            <option key={sy.id} value={sy.id}>
                                                {sy.name} - {sy.branch?.name}
                                            </option>
                                        ))}
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="border border-default-medium dark:border-gray-600 bg-neutral-secondary-medium dark:bg-gray-700 text-heading dark:text-white text-sm rounded-base pl-3 pr-8 py-2"
                                >
                                    <option value="">All Statuses</option>
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                {search && (
                                    <button
                                        onClick={clearSearch}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm flex items-center gap-1"
                                    >
                                        <HiOutlineX className="w-4 h-4" /> Clear
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-sm"
                            >
                                <HiOutlinePlus className="w-5 h-5" /> Add
                                Enrollment
                            </button>
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        School Year
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Grade Level
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Section
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.data.map((enrollment) => (
                                    <tr
                                        key={enrollment.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {enrollment.student?.first_name}{" "}
                                            {enrollment.student?.middle_name}
                                            {enrollment.student?.last_name}{" "}
                                            {enrollment.student?.suffix}{" "}
                                        </td>
                                        <td className="px-6 py-4">
                                            {enrollment.school_year?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {enrollment.grade_level?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {enrollment.section?.name || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    enrollment.status ===
                                                    "approved"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                        : enrollment.status ===
                                                            "rejected"
                                                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                }`}
                                            >
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {enrollment.enrollment_type}
                                        </td>
                                        <td className="px-6 py-4 flex flex-wrap gap-2">
                                            <button
                                                onClick={() =>
                                                    openEdit(enrollment)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            {enrollment.status ===
                                                "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            approveEnrollment(
                                                                enrollment,
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-800 dark:text-green-400"
                                                        title="Approve"
                                                    >
                                                        <HiOutlineCheck className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            rejectEnrollment(
                                                                enrollment,
                                                            )
                                                        }
                                                        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                                        title="Reject"
                                                    >
                                                        <HiOutlineXCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() =>
                                                    confirmDelete(enrollment)
                                                }
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {enrollments.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No enrollments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={enrollments.links} />
                    </div>
                </div>
            </div>

            {/* Drawer for Create/Edit */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingEnrollment(null);
                }}
                title={editingEnrollment ? "Edit Enrollment" : "New Enrollment"}
                width="w-full max-w-2xl"
            >
                <EnrollmentFormDrawer
                    enrollment={editingEnrollment}
                    students={students}
                    schoolYears={schoolYears}
                    gradeLevels={gradeLevels}
                    strands={strands}
                    sections={sections}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingEnrollment(null);
                    }}
                />
            </Drawer>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Enrollment"
                message={`Are you sure you want to delete the enrollment for "${deleteTarget?.student?.full_name}"?`}
                confirmText="Delete"
                variant="danger"
            />
        </AuthenticatedLayout>
    );
}
