import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

export default function History({ enrollments, schoolYears, statuses }) {
    const [search, setSearch] = useState("");
    const [schoolYearFilter, setSchoolYearFilter] = useState(
        route().params.school_year || "",
    );
    const [statusFilter, setStatusFilter] = useState(
        route().params.status || "",
    );

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("enrollment-history.index"),
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

    const clearSearch = () => setSearch("");
    const clearFilters = () => {
        setSearch("");
        setSchoolYearFilter("");
        setStatusFilter("");
    };

    const studentFullName = (student) => {
        if (!student) return "—";
        return [
            student.first_name,
            student.middle_name,
            student.last_name,
            student.suffix,
        ]
            .filter(Boolean)
            .join(" ");
    };

    const hasActiveFilters = search || schoolYearFilter || statusFilter;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Enrollment History
                </h2>
            }
        >
            <Head title="Enrollment History" />
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
                                        placeholder="Search by student..."
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
                                    {schoolYears.map((sy) => (
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
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm flex items-center gap-1"
                                >
                                    <HiOutlineX className="w-4 h-4" /> Clear All
                                </button>
                            )}
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
                                        Date
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
                                            {studentFullName(
                                                enrollment.student,
                                            )}
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
                                            {enrollment.enrollment_date || "—"}
                                        </td>
                                    </tr>
                                ))}
                                {enrollments.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No enrollment history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={enrollments.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
