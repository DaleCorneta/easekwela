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
import TrackFormDrawer from "@/Components/TrackFormDrawer";

export default function Index({ tracks, branches }) {
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [trackToDelete, setTrackToDelete] = useState(null);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [trackToActivate, setTrackToActivate] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [trackToDeactivate, setTrackToDeactivate] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingTrack, setEditingTrack] = useState(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                route("tracks.index"),
                { search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const confirmDelete = (track) => {
        setTrackToDelete(track);
        setShowDeleteModal(true);
    };
    const deleteTrack = () => {
        router.visit(route("tracks.destroy", trackToDelete.id), {
            method: "delete",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setTrackToDelete(null);
            },
            onFinish: () => {
                setShowDeleteModal(false);
                setTrackToDelete(null);
            },
        });
    };

    const confirmActivate = (track) => {
        setTrackToActivate(track);
        setShowActivateModal(true);
    };
    const activateTrack = () => {
        router.visit(route("tracks.activate", trackToActivate.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setTrackToActivate(null);
            },
            onFinish: () => {
                setShowActivateModal(false);
                setTrackToActivate(null);
            },
        });
    };

    const confirmDeactivate = (track) => {
        setTrackToDeactivate(track);
        setShowDeactivateModal(true);
    };
    const deactivateTrack = () => {
        router.visit(route("tracks.deactivate", trackToDeactivate.id), {
            method: "post",
            preserveScroll: true,
            onSuccess: () => {
                setShowDeactivateModal(false);
                setTrackToDeactivate(null);
            },
            onFinish: () => {
                setShowDeactivateModal(false);
                setTrackToDeactivate(null);
            },
        });
    };

    const openCreateDrawer = () => {
        setEditingTrack(null);
        setDrawerOpen(true);
    };
    const openEditDrawer = (track) => {
        setEditingTrack(track);
        setDrawerOpen(true);
    };
    const clearSearch = () => setSearch("");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Tracks
                </h2>
            }
        >
            <Head title="Tracks" />
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
                                    placeholder="Search by name or code..."
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
                                    Track
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
                                        Track Name
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
                                {tracks.data.map((track) => (
                                    <tr
                                        key={track.id}
                                        className="bg-neutral-primary-soft dark:bg-gray-800 border-b border-default dark:border-gray-700 hover:bg-neutral-secondary-medium dark:hover:bg-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {track.code}
                                        </td>
                                        <td className="px-6 py-4">
                                            {track.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {track.branch?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {track.is_active ? (
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
                                                    openEditDrawer(track)
                                                }
                                                className="text-fg-brand hover:underline"
                                                title="Edit"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            {!track.is_active ? (
                                                <button
                                                    onClick={() =>
                                                        confirmActivate(track)
                                                    }
                                                    className="text-green-600 hover:text-green-800 dark:text-green-400"
                                                    title="Activate"
                                                >
                                                    <HiOutlineCheckCircle className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        confirmDeactivate(track)
                                                    }
                                                    className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                                    title="Deactivate"
                                                >
                                                    <HiOutlineXCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    confirmDelete(track)
                                                }
                                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                title="Delete"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {tracks.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No tracks found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination links={tracks.links} />
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingTrack(null);
                }}
                title={editingTrack ? "Edit Track" : "Create New Track"}
                width="w-full max-w-2xl"
            >
                <TrackFormDrawer
                    track={editingTrack}
                    branches={branches}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingTrack(null);
                    }}
                />
            </Drawer>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteTrack}
                title="Delete Track"
                message={`Are you sure you want to delete "${trackToDelete?.name}"?`}
                confirmText="Delete"
                variant="danger"
            />
            <Modal
                isOpen={showActivateModal}
                onClose={() => setShowActivateModal(false)}
                onConfirm={activateTrack}
                title="Activate Track"
                message={`Activate "${trackToActivate?.name}"?`}
                confirmText="Activate"
                variant="info"
            />
            <Modal
                isOpen={showDeactivateModal}
                onClose={() => setShowDeactivateModal(false)}
                onConfirm={deactivateTrack}
                title="Deactivate Track"
                message={`Deactivate "${trackToDeactivate?.name}"?`}
                confirmText="Deactivate"
                variant="warning"
            />
        </AuthenticatedLayout>
    );
}
