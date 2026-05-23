import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Toggle from "@/Components/Toggle";

export default function UserForm({
    user,
    roles,
    userRoles,
    branches, // added: list of branches for dropdown
    onSuccess,
    onCancel,
}) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        first_name: user?.first_name || "",
        middle_name: user?.middle_name || "",
        last_name: user?.last_name || "",
        prefix: user?.prefix || "",
        suffix: user?.suffix || "",
        status: user?.status || "active",
        branch_id: user?.branch_id || "",
        employee_id: user?.employee_id || "",
        mobile_number: user?.mobile_number || "",
        is_active: user?.is_active ?? true,
        email: user?.email || "",
        password: "",
        password_confirmation: "",
        roles: userRoles || [],
    });

    // Reset form when user changes (e.g., switching between edit/create)
    useEffect(() => {
        reset();
    }, [user]);

    const toggleRole = (roleName) => {
        let newRoles = [...data.roles];
        if (newRoles.includes(roleName)) {
            newRoles = newRoles.filter((r) => r !== roleName);
        } else {
            newRoles.push(roleName);
        }
        setData("roles", newRoles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEdit ? put : post;
        const url = isEdit
            ? route("users.update", user.id)
            : route("users.store");
        method(url, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                reset();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name fields grid */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Prefix
                    </label>
                    <input
                        type="text"
                        value={data.prefix}
                        onChange={(e) => setData("prefix", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                        placeholder="Mr./Ms./Dr."
                    />
                </div>
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
                </div>
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
                        placeholder="Jr., Sr., III"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Status
                    </label>
                    <select
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Branch, Employee ID, Mobile Number, Is Active */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Branch
                    </label>
                    <select
                        value={data.branch_id}
                        onChange={(e) => setData("branch_id", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    >
                        <option value="">Select Branch</option>
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
                        Employee ID
                    </label>
                    <input
                        type="text"
                        value={data.employee_id}
                        onChange={(e) => setData("employee_id", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.employee_id && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.employee_id}
                        </p>
                    )}
                </div>
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
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body dark:text-gray-300">
                        Account Active
                    </span>
                    <Toggle
                        checked={data.is_active}
                        onChange={() => setData("is_active", !data.is_active)}
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Email *
                </label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            {/* Password fields */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Password {!isEdit && "*"}
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            {/* Roles */}
            <div className="border-t border-default dark:border-gray-700 pt-4">
                <h3 className="text-lg font-medium text-heading dark:text-white mb-2">
                    Roles
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {roles.map((role) => (
                        <label
                            key={role.id}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={data.roles.includes(role.name)}
                                onChange={() => toggleRole(role.name)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-body dark:text-gray-300">
                                {role.name}
                            </span>
                        </label>
                    ))}
                </div>
                {errors.roles && (
                    <p className="text-red-600 text-sm mt-2">{errors.roles}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-default dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
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
