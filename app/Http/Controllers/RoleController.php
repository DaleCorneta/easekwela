<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $roles = Role::with('permissions')
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->paginate(10)
            ->withQueryString();

        $allPermissions = Permission::all();
        $groupedPermissions = $this->groupPermissionsByModule($allPermissions);

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'allPermissions' => $groupedPermissions,
        ]);
    }

    public function getPermissions(Role $role)
    {
        $allPermissions = Permission::all();
        $groupedPermissions = $this->groupPermissionsByModule($allPermissions);
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return response()->json([
            'role' => $role,
            'permissions' => $groupedPermissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'permissions' => 'array',
        ]);

        try {
            $role = Role::create(['name' => $validated['name']]);
            $role->syncPermissions($validated['permissions'] ?? []);

            return redirect()->route('roles.index')->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            Log::error('Role creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create role. Please try again.');
        }
    }

    public function edit(Role $role)
    {
        $allPermissions = Permission::all();
        $groupedPermissions = $this->groupPermissionsByModule($allPermissions);
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => $groupedPermissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        // Block editing the Super Admin role
        if ($role->name === 'Super Admin') {
            return back()->with('error', 'Super Admin role cannot be edited.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        try {
            $role->update(['name' => $validated['name']]);
            $role->syncPermissions($validated['permissions'] ?? []);

            return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            Log::error('Role update failed for role ID ' . $role->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update role. Please try again.');
        }
    }

    public function destroy(Role $role)
    {
        // Block deletion of the Super Admin role
        if ($role->name === 'Super Admin') {
            return back()->with('error', 'Super Admin role cannot be deleted.');
        }

        // Check if role still has assigned permissions
        if ($role->permissions()->count() > 0) {
            return back()->with('error', 'Cannot delete role with assigned permissions. Remove all permissions first.');
        }

        try {
            $role->delete();
            return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Role deletion failed for role ID ' . $role->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete role. Please try again.');
        }
    }

    private function groupPermissionsByModule($permissions)
    {
        $grouped = [];
        foreach ($permissions as $perm) {
            $parts = explode(' ', $perm->name, 2);
            $module = $parts[0];
            $action = $parts[1] ?? 'View';
            if (!isset($grouped[$module])) {
                $grouped[$module] = [];
            }
            $grouped[$module][$perm->name] = $action;
        }
        ksort($grouped);
        return $grouped;
    }
}
