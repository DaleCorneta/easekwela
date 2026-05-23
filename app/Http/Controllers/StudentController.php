<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $gender = $request->input('gender');
        $branch = $request->input('branch');

        $students = Student::with('branch')
            ->when($search, function ($q, $search) {
                $q->where('lrn', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($status, fn($q, $s) => $q->where('status', $s))
            ->when($gender, fn($q, $g) => $q->where('gender', $g))
            ->when($branch, fn($q, $b) => $q->where('branch_id', $b))
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->paginate(15)
            ->withQueryString();

        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);
        $statuses = [
            Student::STATUS_ACTIVE,
            Student::STATUS_INACTIVE,
            Student::STATUS_GRADUATED,
            Student::STATUS_TRANSFERRED,
            Student::STATUS_DROPPED,
        ];
        $genders = ['Male', 'Female']; // from your existing DB values

        return Inertia::render('Students/Index', [
            'students' => $students,
            'branches' => $branches,
            'statuses' => $statuses,
            'genders' => $genders,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'lrn' => 'nullable|string|max:20|unique:students,lrn',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'civil_status' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'mobile_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_4ps_beneficiary' => 'boolean',
            'is_indigenous' => 'boolean',
            'has_disability' => 'boolean',
            'remarks' => 'nullable|string',
        ]);

        $validated['status'] = Student::STATUS_ACTIVE;

        try {
            DB::transaction(function () use ($validated) {
                $student = Student::create($validated);

                // Create initial status history entry
                $student->statusHistories()->create([
                    'status' => Student::STATUS_ACTIVE,
                    'effective_date' => now(),
                    'updated_by' => auth()->id(),
                ]);
            });

            return redirect()->route('students.index')
                ->with('success', 'Student created successfully.');
        } catch (\Exception $e) {
            Log::error('Student creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create student. Please try again.');
        }
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'lrn' => 'nullable|string|max:20|unique:students,lrn,' . $student->id,
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'civil_status' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'mobile_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_4ps_beneficiary' => 'boolean',
            'is_indigenous' => 'boolean',
            'has_disability' => 'boolean',
            'remarks' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($student, $validated) {
                $student->update($validated);
            });

            return redirect()->route('students.index')
                ->with('success', 'Student updated successfully.');
        } catch (\Exception $e) {
            Log::error('Student update failed for ID ' . $student->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update student. Please try again.');
        }
    }

    // DO NOT HARD-DELETE – deactivate instead
    public function destroy(Student $student)
    {
        if ($student->status === Student::STATUS_INACTIVE) {
            return back()->with('error', 'Student is already inactive.');
        }

        try {
            DB::transaction(function () use ($student) {
                $student->updateStatus(
                    Student::STATUS_INACTIVE,
                    auth()->id(),
                    'Deactivated via Student Directory'
                );
            });

            return redirect()->route('students.index')
                ->with('success', 'Student deactivated successfully.');
        } catch (\Exception $e) {
            Log::error('Student deactivation failed for ID ' . $student->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to deactivate student. Please try again.');
        }
    }

    // Optional: activate (if needed later)
    public function activate(Student $student)
    {
        try {
            $student->updateStatus(
                Student::STATUS_ACTIVE,
                auth()->id(),
                'Reactivated'
            );

            return redirect()->route('students.index')
                ->with('success', 'Student activated successfully.');
        } catch (\Exception $e) {
            Log::error('Student activation failed for ID ' . $student->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to activate student. Please try again.');
        }
    }

    public function profile(Student $student)
    {
        $student->load([
            'branch',
            'guardians',
            'documents',
            'statusHistories.updatedBy',
        ]);

        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('Students/Profile', [
            'student' => $student,
            'branches' => $branches,   // add this
        ]);
    }

    public function updateFromProfile(Request $request, Student $student)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'lrn' => 'nullable|string|max:20|unique:students,lrn,' . $student->id,
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'civil_status' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'mobile_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_4ps_beneficiary' => 'boolean',
            'is_indigenous' => 'boolean',
            'has_disability' => 'boolean',
            'remarks' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($student, $validated) {
                $student->update($validated);
            });

            return redirect()->route('students.profile', $student->id)
                ->with('success', 'Student updated successfully.');
        } catch (\Exception $e) {
            Log::error('Student update from profile failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to update student.');
        }
    }
}
