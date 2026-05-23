import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function SectionSettingFormDrawer({
    setting,
    sections,
    onClose,
}) {
    const isEdit = !!setting;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        section_id: setting?.section_id || "",
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
            ? route("section-settings.update", setting.id)
            : route("section-settings.store");
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
                    Section *
                </label>
                <select
                    value={data.section_id}
                    onChange={(e) => setData("section_id", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    <option value="">Select Section</option>
                    {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.name} ({section.code})
                        </option>
                    ))}
                </select>
                {errors.section_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.section_id}
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
                    placeholder="e.g., grading, attendance"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
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
                    placeholder="e.g., grading_enabled"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
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
                ></textarea>
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
