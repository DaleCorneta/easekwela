import { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Drawer from "@/Components/Drawer";
import { HiOutlinePlus } from "react-icons/hi";

export default function Create({
    students,
    schoolYears,
    gradeLevels,
    strands,
    sections,
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: "",
        school_year_id: "",
        grade_level_id: "",
        section_id: "",
        strand_id: "",
        enrollment_type: "new",
        status: "pending",
        enrollment_date: new Date().toISOString().split("T")[0],
        remarks: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("enrollments.store"), {
            onSuccess: () => {
                reset();
                setDrawerOpen(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Enrollment Processing
                </h2>
            }
        >
            <Head title="Enrollment Processing" />
            <div className="py-6">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="..."
                        >
                            <HiOutlinePlus className="w-5 h-5" /> New Enrollment
                        </button>
                    </div>

                    <Drawer
                        isOpen={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        title="New Enrollment"
                        width="w-full max-w-2xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            {/* Student Select */}
                            <div>
                                <label>Student *</label>
                                <select
                                    value={data.student_id}
                                    onChange={(e) =>
                                        setData("student_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select Student</option>
                                    {students.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* School Year */}
                            <div>
                                <label>School Year *</label>
                                <select
                                    value={data.school_year_id}
                                    onChange={(e) =>
                                        setData(
                                            "school_year_id",
                                            e.target.value,
                                        )
                                    }
                                    required
                                >
                                    <option value="">Select School Year</option>
                                    {schoolYears.map((sy) => (
                                        <option key={sy.id} value={sy.id}>
                                            {sy.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Grade Level */}
                            <div>
                                <label>Grade Level *</label>
                                <select
                                    value={data.grade_level_id}
                                    onChange={(e) =>
                                        setData(
                                            "grade_level_id",
                                            e.target.value,
                                        )
                                    }
                                    required
                                >
                                    <option value="">Select Grade Level</option>
                                    {gradeLevels.map((gl) => (
                                        <option key={gl.id} value={gl.id}>
                                            {gl.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Section */}
                            <div>
                                <label>Section</label>
                                <select
                                    value={data.section_id}
                                    onChange={(e) =>
                                        setData("section_id", e.target.value)
                                    }
                                >
                                    <option value="">None</option>
                                    {sections
                                        .filter(
                                            (s) =>
                                                s.grade_level_id ==
                                                data.grade_level_id,
                                        )
                                        .map((sec) => (
                                            <option key={sec.id} value={sec.id}>
                                                {sec.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            {/* Strand (only for SHS) */}
                            {/* ... similar conditional logic */}
                            {/* Status, type, date, remarks */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </Drawer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
