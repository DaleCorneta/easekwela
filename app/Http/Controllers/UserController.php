<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $role = $request->input('role');
        $branch = $request->input('branch');

        $users = User::with(['roles', 'branch'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%");
                });
            })
            ->when($status, fn($q, $status) => $q->where('status', $status))
            ->when($role, fn($q, $role) => $q->whereHas('roles', fn($r) => $r->where('name', $role)))
            ->when($branch, fn($q, $branch) => $q->where('branch_id', $branch))
            ->paginate(10)
            ->withQueryString();

        $roles = Role::all();
        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'branches' => $branches,
        ]);
    }

    public function create()
    {
        $roles = Role::all();
        return Inertia::render('Users/Form', [
            'user' => null,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'prefix' => 'nullable|string|max:50',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive,suspended',
            'branch_id' => 'nullable|exists:branches,id',
            'employee_id' => 'nullable|string|max:255|unique:users',
            'mobile_number' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'array',
            'roles.*' => 'exists:roles,name',
        ]);

        try {
            $user = User::create([
                'prefix' => $validated['prefix'] ?? null,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'suffix' => $validated['suffix'] ?? null,
                'status' => $validated['status'],
                'branch_id' => $validated['branch_id'] ?? null,
                'employee_id' => $validated['employee_id'] ?? null,
                'mobile_number' => $validated['mobile_number'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
            ]);

            $user->syncRoles($validated['roles'] ?? []);

            return redirect()->route('users.index')->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            Log::error('User creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create user. Please try again.');
        }
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        $userRoles = $user->roles->pluck('name')->toArray();
        return Inertia::render('Users/Form', [
            'user' => $user,
            'roles' => $roles,
            'userRoles' => $userRoles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        // 1. Block editing of Super Admin
        if ($user->hasRole('Super Admin')) {
            return back()->with('error', 'Super Admin cannot be edited.');
        }

        $validated = $request->validate([
            'prefix' => 'nullable|string|max:50',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive,suspended',
            'branch_id' => 'nullable|exists:branches,id',
            'employee_id' => 'nullable|string|max:255|unique:users,employee_id,' . $user->id,
            'mobile_number' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'array',
            'roles.*' => 'exists:roles,name',
        ]);

        try {
            $user->update([
                'prefix' => $validated['prefix'] ?? null,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'suffix' => $validated['suffix'] ?? null,
                'status' => $validated['status'],
                'branch_id' => $validated['branch_id'] ?? null,
                'employee_id' => $validated['employee_id'] ?? null,
                'mobile_number' => $validated['mobile_number'] ?? null,
                'is_active' => $validated['is_active'] ?? $user->is_active,
                'email' => $validated['email'],
            ]);

            if (!empty($validated['password'])) {
                $user->update(['password' => bcrypt($validated['password'])]);
            }

            $user->syncRoles($validated['roles'] ?? []);

            return redirect()->route('users.index')->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            Log::error('User update failed for user ID ' . $user->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update user. Please try again.');
        }
    }

    public function destroy(User $user)
    {
        // 1. Block deletion of Super Admin
        if ($user->hasRole('Super Admin')) {
            return back()->with('error', 'Super Admin cannot be deleted.');
        }

        // 2. Prevent deleting yourself (optional safety check)
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        try {
            $user->delete();
            return redirect()->route('users.index')->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            Log::error('User deletion failed for user ID ' . $user->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete user. Please try again.');
        }
    }

    /**
     * Helper to check if user has Super Admin role
     * (Optional if you need it elsewhere, otherwise keep inline)
     */
    private function isSuperAdmin(User $user): bool
    {
        return $user->hasRole('Super Admin');
    }
}
