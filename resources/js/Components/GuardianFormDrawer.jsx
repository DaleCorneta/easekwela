import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Toggle from "@/Components/Toggle";

export default function GuardianFormDrawer({
    student,
    guardian, // null for create, object for edit
    onClose,
}) {
    const isEdit = !!guardian;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        relationship: guardian?.relationship || "",
        full_name: guardian?.full_name || "",
        mobile_number: guardian?.mobile_number || "",
        telephone_number: guardian?.telephone_number || "",
        email: guardian?.email || "",
        occupation: guardian?.occupation || "",
        address: guardian?.address || "",
        is_primary_contact: guardian?.is_primary_contact || false,
        is_emergency_contact: guardian?.is_emergency_contact || false,
        remarks: guardian?.remarks || "",
    });

    useEffect(() => {
        return () => reset();
    }, [guardian]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("students.guardians.update", {
                  student: student.id,
                  guardian: guardian.id,
              })
            : route("students.guardians.store", student.id);

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
                    Full Name *
                </label>
                <input
                    type="text"
                    value={data.full_name}
                    onChange={(e) => setData("full_name", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.full_name && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.full_name}
                    </p>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Relationship *
                </label>
                <input
                    type="text"
                    value={data.relationship}
                    onChange={(e) => setData("relationship", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.relationship && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.relationship}
                    </p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Mobile
                    </label>
                    <input
                        type="text"
                        value={data.mobile_number}
                        onChange={(e) =>
                            setData("mobile_number", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Telephone
                    </label>
                    <input
                        type="text"
                        value={data.telephone_number}
                        onChange={(e) =>
                            setData("telephone_number", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                </div>
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
            </div>
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Occupation
                </label>
                <input
                    type="text"
                    value={data.occupation}
                    onChange={(e) => setData("occupation", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
            </div>
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
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-body dark:text-gray-300">
                    Primary Contact
                </span>
                <Toggle
                    checked={data.is_primary_contact}
                    onChange={() =>
                        setData("is_primary_contact", !data.is_primary_contact)
                    }
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-body dark:text-gray-300">
                    Emergency Contact
                </span>
                <Toggle
                    checked={data.is_emergency_contact}
                    onChange={() =>
                        setData(
                            "is_emergency_contact",
                            !data.is_emergency_contact,
                        )
                    }
                />
            </div>
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
            </div>
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
                    {processing ? "Saving..." : isEdit ? "Update" : "Add"}
                </button>
            </div>
        </form>
    );
}
