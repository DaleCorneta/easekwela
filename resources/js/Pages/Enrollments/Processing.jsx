import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineX } from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Drawer from "@/Components/Drawer";
import EnrollmentFormDrawer from "@/Components/EnrollmentFormDrawer";

export default function Processing({
    enrollments,
    students,
    schoolYears,
    gradeLevels,
    strands,
    sections,
}) {
    const [search, setSearch] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("enrollments.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Enrollment Processing
                </h2>
            }
        >
            <Head title="Enrollment Processing" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        <div className="p-4 flex items-center justify-between">
                            <div className="relative w-full max-w-96">
                                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-body dark:text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="..."
                                />
                            </div>
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                                <HiOutlinePlus className="w-5 h-5" /> Add
                                Enrollment
                            </button>
                        </div>
                        {/* Table of recent enrollments (you can reuse the same columns as Records) */}
                        <table className="w-full text-sm ...">
                            {/* ... similar to Records but maybe smaller */}
                        </table>
                        <Pagination links={enrollments.links} />
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="New Enrollment"
                width="w-full max-w-2xl"
            >
                <EnrollmentFormDrawer
                    students={students}
                    schoolYears={schoolYears}
                    gradeLevels={gradeLevels}
                    strands={strands}
                    sections={sections}
                    onClose={() => setDrawerOpen(false)}
                />
            </Drawer>
        </AuthenticatedLayout>
    );
}
