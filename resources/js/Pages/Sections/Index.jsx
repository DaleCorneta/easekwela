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
    HiOutlineUserAdd,
    HiOutlineUserRemove,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";
import Drawer from "@/Components/Drawer";
import SectionFormDrawer from "@/Components/SectionFormDrawer";

export default function Index({
    sections,
    branches,
    schoolYears,
    gradeLevels,
    strands,
    teachers,
}) {
    const [search, setSearch] = useState("");
    const [branchFilter, setBranchFilter] = useState(
        route().params.branch || "",
    );
    const [schoolYearFilter, setSchoolYearFilter] = useState(
        route().params.school_year || "",
    );
    const [gradeLevelFilter, setGradeLevelFilter] = useState(
        route().params.grade_level || "",
    );

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [sectionToActivate, setSectionToActivate] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [sectionToDeactivate, setSectionToDeactivate] = useState(null);
    const [showAdviserModal, setShowAdviserModal] = useState(false);
    const [sectionForAdviser, setSectionForAdviser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("sections.index"),
                {
                    search: search || undefined,
                    branch: branchFilter || undefined,
                    school_year: schoolYearFilter || undefined,
                    grade_level: gradeLevelFilter || undefined,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search, branchFilter, schoolYearFilter, gradeLevelFilter]);

    const confirmDelete = (section) => {
        setSectionToDelete(section);
        setShowDeleteModal(true);
    };
    const deleteSection = () => {
        router.visit(route("sections.destroy", sectionToDelete.id), {
            method: "delete",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSectionToDelete(null);
            },
            onFinish: () => {
                setShowDeleteModal(false);
                setSectionToDelete(null);
            },
        });
    };

    const confirmActivate = (section) => {
        setSectionToActivate(section);
        setShowActivateModal(true);
    };
    const activateSection = () => {
        router.visit(route("sections.activate", sectionToActivate.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setSectionToActivate(null);
            },
            onFinish: () => {
                setShowActivateModal(false);
                setSectionToActivate(null);
            },
        });
    };

    const confirmDeactivate = (section) => {
        setSectionToDeactivate(section);
        setShowDeactivateModal(true);
    };
    const deactivateSection = () => {
        router.visit(route("sections.deactivate", sectionToDeactivate.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeactivateModal(false);
                setSectionToDeactivate(null);
            },
            onFinish: () => {
                setShowDeactivateModal(false);
                setSectionToDeactivate(null);
            },
        });
    };

    const openCreateDrawer = () => {
        setEditingSection(null);
        setDrawerOpen(true);
    };
    const openEditDrawer = (section) => {
        setEditingSection(section);
        setDrawerOpen(true);
    };

    const openAdviserModal = (section) => {
        setSectionForAdviser(section);
        setShowAdviserModal(true);
    };
    const confirmAdviserAssignment = (userId) => {
        // This will be handled by a dedicated adviser assignment page or modal with select
        // For simplicity, we'll implement a quick assign inside the drawer or a separate modal later.
    };

    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Sections
                </h2>
            }
        >
            <Head title="Sections" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        {/* Filters */}
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
                                        placeholder="Search..."
                                        className="block w-full pl-9 pr-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 text-heading dark:text-white text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                    />
                                </div>
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
                                    value={gradeLevelFilter}
                                    onChange={(e) =>
                                        setGradeLevelFilter(e.target.value)
                                    }
                                    className="border border-default-medium dark:border-gray-600 bg-neutral-secondary-medium dark:bg-gray-700 text-heading dark:text-white text-sm rounded-base pl-3 pr-8 py-2"
                                >
                                    <option value="">All Grade Levels</option>
                                    {gradeLevels.map((gl) => (
                                        <option key={gl.id} value={gl.id}>
                                            {gl.name}
                                        </option>
                                    ))}
                                </select>
                                {search && (
                                    <button
                                        onClick={clearSearch}
                                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
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
                                Section
                            </button>
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Branch
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        School Year
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Grade Level
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Strand
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Adviser
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
                                {sections.data.map((section) => (
                                    <tr
                                        key={section.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {section.code}
                                        </td>
                                        <td className="px-6 py-4">
                                            {section.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {section.branch?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {section.school_year?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {section.grade_level?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {section.strand?.name || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {section.adviser ? (
                                                <span>
                                                    {section.adviser.first_name}{" "}
                                                    {section.adviser.last_name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Not assigned
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {section.is_active ? (
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
                                                    openEditDrawer(section)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            {!section.is_active ? (
                                                <button
                                                    onClick={() =>
                                                        confirmActivate(section)
                                                    }
                                                    className="text-green-600 hover:text-green-800 dark:text-green-400"
                                                    title="Activate"
                                                >
                                                    <HiOutlineCheckCircle className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        confirmDeactivate(
                                                            section,
                                                        )
                                                    }
                                                    className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                                    title="Deactivate"
                                                >
                                                    <HiOutlineXCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    openAdviserModal(section)
                                                }
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                title="Assign Adviser"
                                            >
                                                <HiOutlineUserAdd className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    confirmDelete(section)
                                                }
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {sections.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No sections found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={sections.links} />
                    </div>
                </div>
            </div>

            {/* Drawer */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingSection(null);
                }}
                title={editingSection ? "Edit Section" : "Create New Section"}
                width="w-full max-w-2xl"
            >
                <SectionFormDrawer
                    section={editingSection}
                    branches={branches}
                    schoolYears={schoolYears}
                    gradeLevels={gradeLevels}
                    strands={strands}
                    teachers={teachers}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingSection(null);
                    }}
                />
            </Drawer>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteSection}
                title="Delete Section"
                message={`Delete "${sectionToDelete?.name}"?`}
                confirmText="Delete"
                variant="danger"
            />
            <Modal
                isOpen={showActivateModal}
                onClose={() => setShowActivateModal(false)}
                onConfirm={activateSection}
                title="Activate Section"
                confirmText="Activate"
                variant="info"
            />
            <Modal
                isOpen={showDeactivateModal}
                onClose={() => setShowDeactivateModal(false)}
                onConfirm={deactivateSection}
                title="Deactivate Section"
                confirmText="Deactivate"
                variant="warning"
            />
            {/* Adviser modal could be a separate component */}
        </AuthenticatedLayout>
    );
}
