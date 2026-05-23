import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    HiOutlineSearch,
    HiOutlineClipboardList,
    HiOutlineX,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Drawer from "@/Components/Drawer";
import EnrollmentRequirementsManager from "@/Components/EnrollmentRequirementsManager";

export default function Requirements({ enrollments, schoolYears }) {
    const [search, setSearch] = useState("");
    const [schoolYearFilter, setSchoolYearFilter] = useState(
        route().params.school_year || "",
    );
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("enrollment-requirements.index"),
                {
                    search: search || undefined,
                    school_year: schoolYearFilter || undefined,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search, schoolYearFilter]);

    const openRequirements = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setDrawerOpen(true);
    };

    const clearSearch = () => setSearch("");

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Enrollment Requirements
                </h2>
            }
        >
            <Head title="Enrollment Requirements" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-2">
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
                                {search && (
                                    <button
                                        onClick={clearSearch}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm flex items-center gap-1"
                                    >
                                        <HiOutlineX className="w-4 h-4" /> Clear
                                    </button>
                                )}
                            </div>
                        </div>

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
                                        Requirements
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
                                            <button
                                                onClick={() =>
                                                    openRequirements(enrollment)
                                                }
                                                className="text-fg-brand hover:underline flex items-center gap-1"
                                            >
                                                <HiOutlineClipboardList className="w-5 h-5" />{" "}
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {enrollments.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
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

            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setSelectedEnrollment(null);
                }}
                title={
                    selectedEnrollment
                        ? `Requirements for ${studentFullName(selectedEnrollment.student)}`
                        : "Requirements"
                }
                width="w-full max-w-2xl"
            >
                {selectedEnrollment && (
                    <EnrollmentRequirementsManager
                        enrollment={selectedEnrollment}
                        onClose={() => {
                            setDrawerOpen(false);
                            setSelectedEnrollment(null);
                        }}
                    />
                )}
            </Drawer>
        </AuthenticatedLayout>
    );
}
