import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Toggle from "@/Components/Toggle";

export default function GradeLevelFormDrawer({
    gradeLevel,
    branches,
    onClose,
}) {
    const isEdit = !!gradeLevel;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        branch_id: gradeLevel?.branch_id || "",
        name: gradeLevel?.name || "",
        code: gradeLevel?.code || "",
        order: gradeLevel?.order || "",
        educational_stage: gradeLevel?.educational_stage || "Elementary",
        is_shs: gradeLevel?.is_shs || false,
        is_active: gradeLevel?.is_active ?? true,
    });

    useEffect(() => {
        return () => reset();
    }, [gradeLevel]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("grade-levels.update", gradeLevel.id)
            : route("grade-levels.store");
        method(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const educationalStages = ["Elementary", "Junior High", "Senior High"];

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
                    {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name} ({branch.code})
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
                    Grade Level Name *
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    placeholder="e.g., Grade 1"
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
                    placeholder="e.g., G1"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.code && (
                    <p className="text-red-600 text-sm mt-1">{errors.code}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Order (0‑based) *
                </label>
                <input
                    type="number"
                    value={data.order}
                    onChange={(e) =>
                        setData("order", parseInt(e.target.value) || "")
                    }
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.order && (
                    <p className="text-red-600 text-sm mt-1">{errors.order}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Educational Stage *
                </label>
                <select
                    value={data.educational_stage}
                    onChange={(e) => {
                        const stage = e.target.value;
                        setData({
                            ...data,
                            educational_stage: stage,
                            // Auto‑toggle SHS when “Senior High” is selected
                            is_shs: stage === "Senior High",
                        });
                    }}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    {educationalStages.map((stage) => (
                        <option key={stage} value={stage}>
                            {stage}
                        </option>
                    ))}
                </select>
                {errors.educational_stage && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.educational_stage}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body dark:text-gray-300">
                        Senior High School (SHS)
                    </span>
                    <Toggle
                        checked={data.is_shs}
                        onChange={() => setData("is_shs", !data.is_shs)}
                    />
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
