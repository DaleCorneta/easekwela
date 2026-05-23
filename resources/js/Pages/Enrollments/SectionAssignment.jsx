import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function SectionAssignment({
    schoolYears,
    gradeLevels,
    sections,
    enrollments,
    filters,
}) {
    const [schoolYearId, setSchoolYearId] = useState(
        filters.school_year_id || "",
    );
    const [gradeLevelId, setGradeLevelId] = useState(
        filters.grade_level_id || "",
    );
    const [search, setSearch] = useState("");
    const [selectedEnrollments, setSelectedEnrollments] = useState([]);
    const [sectionId, setSectionId] = useState("");

    // Debounced reload when filters change
    useEffect(() => {
        const delay = setTimeout(() => {
            if (schoolYearId && gradeLevelId) {
                router.get(
                    route("section-assignment.index"),
                    {
                        school_year_id: schoolYearId,
                        grade_level_id: gradeLevelId,
                        search: search || undefined,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);
        return () => clearTimeout(delay);
    }, [schoolYearId, gradeLevelId, search]);

    const handleBulkAssign = () => {
        if (!sectionId || selectedEnrollments.length === 0) return;
        router.post(
            route("section-assignment.bulk"),
            {
                enrollment_ids: selectedEnrollments,
                section_id: sectionId,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedEnrollments([]),
            },
        );
    };

    const clearSearch = () => setSearch("");

    // Helper to build full name from parts
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
                    Section Assignment
                </h2>
            }
        >
            <Head title="Section Assignment" />
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
                                        placeholder="Search student..."
                                        className="block w-full pl-9 pr-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 text-heading dark:text-white text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body dark:placeholder-gray-400"
                                    />
                                </div>
                                <select
                                    value={schoolYearId}
                                    onChange={(e) =>
                                        setSchoolYearId(e.target.value)
                                    }
                                    className="border border-default-medium dark:border-gray-600 bg-neutral-secondary-medium dark:bg-gray-700 text-heading dark:text-white text-sm rounded-base pl-3 pr-8 py-2"
                                >
                                    <option value="">Select School Year</option>
                                    {schoolYears.map((sy) => (
                                        <option key={sy.id} value={sy.id}>
                                            {sy.name} - {sy.branch?.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={gradeLevelId}
                                    onChange={(e) =>
                                        setGradeLevelId(e.target.value)
                                    }
                                    className="border border-default-medium dark:border-gray-600 bg-neutral-secondary-medium dark:bg-gray-700 text-heading dark:text-white text-sm rounded-base pl-3 pr-8 py-2"
                                >
                                    <option value="">Select Grade Level</option>
                                    {gradeLevels.map((gl) => (
                                        <option key={gl.id} value={gl.id}>
                                            {gl.name}
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

                        {/* Table with checkboxes */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                setSelectedEnrollments(
                                                    e.target.checked
                                                        ? enrollments.map(
                                                              (e) => e.id,
                                                          )
                                                        : [],
                                                );
                                            }}
                                            checked={
                                                selectedEnrollments.length ===
                                                    enrollments.length &&
                                                enrollments.length > 0
                                            }
                                        />
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Grade Level
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Current Section
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((enrollment) => (
                                    <tr
                                        key={enrollment.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedEnrollments.includes(
                                                    enrollment.id,
                                                )}
                                                onChange={(e) => {
                                                    if (e.target.checked)
                                                        setSelectedEnrollments([
                                                            ...selectedEnrollments,
                                                            enrollment.id,
                                                        ]);
                                                    else
                                                        setSelectedEnrollments(
                                                            selectedEnrollments.filter(
                                                                (id) =>
                                                                    id !==
                                                                    enrollment.id,
                                                            ),
                                                        );
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {studentFullName(
                                                enrollment.student,
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {enrollment.grade_level?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {enrollment.section?.name || "—"}
                                        </td>
                                    </tr>
                                ))}
                                {enrollments.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No unassigned enrollments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Assignment controls */}
                        <div className="p-4 flex flex-wrap items-center gap-4 border-t border-default dark:border-gray-600">
                            <select
                                value={sectionId}
                                onChange={(e) => setSectionId(e.target.value)}
                                className="border border-default-medium dark:border-gray-600 bg-neutral-secondary-medium dark:bg-gray-700 text-heading dark:text-white text-sm rounded-base pl-3 pr-8 py-2"
                            >
                                <option value="">Select Section</option>
                                {sections.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleBulkAssign}
                                disabled={
                                    !sectionId ||
                                    selectedEnrollments.length === 0
                                }
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition shadow-sm"
                            >
                                Assign Selected
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
