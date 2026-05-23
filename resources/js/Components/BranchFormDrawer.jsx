import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Toggle from "./Toggle"; // your existing Toggle component

export default function BranchFormDrawer({ branch, onClose }) {
    const isEdit = !!branch;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: branch?.code || "",
        name: branch?.name || "",
        type: branch?.type || "",
        email: branch?.email || "",
        phone: branch?.phone || "",
        address: branch?.address || "",
        is_main: branch?.is_main || false,
        is_active: branch?.is_active ?? true,
    });

    useEffect(() => {
        // reset when branch changes (e.g., opening edit for different branch)
        return () => reset();
    }, [branch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("branches.update", branch.id)
            : route("branches.store");
        method(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Branch Code *
                </label>
                <input
                    type="text"
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.code && (
                    <p className="text-red-600 text-sm mt-1">{errors.code}</p>
                )}
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Branch Name *
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Branch Type
                </label>
                <input
                    type="text"
                    value={data.type}
                    onChange={(e) => setData("type", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    placeholder="e.g., Main, Satellite, Warehouse"
                />
                {errors.type && (
                    <p className="text-red-600 text-sm mt-1">{errors.type}</p>
                )}
            </div>

            {/* Email */}
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
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Phone
                </label>
                <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Address
                </label>
                <textarea
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.address && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.address}
                    </p>
                )}
            </div>

            {/* Toggles: Is Main & Is Active */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body dark:text-gray-300">
                        Main Branch
                    </span>
                    <Toggle
                        checked={data.is_main}
                        onChange={() => setData("is_main", !data.is_main)}
                    />
                </div>
                {data.is_main && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        Only one branch can be the main branch. Enabling this
                        will automatically unset any other main branch.
                    </p>
                )}
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

            {/* Actions */}
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
