import { usePage } from "@inertiajs/react";

export function usePermissions() {
    const { auth } = usePage().props;
    const permissions = auth.user?.permissions || [];

    const can = (permission) => permissions.includes(permission);
    const hasRole = (role) => auth.user?.roles?.includes(role);

    return { permissions, can, hasRole };
}
