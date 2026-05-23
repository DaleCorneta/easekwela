<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'prefix'        => 'nullable|string|max:50',
            'first_name'    => 'required|string|max:255',
            'middle_name'   => 'nullable|string|max:255',
            'last_name'     => 'required|string|max:255',
            'suffix'        => 'nullable|string|max:50',
            'mobile_number' => 'nullable|string|max:20',
            'email'         => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password'      => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'prefix'        => $validated['prefix'] ?? null,
            'first_name'    => $validated['first_name'],
            'middle_name'   => $validated['middle_name'] ?? null,
            'last_name'     => $validated['last_name'],
            'suffix'        => $validated['suffix'] ?? null,
            'mobile_number' => $validated['mobile_number'] ?? null,
            'email'         => $validated['email'],
            'password'      => Hash::make($validated['password']),
            'is_active'     => true,
            'status'        => 'active',
        ]);

        // Assign the Super Admin role
        $superAdminRole = Role::findOrCreate('Super Admin');
        $user->assignRole($superAdminRole);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
