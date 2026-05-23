import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Toggle from "@/Components/Toggle";

export default function TrackFormDrawer({ track, branches, onClose }) {
    const isEdit = !!track;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        branch_id: track?.branch_id || "",
        name: track?.name || "",
        code: track?.code || "",
        is_active: track?.is_active ?? true,
    });

    useEffect(() => {
        return () => reset();
    }, [track]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("tracks.update", track.id)
            : route("tracks.store");
        method(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Branch *
                </label>
                <select
                    value={data.branch_id}
                    onChange={(e) => setData("branch_id", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    <option value="">Select Branch</option>
                    {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name} ({b.code})
                        </option>
                    ))}
                </select>
                {errors.branch_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.branch_id}
                    </p>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Track Name *
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    placeholder="e.g., Academic Track"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Code *
                </label>
                <input
                    type="text"
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    required
                    placeholder="e.g., AT"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.code && (
                    <p className="text-red-600 text-sm mt-1">{errors.code}</p>
                )}
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-body dark:text-gray-300">
                    Active
                </span>
                <Toggle
                    checked={data.is_active}
                    onChange={() => setData("is_active", !data.is_active)}
                />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-default dark:border-gray-700">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-neutral-secondary-medium border border-default-medium text-body rounded-base hover:bg-neutral-tertiary-medium hover:text-heading transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-primary text-white rounded-base hover:bg-primary-dark disabled:opacity-50 transition shadow-sm"
                >
                    {processing ? "Saving..." : isEdit ? "Update" : "Create"}
                </button>
            </div>
        </form>
    );
}
