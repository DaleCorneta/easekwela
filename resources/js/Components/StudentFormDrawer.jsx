import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Toggle from "@/Components/Toggle";

export default function StudentFormDrawer({
    student, // null for create, object for edit
    branches,
    onClose,
    updateRoute = null,
}) {
    const isEdit = !!student;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        branch_id: student?.branch_id || "",
        lrn: student?.lrn || "",
        first_name: student?.first_name || "",
        middle_name: student?.middle_name || "",
        last_name: student?.last_name || "",
        suffix: student?.suffix || "",
        birth_date: student?.birth_date || "",
        gender: student?.gender || "",
        civil_status: student?.civil_status || "",
        nationality: student?.nationality || "",
        religion: student?.religion || "",
        address: student?.address || "",
        mobile_number: student?.mobile_number || "",
        email: student?.email || "",
        is_4ps_beneficiary: student?.is_4ps_beneficiary || false,
        is_indigenous: student?.is_indigenous || false,
        has_disability: student?.has_disability || false,
        remarks: student?.remarks || "",
    });

    useEffect(() => {
        return () => reset();
    }, [student]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? (updateRoute ?? route("students.update", student.id))
            : route("students.store");

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

            {/* LRN */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    LRN
                </label>
                <input
                    type="text"
                    value={data.lrn}
                    onChange={(e) => setData("lrn", e.target.value)}
                    placeholder="Leave blank if not available"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.lrn && (
                    <p className="text-red-600 text-sm mt-1">{errors.lrn}</p>
                )}
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        First Name *
                    </label>
                    <input
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.first_name && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.first_name}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Middle Name
                    </label>
                    <input
                        type="text"
                        value={data.middle_name}
                        onChange={(e) => setData("middle_name", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.middle_name && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.middle_name}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Last Name *
                    </label>
                    <input
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData("last_name", e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.last_name && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.last_name}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Suffix
                    </label>
                    <input
                        type="text"
                        value={data.suffix}
                        onChange={(e) => setData("suffix", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.suffix && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.suffix}
                        </p>
                    )}
                </div>
            </div>

            {/* Birth Date & Gender */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Birth Date
                    </label>
                    <input
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData("birth_date", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.birth_date && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.birth_date}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Gender
                    </label>
                    <select
                        value={data.gender}
                        onChange={(e) => setData("gender", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.gender}
                        </p>
                    )}
                </div>
            </div>

            {/* Civil Status, Nationality, Religion */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Civil Status
                    </label>
                    <input
                        type="text"
                        value={data.civil_status}
                        onChange={(e) =>
                            setData("civil_status", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.civil_status && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.civil_status}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Nationality
                    </label>
                    <input
                        type="text"
                        value={data.nationality}
                        onChange={(e) => setData("nationality", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.nationality && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.nationality}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Religion
                    </label>
                    <input
                        type="text"
                        value={data.religion}
                        onChange={(e) => setData("religion", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.religion && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.religion}
                        </p>
                    )}
                </div>
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Address
                </label>
                <textarea
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                ></textarea>
                {errors.address && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.address}
                    </p>
                )}
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Mobile Number
                    </label>
                    <input
                        type="text"
                        value={data.mobile_number}
                        onChange={(e) =>
                            setData("mobile_number", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.mobile_number && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.mobile_number}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            {/* DepEd flags */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body dark:text-gray-300">
                        4Ps Beneficiary
                    </span>
                    <Toggle
                        checked={data.is_4ps_beneficiary}
                        onChange={() =>
                            setData(
                                "is_4ps_beneficiary",
                                !data.is_4ps_beneficiary,
                            )
                        }
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body dark:text-gray-300">
                        Indigenous
                    </span>
                    <Toggle
                        checked={data.is_indigenous}
                        onChange={() =>
                            setData("is_indigenous", !data.is_indigenous)
                        }
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body dark:text-gray-300">
                        Has Disability
                    </span>
                    <Toggle
                        checked={data.has_disability}
                        onChange={() =>
                            setData("has_disability", !data.has_disability)
                        }
                    />
                </div>
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
