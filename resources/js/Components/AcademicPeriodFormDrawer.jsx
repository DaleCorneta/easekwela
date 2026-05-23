import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Toggle from "@/Components/Toggle";

export default function AcademicPeriodFormDrawer({
    period,
    schoolYears,
    onClose,
}) {
    const isEdit = !!period;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        school_year_id: period?.school_year_id || "",
        name: period?.name || "",
        order: period?.order || "",
        start_date: period?.start_date || "",
        end_date: period?.end_date || "",
        is_active: period?.is_active || false,
        is_locked: period?.is_locked || false,
    });

    useEffect(() => {
        return () => reset();
    }, [period]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("academic-periods.update", period.id)
            : route("academic-periods.store");
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
                    School Year *
                </label>
                <select
                    value={data.school_year_id}
                    onChange={(e) => setData("school_year_id", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    <option value="">Select School Year</option>
                    {schoolYears.map((sy) => (
                        <option key={sy.id} value={sy.id}>
                            {sy.branch?.name} - {sy.name}
                        </option>
                    ))}
                </select>
                {errors.school_year_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.school_year_id}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Period Name *
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    placeholder="e.g., Quarter 1, Semester 1"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Order (1,2,3…)
                </label>
                <input
                    type="number"
                    value={data.order}
                    onChange={(e) =>
                        setData("order", parseInt(e.target.value) || "")
                    }
                    required
                    min="1"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.order && (
                    <p className="text-red-600 text-sm mt-1">{errors.order}</p>
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
                        Active (current period)
                    </span>
                    <Toggle
                        checked={data.is_active}
                        onChange={() => setData("is_active", !data.is_active)}
                    />
                </div>
                {data.is_active && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Activating this period will deactivate any other active
                        period for the same school year.
                    </p>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body dark:text-gray-300">
                        Locked (prevent modifications)
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
