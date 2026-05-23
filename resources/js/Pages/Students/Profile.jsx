import { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import {
    HiOutlineArrowLeft,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineStar,
    HiOutlineUpload,
    HiOutlineCheck,
    HiOutlineRefresh,
    HiOutlineDownload,
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Drawer from "@/Components/Drawer";
import Modal from "@/Components/Modal";
import GuardianFormDrawer from "@/Components/GuardianFormDrawer";
import DocumentFormDrawer from "@/Components/DocumentFormDrawer";
import StatusUpdateDrawer from "@/Components/StatusUpdateDrawer";
import StudentFormDrawer from "@/Components/StudentFormDrawer";

export default function Profile({ student, branches }) {
    // Guardian management
    const [showGuardianDrawer, setShowGuardianDrawer] = useState(false);
    const [editingGuardian, setEditingGuardian] = useState(null);
    const [deleteGuardian, setDeleteGuardian] = useState(null);

    // Document management
    const [showDocumentDrawer, setShowDocumentDrawer] = useState(false);
    const [editingDocument, setEditingDocument] = useState(null);
    const [deleteDocument, setDeleteDocument] = useState(null);

    // Status update
    const [showStatusDrawer, setShowStatusDrawer] = useState(false);
    const [showEditStudentDrawer, setShowEditStudentDrawer] = useState(false);

    // ----------------------------------------------------------------
    // Guardian actions
    // ----------------------------------------------------------------
    const openCreateGuardian = () => {
        setEditingGuardian(null);
        setShowGuardianDrawer(true);
    };

    const openEditGuardian = (guardian) => {
        setEditingGuardian(guardian);
        setShowGuardianDrawer(true);
    };

    const confirmDeleteGuardian = (guardian) => setDeleteGuardian(guardian);

    const handleDeleteGuardian = () => {
        if (deleteGuardian) {
            router.delete(
                route("students.guardians.destroy", {
                    student: student.id,
                    guardian: deleteGuardian.id,
                }),
                {
                    onSuccess: () => setDeleteGuardian(null),
                    onFinish: () => setDeleteGuardian(null),
                },
            );
        }
    };

    const setPrimary = (guardian) => {
        router.put(
            route("students.guardians.update", {
                student: student.id,
                guardian: guardian.id,
            }),
            {
                relationship: guardian.relationship,
                full_name: guardian.full_name,
                mobile_number: guardian.mobile_number,
                telephone_number: guardian.telephone_number,
                email: guardian.email,
                occupation: guardian.occupation,
                address: guardian.address,
                is_primary_contact: true,
                is_emergency_contact: guardian.is_emergency_contact,
                remarks: guardian.remarks,
            },
            { preserveScroll: true },
        );
    };

    // ----------------------------------------------------------------
    // Document actions
    // ----------------------------------------------------------------
    const openCreateDocument = () => {
        setEditingDocument(null);
        setShowDocumentDrawer(true);
    };

    const openEditDocument = (doc) => {
        setEditingDocument(doc);
        setShowDocumentDrawer(true);
    };

    const confirmDeleteDocument = (doc) => setDeleteDocument(doc);

    const handleDeleteDocument = () => {
        if (deleteDocument) {
            router.delete(
                route("students.documents.destroy", {
                    student: student.id,
                    document: deleteDocument.id,
                }),
                {
                    onSuccess: () => setDeleteDocument(null),
                    onFinish: () => setDeleteDocument(null),
                },
            );
        }
    };

    const verifyDocument = (doc) => {
        router.post(
            route("students.documents.verify", {
                student: student.id,
                document: doc.id,
            }),
            {},
            { preserveScroll: true },
        );
    };

    // ----------------------------------------------------------------
    // Status actions
    // ----------------------------------------------------------------
    const openStatusUpdate = () => setShowStatusDrawer(true);

    // ----------------------------------------------------------------
    // Main render
    // ----------------------------------------------------------------
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Student Profile: {student.full_name}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowEditStudentDrawer(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-sm text-sm"
                        >
                            <HiOutlinePencil className="w-5 h-5" /> Edit Student
                        </button>
                        <a
                            href={route("students.index")}
                            className="flex items-center gap-2 text-sm text-fg-brand hover:underline"
                        >
                            <HiOutlineArrowLeft className="w-4 h-4" /> Back to
                            Directory
                        </a>
                    </div>
                </div>
            }
        >
            <Head title={`Profile - ${student.full_name}`} />

            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Top action bar */}
                    <div className="flex items-center justify-between mb-6">
                        <a
                            href={route("students.index")}
                            className="flex items-center gap-2 text-sm text-fg-brand hover:underline"
                        >
                            <HiOutlineArrowLeft className="w-4 h-4" /> Back to
                            Directory
                        </a>
                        <button
                            onClick={() => setShowEditStudentDrawer(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-sm text-sm"
                        >
                            <HiOutlinePencil className="w-5 h-5" /> Edit Student
                        </button>
                    </div>

                    {/* Existing profile card */}
                    <div className="bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700 p-6 space-y-8">
                        {/* Status & Branch */}
                        <div className="flex items-center gap-4">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    student.status === "active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                            >
                                {student.status?.toUpperCase()}
                            </span>
                            <span className="text-body dark:text-gray-400 text-sm">
                                Branch: {student.branch?.name}
                            </span>
                        </div>

                        {/* Personal Information */}
                        <section>
                            <h3 className="text-lg font-medium text-heading dark:text-white mb-4 border-b border-default dark:border-gray-700 pb-2">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        LRN:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.lrn || "—"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        Full Name:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.last_name},{" "}
                                        {student.first_name}{" "}
                                        {student.middle_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        Birth Date:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.birth_date ?? "—"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        Gender:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.gender || "—"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        Civil Status:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.civil_status || "—"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        Nationality:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.nationality || "—"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        Religion:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.religion || "—"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        Address:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.address || "—"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        Mobile:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.mobile_number || "—"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-body dark:text-gray-400">
                                        Email:
                                    </span>{" "}
                                    <span className="text-heading dark:text-white">
                                        {student.email || "—"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4">
                                <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${student.is_4ps_beneficiary ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}
                                >
                                    4Ps:{" "}
                                    {student.is_4ps_beneficiary ? "Yes" : "No"}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${student.is_indigenous ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}
                                >
                                    Indigenous:{" "}
                                    {student.is_indigenous ? "Yes" : "No"}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${student.has_disability ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}
                                >
                                    Disability:{" "}
                                    {student.has_disability ? "Yes" : "No"}
                                </span>
                            </div>
                            {student.remarks && (
                                <div className="mt-3">
                                    <span className="text-body dark:text-gray-400">
                                        Remarks:
                                    </span>
                                    <p className="text-heading dark:text-white mt-1">
                                        {student.remarks}
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Guardians */}
                        <section>
                            <div className="flex items-center justify-between mb-4 border-b border-default dark:border-gray-700 pb-2">
                                <h3 className="text-lg font-medium text-heading dark:text-white">
                                    Guardians
                                </h3>
                                <button
                                    onClick={openCreateGuardian}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded-base hover:bg-primary-dark"
                                >
                                    <HiOutlinePlus className="w-4 h-4" /> Add
                                </button>
                            </div>

                            {student.guardians?.length > 0 ? (
                                <ul className="space-y-3">
                                    {student.guardians.map((guardian) => (
                                        <li
                                            key={guardian.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-neutral-secondary-medium dark:bg-gray-700 rounded-base"
                                        >
                                            <div className="flex-1 text-sm">
                                                <div className="flex flex-wrap gap-x-3 items-center">
                                                    <span className="font-medium text-heading dark:text-white">
                                                        {guardian.full_name}
                                                    </span>
                                                    <span className="text-body dark:text-gray-400">
                                                        {guardian.relationship}
                                                    </span>
                                                    {guardian.is_primary_contact && (
                                                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">
                                                            Primary
                                                        </span>
                                                    )}
                                                    {guardian.is_emergency_contact && (
                                                        <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-1.5 py-0.5 rounded">
                                                            Emergency
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-body dark:text-gray-400 text-xs mt-1">
                                                    {guardian.mobile_number && (
                                                        <span>
                                                            {
                                                                guardian.mobile_number
                                                            }{" "}
                                                            ·{" "}
                                                        </span>
                                                    )}
                                                    {guardian.email && (
                                                        <span>
                                                            {guardian.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!guardian.is_primary_contact && (
                                                    <button
                                                        onClick={() =>
                                                            setPrimary(guardian)
                                                        }
                                                        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                                        title="Set as primary contact"
                                                    >
                                                        <HiOutlineStar className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        openEditGuardian(
                                                            guardian,
                                                        )
                                                    }
                                                    className="text-fg-brand hover:underline"
                                                    title="Edit"
                                                >
                                                    <HiOutlinePencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        confirmDeleteGuardian(
                                                            guardian,
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                    title="Delete"
                                                >
                                                    <HiOutlineTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-body dark:text-gray-400 italic">
                                    No guardians added yet.
                                </p>
                            )}
                        </section>

                        {/* Documents */}
                        <section>
                            <div className="flex items-center justify-between mb-4 border-b border-default dark:border-gray-700 pb-2">
                                <h3 className="text-lg font-medium text-heading dark:text-white">
                                    Documents
                                </h3>
                                <button
                                    onClick={openCreateDocument}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded-base hover:bg-primary-dark"
                                >
                                    <HiOutlineUpload className="w-4 h-4" />{" "}
                                    Upload
                                </button>
                            </div>

                            {student.documents?.length > 0 ? (
                                <ul className="space-y-2 text-sm">
                                    {student.documents.map((doc) => (
                                        <li
                                            key={doc.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-neutral-secondary-medium dark:bg-gray-700 rounded-base"
                                        >
                                            <div className="flex-1">
                                                <div className="flex flex-wrap gap-x-3 items-center">
                                                    <span className="font-medium text-heading dark:text-white">
                                                        {doc.document_type}
                                                    </span>
                                                    <span className="text-body dark:text-gray-400 text-xs">
                                                        {doc.original_file_name}
                                                    </span>
                                                    {doc.is_verified ? (
                                                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-1.5 py-0.5 rounded">
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                                {doc.remarks && (
                                                    <p className="text-body dark:text-gray-400 text-xs mt-1">
                                                        {doc.remarks}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`/storage/${doc.file_path}`}
                                                    download={
                                                        doc.original_file_name
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                    title="Download"
                                                >
                                                    <HiOutlineDownload className="w-5 h-5" />
                                                </a>
                                                {!doc.is_verified && (
                                                    <button
                                                        onClick={() =>
                                                            verifyDocument(doc)
                                                        }
                                                        className="text-green-600 hover:text-green-800 dark:text-green-400"
                                                        title="Verify"
                                                    >
                                                        <HiOutlineCheck className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        openEditDocument(doc)
                                                    }
                                                    className="text-fg-brand hover:underline"
                                                    title="Edit"
                                                >
                                                    <HiOutlinePencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        confirmDeleteDocument(
                                                            doc,
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                    title="Delete"
                                                >
                                                    <HiOutlineTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-body dark:text-gray-400 italic">
                                    No documents uploaded.
                                </p>
                            )}
                        </section>

                        {/* Status History */}
                        <section>
                            <div className="flex items-center justify-between mb-4 border-b border-default dark:border-gray-700 pb-2">
                                <h3 className="text-lg font-medium text-heading dark:text-white">
                                    Learner Status Tracking
                                </h3>
                                <button
                                    onClick={openStatusUpdate}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded-base hover:bg-primary-dark"
                                >
                                    <HiOutlineRefresh className="w-4 h-4" />{" "}
                                    Update Status
                                </button>
                            </div>
                            {student.status_histories?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-body dark:text-gray-300">
                                        <thead className="bg-neutral-secondary-medium dark:bg-gray-700">
                                            <tr>
                                                <th className="px-4 py-2">
                                                    Status
                                                </th>
                                                <th className="px-4 py-2">
                                                    Effective Date
                                                </th>
                                                <th className="px-4 py-2">
                                                    Updated By
                                                </th>
                                                <th className="px-4 py-2">
                                                    Remarks
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {student.status_histories.map(
                                                (h) => (
                                                    <tr
                                                        key={h.id}
                                                        className="border-b border-default dark:border-gray-700"
                                                    >
                                                        <td className="px-4 py-2">
                                                            {h.status}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {h.effective_date}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {h.updated_by
                                                                ?.full_name ??
                                                                "System"}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {h.remarks || "—"}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-body dark:text-gray-400 italic">
                                    No status changes recorded.
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* Guardian Drawer */}
            <Drawer
                isOpen={showGuardianDrawer}
                onClose={() => {
                    setShowGuardianDrawer(false);
                    setEditingGuardian(null);
                }}
                title={editingGuardian ? "Edit Guardian" : "Add Guardian"}
                width="w-full max-w-2xl"
            >
                <GuardianFormDrawer
                    student={student}
                    guardian={editingGuardian}
                    onClose={() => {
                        setShowGuardianDrawer(false);
                        setEditingGuardian(null);
                    }}
                />
            </Drawer>

            {/* Delete Guardian Modal */}
            <Modal
                isOpen={!!deleteGuardian}
                onClose={() => setDeleteGuardian(null)}
                onConfirm={handleDeleteGuardian}
                title="Remove Guardian"
                message={`Are you sure you want to remove "${deleteGuardian?.full_name}"?`}
                confirmText="Remove"
                variant="danger"
            />

            {/* Document Drawer */}
            <Drawer
                isOpen={showDocumentDrawer}
                onClose={() => {
                    setShowDocumentDrawer(false);
                    setEditingDocument(null);
                }}
                title={editingDocument ? "Edit Document" : "Upload Document"}
                width="w-full max-w-2xl"
            >
                <DocumentFormDrawer
                    student={student}
                    document={editingDocument}
                    onClose={() => {
                        setShowDocumentDrawer(false);
                        setEditingDocument(null);
                    }}
                />
            </Drawer>

            {/* Delete Document Modal */}
            <Modal
                isOpen={!!deleteDocument}
                onClose={() => setDeleteDocument(null)}
                onConfirm={handleDeleteDocument}
                title="Delete Document"
                message={`Are you sure you want to delete "${deleteDocument?.document_type}"?`}
                confirmText="Delete"
                variant="danger"
            />

            {/* Status Update Drawer */}
            <Drawer
                isOpen={showStatusDrawer}
                onClose={() => setShowStatusDrawer(false)}
                title="Update Learner Status"
                width="w-full max-w-2xl"
            >
                <StatusUpdateDrawer
                    student={student}
                    onClose={() => setShowStatusDrawer(false)}
                />
            </Drawer>

            {/* Edit Student Drawer */}
            <Drawer
                isOpen={showEditStudentDrawer}
                onClose={() => setShowEditStudentDrawer(false)}
                title="Edit Student Information"
                width="w-full max-w-2xl"
            >
                <StudentFormDrawer
                    student={student}
                    branches={branches}
                    updateRoute={route("students.profile.update", student.id)}
                    onClose={() => setShowEditStudentDrawer(false)}
                />
            </Drawer>
        </AuthenticatedLayout>
    );
}
