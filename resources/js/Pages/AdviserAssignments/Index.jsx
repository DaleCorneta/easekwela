import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { HiOutlineSearch, HiOutlineX, HiOutlineEye } from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";

export default function Index({ assignments }) {
    const [search, setSearch] = useState("");

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("adviser-assignments.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Adviser Assignments
                </h2>
            }
        >
            <Head title="Adviser Assignments" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        {/* Search */}
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="relative w-full max-w-96">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiOutlineSearch className="w-4 h-4 text-body dark:text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by section or teacher..."
                                    className="block w-full pl-9 pr-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 text-heading dark:text-white text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body dark:placeholder-gray-400"
                                />
                            </div>
                            {search && (
                                <button
                                    onClick={clearSearch}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm flex items-center gap-1"
                                >
                                    <HiOutlineX className="w-4 h-4" /> Clear
                                </button>
                            )}
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        Section
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Teacher
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Assigned
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Unassigned
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Active
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Remarks
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.data.map((assignment) => (
                                    <tr
                                        key={assignment.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {assignment.section?.name} (
                                            {assignment.section?.code})
                                        </td>
                                        <td className="px-6 py-4">
                                            {assignment.user?.first_name}{" "}
                                            {assignment.user?.last_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {assignment.assigned_at}
                                        </td>
                                        <td className="px-6 py-4">
                                            {assignment.unassigned_at ?? "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {assignment.is_active ? (
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
                                            {assignment.remarks || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    (window.location.href =
                                                        route(
                                                            "sections.index",
                                                            {
                                                                search: assignment
                                                                    .section
                                                                    ?.code,
                                                            },
                                                        ))
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="View Section"
                                            >
                                                <HiOutlineEye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {assignments.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No adviser assignments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={assignments.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
