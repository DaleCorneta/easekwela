<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentGuardian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentGuardianController extends Controller
{
    public function store(Request $request, Student $student)
    {
        $validated = $request->validate([
            'relationship' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'mobile_number' => 'nullable|string|max:20',
            'telephone_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'occupation' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'is_primary_contact' => 'boolean',
            'is_emergency_contact' => 'boolean',
            'remarks' => 'nullable|string',
        ]);

        // Enforce only one primary contact per student
        if ($validated['is_primary_contact']) {
            $student->guardians()->where('is_primary_contact', true)->update(['is_primary_contact' => false]);
        }

        try {
            DB::transaction(function () use ($student, $validated) {
                $student->guardians()->create($validated);
            });

            return back()->with('success', 'Guardian added successfully.');
        } catch (\Exception $e) {
            Log::error('Guardian creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to add guardian.');
        }
    }

    public function update(Request $request, Student $student, StudentGuardian $guardian)
    {
        // Ensure the guardian belongs to the student
        if ($guardian->student_id !== $student->id) {
            abort(404);
        }

        $validated = $request->validate([
            'relationship' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'mobile_number' => 'nullable|string|max:20',
            'telephone_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'occupation' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'is_primary_contact' => 'boolean',
            'is_emergency_contact' => 'boolean',
            'remarks' => 'nullable|string',
        ]);

        if ($validated['is_primary_contact']) {
            // Remove primary flag from other guardians of this student
            $student->guardians()->where('id', '!=', $guardian->id)->where('is_primary_contact', true)->update(['is_primary_contact' => false]);
        }

        try {
            DB::transaction(function () use ($guardian, $validated) {
                $guardian->update($validated);
            });

            return back()->with('success', 'Guardian updated successfully.');
        } catch (\Exception $e) {
            Log::error('Guardian update failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to update guardian.');
        }
    }

    public function destroy(Student $student, StudentGuardian $guardian)
    {
        if ($guardian->student_id !== $student->id) {
            abort(404);
        }

        try {
            $guardian->delete();
            return back()->with('success', 'Guardian removed successfully.');
        } catch (\Exception $e) {
            Log::error('Guardian deletion failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to remove guardian.');
        }
    }

    // Optional: quick toggle for emergency contact via separate endpoint
    public function toggleEmergency(Request $request, Student $student, StudentGuardian $guardian)
    {
        if ($guardian->student_id !== $student->id) {
            abort(404);
        }
        $guardian->update(['is_emergency_contact' => !$guardian->is_emergency_contact]);
        return back()->with('success', 'Emergency contact updated.');
    }
}
