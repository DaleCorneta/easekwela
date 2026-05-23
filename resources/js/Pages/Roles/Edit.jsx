import { useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Toggle = ({ checked, onChange }) => {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                checked ? "bg-primary" : "bg-gray-200 dark:bg-gray-600"
            }`}
            role="switch"
            aria-checked={checked}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    checked ? "translate-x-4" : "translate-x-0"
                }`}
            />
        </button>
    );
};

export default function Edit({ role, permissions, rolePermissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions,
    });

    // All modules expanded by default
    const [expandedModules, setExpandedModules] = useState(() => {
        const expanded = {};
        Object.keys(permissions).forEach((module) => {
            expanded[module] = true;
        });
        return expanded;
    });

    const togglePermission = (permName) => {
        let newPerms = [...data.permissions];
        if (newPerms.includes(permName)) {
            newPerms = newPerms.filter((p) => p !== permName);
        } else {
            newPerms.push(permName);
        }
        setData("permissions", newPerms);
    };

    const toggleModule = (module) => {
        setExpandedModules((prev) => ({ ...prev, [module]: !prev[module] }));
    };

    const toggleAllModule = (module, modulePerms) => {
        const allSelected = modulePerms.every((p) =>
            data.permissions.includes(p),
        );
        if (allSelected) {
            setData(
                "permissions",
                data.permissions.filter((p) => !modulePerms.includes(p)),
            );
        } else {
            const newPerms = [...data.permissions];
            modulePerms.forEach((p) => {
                if (!newPerms.includes(p)) newPerms.push(p);
            });
            setData("permissions", newPerms);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("roles.update", role.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Edit Role: {role.name}
                </h2>
            }
        >
            <div className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-neutral-primary-soft dark:bg-gray-800 rounded-base border border-default dark:border-gray-700 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Role Name */}
                            <div>
                                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                                    Role Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                                />
                                {errors.name && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Permissions as toggles */}
                            <div className="border-t border-default dark:border-gray-700 pt-4">
                                <h3 className="text-lg font-medium text-heading dark:text-white mb-4">
                                    Permissions
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(permissions).map(
                                        ([module, perms]) => {
                                            const modulePermNames =
                                                Object.keys(perms);
                                            const allSelected =
                                                modulePermNames.every((p) =>
                                                    data.permissions.includes(
                                                        p,
                                                    ),
                                                );
                                            return (
                                                <div
                                                    key={module}
                                                    className="border border-default dark:border-gray-700 rounded-base overflow-hidden"
                                                >
                                                    <div className="flex items-center justify-between bg-neutral-secondary-medium dark:bg-gray-700 px-4 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleModule(
                                                                    module,
                                                                )
                                                            }
                                                            className="flex items-center gap-2 font-medium text-heading dark:text-white"
                                                        >
                                                            {module}
                                                            <HiOutlineChevronDown
                                                                className={`w-4 h-4 transition-transform ${
                                                                    expandedModules[
                                                                        module
                                                                    ]
                                                                        ? "rotate-180"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleAllModule(
                                                                    module,
                                                                    modulePermNames,
                                                                )
                                                            }
                                                            className="text-sm text-primary hover:underline"
                                                        >
                                                            {allSelected
                                                                ? "Deselect All"
                                                                : "Select All"}
                                                        </button>
                                                    </div>
                                                    {expandedModules[
                                                        module
                                                    ] && (
                                                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {modulePermNames.map(
                                                                (permName) => (
                                                                    <div
                                                                        key={
                                                                            permName
                                                                        }
                                                                        className="flex items-center justify-between"
                                                                    >
                                                                        <span className="text-sm text-body dark:text-gray-300">
                                                                            {
                                                                                perms[
                                                                                    permName
                                                                                ]
                                                                            }
                                                                        </span>
                                                                        <Toggle
                                                                            checked={data.permissions.includes(
                                                                                permName,
                                                                            )}
                                                                            onChange={() =>
                                                                                togglePermission(
                                                                                    permName,
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                                {errors.permissions && (
                                    <div className="text-red-600 text-sm mt-2">
                                        {errors.permissions}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-default dark:border-gray-700">
                                <Link
                                    href={route("roles.index")}
                                    className="px-4 py-2 bg-neutral-secondary-medium border border-default-medium text-body rounded-base hover:bg-neutral-tertiary-medium hover:text-heading transition"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-primary text-white rounded-base hover:bg-primary-dark disabled:opacity-50 transition shadow-sm"
                                >
                                    {processing ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
