import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { HiOutlineChevronDown } from "react-icons/hi";
import Toggle from "./Toggle";

export default function EditRoleDrawer({
    role,
    permissions,
    rolePermissions,
    onClose,
}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: role.name,
        permissions: rolePermissions,
    });

    // Reset form when role changes (e.g., different role selected)
    useEffect(() => {
        reset();
    }, [role]);

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
        put(route("roles.update", role.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!permissions || Object.keys(permissions).length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No permissions available.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Role Name
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.name && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.name}
                    </div>
                )}
            </div>

            <div className="border-t border-default dark:border-gray-700 pt-4">
                <h3 className="text-lg font-medium text-heading dark:text-white mb-4">
                    Permissions
                </h3>
                <div className="space-y-3">
                    {Object.entries(permissions).map(([module, perms]) => {
                        const modulePermNames = Object.keys(perms);
                        const allSelected = modulePermNames.every((p) =>
                            data.permissions.includes(p),
                        );
                        return (
                            <div
                                key={module}
                                className="border border-default dark:border-gray-700 rounded-base overflow-hidden"
                            >
                                <div className="flex items-center justify-between bg-neutral-secondary-medium dark:bg-gray-700 px-4 py-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleModule(module)}
                                        className="flex items-center gap-2 font-medium text-heading dark:text-white"
                                    >
                                        {module}
                                        <HiOutlineChevronDown
                                            className={`w-4 h-4 transition-transform ${expandedModules[module] ? "rotate-180" : ""}`}
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
                                {expandedModules[module] && (
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {modulePermNames.map((permName) => (
                                            <div
                                                key={permName}
                                                className="flex items-center justify-between"
                                            >
                                                <span className="text-sm text-body dark:text-gray-300">
                                                    {perms[permName]}
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
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {errors.permissions && (
                    <div className="text-red-600 text-sm mt-2">
                        {errors.permissions}
                    </div>
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
                    {processing ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
