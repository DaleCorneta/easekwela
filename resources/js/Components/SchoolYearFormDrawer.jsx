import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Toggle from "@/Components/Toggle";

export default function SchoolYearFormDrawer({
    schoolYear,
    branches,
    onClose,
}) {
    const isEdit = !!schoolYear;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        branch_id: schoolYear?.branch_id || "",
        name: schoolYear?.name || "",
        start_date: schoolYear?.start_date || "",
        end_date: schoolYear?.end_date || "",
        is_active: schoolYear?.is_active || false,
        is_locked: schoolYear?.is_locked || false,
    });

    useEffect(() => {
        return () => reset();
    }, [schoolYear]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("school-years.update", schoolYear.id)
            : route("school-years.store");
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
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.code} - {branch.name}
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
                    School Year *
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    placeholder="e.g., 2025-2026"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Start Date *
                    </label>
                    <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData("start_date", e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.start_date && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.start_date}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        End Date *
                    </label>
                    <input
                        type="date"
                        value={data.end_date}
                        onChange={(e) => setData("end_date", e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.end_date && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.end_date}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body dark:text-gray-300">
                        Active (current school year)
                    </span>
                    <Toggle
                        checked={data.is_active}
                        onChange={() => setData("is_active", !data.is_active)}
                    />
                </div>
                {data.is_active && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Activating this year will deactivate any other active
                        school year for the same branch.
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body dark:text-gray-300">
                        Locked (prevent further changes)
                    </span>
                    <Toggle
                        checked={data.is_locked}
                        onChange={() => setData("is_locked", !data.is_locked)}
                    />
                </div>
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
