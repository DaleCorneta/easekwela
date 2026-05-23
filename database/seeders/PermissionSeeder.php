<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define modules and their standard actions
        $modules = [
            'Category' => ['View', 'Add', 'Edit', 'Delete', 'Export', 'Search'],
            'Classification' => ['View', 'Add', 'Edit', 'Delete', 'Export', 'Search'],
            'Sub-Category' => ['View', 'Add', 'Edit', 'Delete', 'Export', 'Search'],
            'Organization' => ['View', 'Add', 'Edit', 'Delete', 'Export', 'Search'],
            'Unit' => ['View', 'Add', 'Edit', 'Delete', 'Export', 'Search'],
            'Division' => ['View', 'Add', 'Edit', 'Delete', 'Export', 'Search'],
            'Organization Type' => ['View', 'Add', 'Edit', 'Delete', 'Export', 'Search'],
            'User' => ['View', 'Add', 'Edit', 'Delete', 'Export', 'Search'],
        ];

        // Special modules with non‑standard action sets or names
        $specialPermissions = [
            'Super Admin Dashboard',
            'Admin Dashboard',
            'Teacher Dashboard',
            'System Settings',
            'Access Control',
            'Audit Trail',
        ];

        // Create standard module permissions
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$module} {$action}"]);
            }
        }

        // Create special permissions
        foreach ($specialPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions

        // 1. Super Admin (gets all permissions via Gate::before in AppServiceProvider)
        Role::firstOrCreate(['name' => 'Super Admin']);

        // 2. Admin
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $adminPermissions = ['Admin Dashboard'];
        foreach ($adminPermissions as $perm) {
            $admin->givePermissionTo($perm);
        }

        // 3. Teacher
        $teacher = Role::firstOrCreate(['name' => 'Teacher']);
        $teacherPermissions = ['Teacher Dashboard'];
        foreach ($teacherPermissions as $perm) {
            $teacher->givePermissionTo($perm);
        }
    }
}
