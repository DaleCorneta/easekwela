import { useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import Toggle from "@/Components/Toggle";

export default function EnrollmentFormDrawer({
    enrollment = null,
    students,
    schoolYears,
    gradeLevels,
    strands,
    sections,
    onClose,
}) {
    const isEdit = !!enrollment;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        student_id: enrollment?.student_id || "",
        school_year_id: enrollment?.school_year_id || "",
        grade_level_id: enrollment?.grade_level_id || "",
        section_id: enrollment?.section_id || "",
        strand_id: enrollment?.strand_id || "",
        enrollment_type: enrollment?.enrollment_type || "new",
        status: enrollment?.status || "pending",
        enrollment_date: enrollment?.enrollment_date || "",
        remarks: enrollment?.remarks || "",
    });

    // Filter sections by selected grade level
    const filteredSections = useMemo(() => {
        if (!data.grade_level_id) return [];
        return sections.filter(
            (s) => String(s.grade_level_id) === String(data.grade_level_id),
        );
    }, [data.grade_level_id, sections]);

    // Determine if strand should be shown (SHS)
    const showStrand = useMemo(() => {
        const gl = gradeLevels.find((g) => g.id == data.grade_level_id);
        return gl?.is_shs;
    }, [data.grade_level_id, gradeLevels]);

    // Filter strands by branch of the selected school year
    const filteredStrands = useMemo(() => {
        if (!data.school_year_id) return [];
        const sy = schoolYears.find((s) => s.id == data.school_year_id);
        return strands.filter((s) => s.branch_id == sy?.branch_id);
    }, [data.school_year_id, schoolYears, strands]);

    useEffect(() => {
        return () => reset();
    }, [enrollment]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("enrollments.update", enrollment.id)
            : route("enrollments.store");
        method(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Student *
                </label>
                <select
                    value={data.student_id}
                    onChange={(e) => setData("student_id", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.last_name}, {s.first_name} {s.middle_name}
                        </option>
                    ))}
                </select>
                {errors.student_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.student_id}
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
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    <option value="">Select School Year</option>
                    {schoolYears
                        .filter((sy) => !sy.is_locked)
                        .map((sy) => (
                            <option key={sy.id} value={sy.id}>
                                {sy.name} - {sy.branch?.name}
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
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    <option value="">Select Grade Level</option>
                    {gradeLevels.map((gl) => (
                        <option key={gl.id} value={gl.id}>
                            {gl.name}
                        </option>
                    ))}
                </select>
                {errors.grade_level_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.grade_level_id}
                    </p>
                )}
            </div>

            {/* Section (filtered) */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Section
                </label>
                <select
                    value={data.section_id}
                    onChange={(e) => setData("section_id", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    <option value="">None</option>
                    {filteredSections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                            {sec.name}
                        </option>
                    ))}
                </select>
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
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    >
                        <option value="">None</option>
                        {filteredStrands.map((str) => (
                            <option key={str.id} value={str.id}>
                                {str.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Enrollment Type, Status */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Enrollment Type *
                    </label>
                    <select
                        value={data.enrollment_type}
                        onChange={(e) =>
                            setData("enrollment_type", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    >
                        <option value="new">New</option>
                        <option value="old">Old</option>
                        <option value="transferee">Transferee</option>
                        <option value="returnee">Returnee</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Status *
                    </label>
                    <select
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Enrollment Date */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Enrollment Date
                </label>
                <input
                    type="date"
                    value={data.enrollment_date}
                    onChange={(e) => setData("enrollment_date", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.enrollment_date && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.enrollment_date}
                    </p>
                )}
            </div>

            {/* Remarks */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Remarks
                </label>
                <textarea
                    value={data.remarks}
                    onChange={(e) => setData("remarks", e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                ></textarea>
                {errors.remarks && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.remarks}
                    </p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-default dark:border-gray-700">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={processing}
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
