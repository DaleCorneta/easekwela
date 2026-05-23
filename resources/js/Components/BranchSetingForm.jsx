import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function BranchSettingForm({ setting, branches, onClose }) {
    const isEdit = !!setting;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        branch_id: setting?.branch_id || "",
        group: setting?.group || "",
        key: setting?.key || "",
        value: setting?.value || "",
    });

    useEffect(() => {
        return () => reset();
    }, [setting]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("branch-settings.update", setting.id)
            : route("branch-settings.store");
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
                    Group *
                </label>
                <input
                    type="text"
                    value={data.group}
                    onChange={(e) => setData("group", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    placeholder="e.g., branding, report_cards, signatories"
                />
                {errors.group && (
                    <p className="text-red-600 text-sm mt-1">{errors.group}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Key *
                </label>
                <input
                    type="text"
                    value={data.key}
                    onChange={(e) => setData("key", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    placeholder="e.g., school_logo, principal_name, footer_text"
                />
                {errors.key && (
                    <p className="text-red-600 text-sm mt-1">{errors.key}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Value
                </label>
                <textarea
                    value={data.value}
                    onChange={(e) => setData("value", e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    placeholder="Setting value (text, JSON, etc.)"
                />
                {errors.value && (
                    <p className="text-red-600 text-sm mt-1">{errors.value}</p>
                )}
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
