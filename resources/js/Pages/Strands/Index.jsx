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
} from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";
import Drawer from "@/Components/Drawer";
import StrandFormDrawer from "@/Components/StrandFormDrawer";

export default function Index({ strands, branches, tracks }) {
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [strandToDelete, setStrandToDelete] = useState(null);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [strandToActivate, setStrandToActivate] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [strandToDeactivate, setStrandToDeactivate] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingStrand, setEditingStrand] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("strands.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const confirmDelete = (strand) => {
        setStrandToDelete(strand);
        setShowDeleteModal(true);
    };
    const deleteStrand = () => {
        router.visit(route("strands.destroy", strandToDelete.id), {
            method: "delete",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setStrandToDelete(null);
            },
            onFinish: () => {
                setShowDeleteModal(false);
                setStrandToDelete(null);
            },
        });
    };

    const confirmActivate = (strand) => {
        setStrandToActivate(strand);
        setShowActivateModal(true);
    };
    const activateStrand = () => {
        router.visit(route("strands.activate", strandToActivate.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setStrandToActivate(null);
            },
            onFinish: () => {
                setShowActivateModal(false);
                setStrandToActivate(null);
            },
        });
    };

    const confirmDeactivate = (strand) => {
        setStrandToDeactivate(strand);
        setShowDeactivateModal(true);
    };
    const deactivateStrand = () => {
        router.visit(route("strands.deactivate", strandToDeactivate.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeactivateModal(false);
                setStrandToDeactivate(null);
            },
            onFinish: () => {
                setShowDeactivateModal(false);
                setStrandToDeactivate(null);
            },
        });
    };

    const openCreateDrawer = () => {
        setEditingStrand(null);
        setDrawerOpen(true);
    };
    const openEditDrawer = (strand) => {
        setEditingStrand(strand);
        setDrawerOpen(true);
    };
    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Strands
                </h2>
            }
        >
            <Head title="Strands" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-x-auto bg-neutral-primary-soft dark:bg-gray-800 shadow-xs rounded-base border border-default dark:border-gray-700">
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="relative w-full max-w-96">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiOutlineSearch className="w-4 h-4 text-body dark:text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, code or track..."
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
                                    <HiOutlinePlus className="w-5 h-5" /> Add
                                    Strand
                                </button>
                            </div>
                        </div>

                        <table className="w-full text-sm text-left rtl:text-right text-body dark:text-gray-300">
                            <thead className="text-sm text-body bg-neutral-secondary-medium dark:bg-gray-700 border-b border-t border-default-medium dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Strand Name
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Track
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Branch
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
                                {strands.data.map((strand) => (
                                    <tr
                                        key={strand.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {strand.code}
                                        </td>
                                        <td className="px-6 py-4">
                                            {strand.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {strand.track?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {strand.branch?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {strand.is_active ? (
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
                                                    openEditDrawer(strand)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            {!strand.is_active ? (
                                                <button
                                                    onClick={() =>
                                                        confirmActivate(strand)
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
                                                            strand,
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
                                                    confirmDelete(strand)
                                                }
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {strands.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No strands found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={strands.links} />
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingStrand(null);
                }}
                title={editingStrand ? "Edit Strand" : "Create New Strand"}
                width="w-full max-w-2xl"
            >
                <StrandFormDrawer
                    strand={editingStrand}
                    branches={branches}
                    tracks={tracks}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingStrand(null);
                    }}
                />
            </Drawer>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteStrand}
                title="Delete Strand"
                message={`Are you sure you want to delete "${strandToDelete?.name}"?`}
                confirmText="Delete"
                variant="danger"
            />
            <Modal
                isOpen={showActivateModal}
                onClose={() => setShowActivateModal(false)}
                onConfirm={activateStrand}
                title="Activate Strand"
                message={`Activate "${strandToActivate?.name}"?`}
                confirmText="Activate"
                variant="info"
            />
            <Modal
                isOpen={showDeactivateModal}
                onClose={() => setShowDeactivateModal(false)}
                onConfirm={deactivateStrand}
                title="Deactivate Strand"
                message={`Deactivate "${strandToDeactivate?.name}"?`}
                confirmText="Deactivate"
                variant="warning"
            />
        </AuthenticatedLayout>
    );
}
