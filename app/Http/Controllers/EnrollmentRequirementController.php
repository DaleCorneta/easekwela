<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\EnrollmentRequirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnrollmentRequirementController extends Controller
{
    public function store(Request $request, Enrollment $enrollment)
    {
        $validated = $request->validate([
            'requirement_type' => 'required|string|max:255',
            'remarks' => 'nullable|string',
        ]);

        try {
            $enrollment->requirements()->create($validated);
            return back()->with('success', 'Requirement added.');
        } catch (\Exception $e) {
            Log::error('Requirement creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to add requirement.');
        }
    }

    public function update(Request $request, Enrollment $enrollment, EnrollmentRequirement $requirement)
    {
        if ($requirement->enrollment_id !== $enrollment->id) abort(404);

        $validated = $request->validate([
            'is_submitted' => 'boolean',
            'is_verified' => 'boolean',
            'remarks' => 'nullable|string',
        ]);

        try {
            $requirement->update($validated);
            return back()->with('success', 'Requirement updated.');
        } catch (\Exception $e) {
            Log::error('Requirement update failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to update requirement.');
        }
    }

    public function destroy(Enrollment $enrollment, EnrollmentRequirement $requirement)
    {
        if ($requirement->enrollment_id !== $enrollment->id) abort(404);
        $requirement->delete();
        return back()->with('success', 'Requirement deleted.');
    }
}
