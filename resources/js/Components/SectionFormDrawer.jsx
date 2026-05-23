import { useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import Toggle from "@/Components/Toggle";

export default function SectionFormDrawer({
    section,
    branches,
    schoolYears,
    gradeLevels,
    strands,
    teachers,
    onClose,
}) {
    const isEdit = !!section;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        branch_id: section?.branch_id || "",
        school_year_id: section?.school_year_id || "",
        grade_level_id: section?.grade_level_id || "",
        strand_id: section?.strand_id || "",
        adviser_user_id: section?.adviser_user_id || "",
        name: section?.name || "",
        code: section?.code || "",
        max_students: section?.max_students || 45,
        is_active: section?.is_active ?? true,
    });

    // Filter school years by branch
    const filteredSchoolYears = useMemo(() => {
        if (!data.branch_id) return [];
        return schoolYears.filter((sy) => sy.branch_id == data.branch_id);
    }, [data.branch_id, schoolYears]);

    // Filter grade levels by branch
    const filteredGradeLevels = useMemo(() => {
        if (!data.branch_id) return [];
        return gradeLevels.filter((gl) => gl.branch_id == data.branch_id);
    }, [data.branch_id, gradeLevels]);

    // Filter strands by branch and only SHS grade levels?
    const showStrand = useMemo(() => {
        const gl = gradeLevels.find((g) => g.id == data.grade_level_id);
        return gl?.is_shs;
    }, [data.grade_level_id, gradeLevels]);

    const filteredStrands = useMemo(() => {
        if (!data.branch_id) return [];
        return strands.filter((s) => s.branch_id == data.branch_id);
    }, [data.branch_id, strands]);

    // Reset dependent fields when branch changes
    useEffect(() => {
        setData((prev) => ({
            ...prev,
            school_year_id: "",
            grade_level_id: "",
            strand_id: "",
        }));
    }, [data.branch_id]);

    useEffect(() => {
        return () => reset();
    }, [section]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("sections.update", section.id)
            : route("sections.store");
        method(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Branch */}
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

            {/* School Year */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    School Year *
                </label>
                <select
                    value={data.school_year_id}
                    onChange={(e) => setData("school_year_id", e.target.value)}
                    required
                    disabled={!data.branch_id}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary disabled:opacity-50"
                >
                    <option value="">Select School Year</option>
                    {filteredSchoolYears.map((sy) => (
                        <option key={sy.id} value={sy.id}>
                            {sy.name}
                        </option>
                    ))}
                </select>
                {errors.school_year_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.school_year_id}
                    </p>
                )}
            </div>

            {/* Grade Level */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Grade Level *
                </label>
                <select
                    value={data.grade_level_id}
                    onChange={(e) => setData("grade_level_id", e.target.value)}
                    required
                    disabled={!data.branch_id}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary disabled:opacity-50"
                >
                    <option value="">Select Grade Level</option>
                    {filteredGradeLevels.map((gl) => (
                        <option key={gl.id} value={gl.id}>
                            {gl.name} ({gl.educational_stage})
                        </option>
                    ))}
                </select>
                {errors.grade_level_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.grade_level_id}
                    </p>
                )}
            </div>

            {/* Strand (conditional) */}
            {showStrand && (
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Strand
                    </label>
                    <select
                        value={data.strand_id}
                        onChange={(e) => setData("strand_id", e.target.value)}
                        disabled={!data.branch_id}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    >
                        <option value="">None</option>
                        {filteredStrands.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name} ({s.track?.name})
                            </option>
                        ))}
                    </select>
                    {errors.strand_id && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.strand_id}
                        </p>
                    )}
                </div>
            )}

            {/* Adviser */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Adviser
                </label>
                <select
                    value={data.adviser_user_id}
                    onChange={(e) => setData("adviser_user_id", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    <option value="">None</option>
                    {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.first_name} {t.last_name}
                        </option>
                    ))}
                </select>
                {errors.adviser_user_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.adviser_user_id}
                    </p>
                )}
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Section Name *
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    placeholder="e.g., Rizal"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            {/* Code */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Code *
                </label>
                <input
                    type="text"
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    required
                    placeholder="e.g., G7-RIZAL"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.code && (
                    <p className="text-red-600 text-sm mt-1">{errors.code}</p>
                )}
            </div>

            {/* Max Students */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Max Students
                </label>
                <input
                    type="number"
                    value={data.max_students}
                    onChange={(e) =>
                        setData("max_students", parseInt(e.target.value) || 0)
                    }
                    min="1"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.max_students && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.max_students}
                    </p>
                )}
            </div>

            {/* Active Toggle */}
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
