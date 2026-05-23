import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineBan,
    HiOutlinePlus,
    HiOutlineX,
    HiOutlineEye,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";
import Drawer from "@/Components/Drawer";
import StudentFormDrawer from "@/Components/StudentFormDrawer";

export default function Index({ students, branches, statuses, genders }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(
        route().params.status || "",
    );
    const [genderFilter, setGenderFilter] = useState(
        route().params.gender || "",
    );
    const [branchFilter, setBranchFilter] = useState(
        route().params.branch || "",
    );

    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [studentToDeactivate, setStudentToDeactivate] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("students.index"),
                {
                    search: search || undefined,
                    status: statusFilter || undefined,
                    gender: genderFilter || undefined,
                    branch: branchFilter || undefined,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search, statusFilter, genderFilter, branchFilter]);

    const confirmDeactivate = (student) => {
        setStudentToDeactivate(student);
        setShowDeactivateModal(true);
    };

    const deactivateStudent = () => {
        router.visit(route("students.destroy", studentToDeactivate.id), {
            method: "delete",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeactivateModal(false);
                setStudentToDeactivate(null);
            },
            onFinish: () => {
                setShowDeactivateModal(false);
                setStudentToDeactivate(null);
            },
        });
    };

    const openCreateDrawer = () => {
        setEditingStudent(null);
        setDrawerOpen(true);
    };

    const openEditDrawer = (student) => {
        setEditingStudent(student);
        setDrawerOpen(true);
    };

    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Student Directory
                </h2>
            }
        >
            <Head title="Student Directory" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        {/* Filters & Add Button */}
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                                        placeholder="Search name, LRN..."
                                        className="block w-full pl-9 pr-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 text-heading dark:text-white text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body dark:placeholder-gray-400"
                                    />
                                </div>
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
                                            {s.charAt(0).toUpperCase() +
                                                s.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={genderFilter}
                                    onChange={(e) =>
                                        setGenderFilter(e.target.value)
                                    }
                                    className="border border-default-medium dark:border-gray-600 bg-neutral-secondary-medium dark:bg-gray-700 text-heading dark:text-white text-sm rounded-base pl-3 pr-8 py-2"
                                >
                                    <option value="">All Genders</option>
                                    {genders.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={branchFilter}
                                    onChange={(e) =>
                                        setBranchFilter(e.target.value)
                                    }
                                    className="border border-default-medium dark:border-gray-600 bg-neutral-secondary-medium dark:bg-gray-700 text-heading dark:text-white text-sm rounded-base pl-3 pr-8 py-2"
                                >
                                    <option value="">All Branches</option>
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
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
                                onClick={openCreateDrawer}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-sm"
                            >
                                <HiOutlinePlus className="w-5 h-5" /> Add
                                Student
                            </button>
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        LRN
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Gender
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Branch
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Created At
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {student.lrn || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.last_name},{" "}
                                            {student.first_name}{" "}
                                            {student.middle_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.gender || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    student.status === "active"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                        : student.status ===
                                                            "inactive"
                                                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.branch?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(
                                                student.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 flex flex-wrap gap-2">
                                            <button
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            "students.profile",
                                                            student.id,
                                                        ),
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                title="View Profile"
                                            >
                                                <HiOutlineEye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openEditDrawer(student)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            {student.status !== "inactive" && (
                                                <button
                                                    onClick={() =>
                                                        confirmDeactivate(
                                                            student,
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                    title="Deactivate"
                                                >
                                                    <HiOutlineBan className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {students.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={students.links} />
                    </div>
                </div>
            </div>

            {/* Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingStudent(null);
                }}
                title={editingStudent ? "Edit Student" : "Create New Student"}
                width="w-full max-w-2xl"
            >
                <StudentFormDrawer
                    student={editingStudent}
                    branches={branches}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingStudent(null);
                    }}
                />
            </Drawer>

            {/* Deactivate Modal */}
            <Modal
                isOpen={showDeactivateModal}
                onClose={() => setShowDeactivateModal(false)}
                onConfirm={deactivateStudent}
                title="Deactivate Student"
                message={`Are you sure you want to deactivate "${studentToDeactivate?.full_name}"? Their status will become inactive.`}
                confirmText="Deactivate"
                variant="danger"
            />
        </AuthenticatedLayout>
    );
}
