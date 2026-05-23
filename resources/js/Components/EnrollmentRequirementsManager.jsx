import { useState } from "react";
import { router } from "@inertiajs/react";
import { HiOutlineTrash } from "react-icons/hi";
import Toggle from "@/Components/Toggle";

export default function EnrollmentRequirementsManager({ enrollment, onClose }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRequirement, setNewRequirement] = useState("");

    const handleAddRequirement = (e) => {
        e.preventDefault();
        if (!newRequirement.trim()) return;

        router.post(
            route("enrollments.requirements.store", enrollment.id),
            {
                requirement_type: newRequirement,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewRequirement("");
                    setShowAddForm(false);
                    // Close the drawer to force a fresh reload on next open
                    onClose();
                },
            },
        );
    };

    const updateRequirement = (requirementId, data) => {
        router.put(
            route("enrollments.requirements.update", {
                enrollment: enrollment.id,
                requirement: requirementId,
            }),
            data,
            {
                preserveScroll: true,
                onSuccess: () => onClose(),
            },
        );
    };

    const deleteRequirement = (requirementId) => {
        if (confirm("Delete this requirement?")) {
            router.delete(
                route("enrollments.requirements.destroy", {
                    enrollment: enrollment.id,
                    requirement: requirementId,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => onClose(),
                },
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-heading dark:text-white">
                    Requirements
                </h4>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded-base hover:bg-primary-dark"
                >
                    {showAddForm ? "Cancel" : "Add Requirement"}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddRequirement} className="flex gap-2">
                    <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Requirement type (e.g., SF10)"
                        className="flex-1 px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-base hover:bg-primary-dark disabled:opacity-50"
                    >
                        Add
                    </button>
                </form>
            )}

            {enrollment.requirements?.length > 0 ? (
                <ul className="space-y-3">
                    {enrollment.requirements.map((req) => (
                        <li
                            key={req.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-neutral-secondary-medium dark:bg-gray-700 rounded-base"
                        >
                            <div className="flex-1 text-sm">
                                <span className="font-medium text-heading dark:text-white">
                                    {req.requirement_type}
                                </span>
                                <div className="flex gap-x-4 mt-1">
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded ${
                                            req.is_submitted
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        {req.is_submitted
                                            ? "Submitted"
                                            : "Not Submitted"}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded ${
                                            req.is_verified
                                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        {req.is_verified
                                            ? "Verified"
                                            : "Unverified"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Toggle
                                    checked={req.is_submitted}
                                    onChange={() =>
                                        updateRequirement(req.id, {
                                            is_submitted: !req.is_submitted,
                                        })
                                    }
                                />
                                <button
                                    onClick={() =>
                                        updateRequirement(req.id, {
                                            is_verified: !req.is_verified,
                                        })
                                    }
                                    className="text-sm text-fg-brand hover:underline"
                                >
                                    {req.is_verified ? "Unverify" : "Verify"}
                                </button>
                                <button
                                    onClick={() => deleteRequirement(req.id)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                                >
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-body dark:text-gray-400 italic">
                    No requirements added.
                </p>
            )}
        </div>
    );
}
