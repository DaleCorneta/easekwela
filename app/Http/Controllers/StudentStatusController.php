<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentStatusController extends Controller
{
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', [
                Student::STATUS_ACTIVE,
                Student::STATUS_INACTIVE,
                Student::STATUS_GRADUATED,
                Student::STATUS_TRANSFERRED,
                Student::STATUS_DROPPED,
            ]),
            'effective_date' => 'required|date',
            'remarks' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($student, $validated) {
                $student->updateStatus(
                    $validated['status'],
                    auth()->id(),
                    $validated['remarks'] ?? null
                );
            });

            return back()->with('success', 'Learner status updated successfully.');
        } catch (\Exception $e) {
            Log::error('Status update failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to update learner status.');
        }
    }
}
