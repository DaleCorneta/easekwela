import { useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import Toggle from "@/Components/Toggle";

export default function StrandFormDrawer({
    strand,
    branches,
    tracks,
    onClose,
}) {
    const isEdit = !!strand;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        branch_id: strand?.branch_id || "",
        track_id: strand?.track_id || "",
        name: strand?.name || "",
        code: strand?.code || "",
        description: strand?.description || "",
        is_active: strand?.is_active ?? true,
    });

    // Filter tracks based on selected branch
    const filteredTracks = useMemo(() => {
        if (!data.branch_id) return [];
        return tracks.filter((track) => track.branch_id == data.branch_id);
    }, [data.branch_id, tracks]);

    // Reset track when branch changes
    useEffect(() => {
        if (data.branch_id) {
            // If the current track doesn't belong to the selected branch, clear it
            const trackExists = filteredTracks.some(
                (t) => t.id == data.track_id,
            );
            if (!trackExists) setData("track_id", "");
        }
    }, [data.branch_id]);

    useEffect(() => {
        return () => reset();
    }, [strand]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("strands.update", strand.id)
            : route("strands.store");
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
                    onChange={(e) => {
                        setData("branch_id", e.target.value);
                        setData("track_id", ""); // reset track when branch changes
                    }}
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
                    Track *
                </label>
                <select
                    value={data.track_id}
                    onChange={(e) => setData("track_id", e.target.value)}
                    required
                    disabled={!data.branch_id}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary disabled:opacity-50"
                >
                    <option value="">Select Track</option>
                    {filteredTracks.map((track) => (
                        <option key={track.id} value={track.id}>
                            {track.name} ({track.code})
                        </option>
                    ))}
                </select>
                {errors.track_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.track_id}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Strand Name *
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    placeholder="e.g., STEM"
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
                    placeholder="e.g., STEM"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.code && (
                    <p className="text-red-600 text-sm mt-1">{errors.code}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Description
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                ></textarea>
                {errors.description && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.description}
                    </p>
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
