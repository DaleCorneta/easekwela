<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\GradeLevel;
use App\Models\SchoolYear;
use App\Models\Section;
use App\Models\Strand;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $school_year = $request->input('school_year');
        $status = $request->input('status');

        $enrollments = Enrollment::with(['student', 'schoolYear', 'gradeLevel', 'section', 'strand'])
            ->when($search, function ($q, $search) {
                $q->whereHas('student', fn($s) => $s->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%"))
                    ->orWhereHas('schoolYear', fn($sy) => $sy->where('name', 'like', "%{$search}%"));
            })
            ->when($school_year, fn($q, $sy) => $q->where('school_year_id', $sy))
            ->when($status, fn($q, $s) => $q->where('status', $s))
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Only unlocked school years should appear in filters/forms
        $schoolYears = SchoolYear::with('branch')->where('is_locked', false)->orderBy('start_date', 'desc')->get();
        $statuses = [Enrollment::STATUS_PENDING, Enrollment::STATUS_APPROVED, Enrollment::STATUS_REJECTED, Enrollment::STATUS_CANCELLED];

        // For drawer (create/edit)
        $students = Student::where('status', Student::STATUS_ACTIVE)->orderBy('last_name')->get(['id', 'first_name', 'last_name', 'middle_name', 'suffix']);
        $gradeLevels = GradeLevel::orderBy('order')->get(['id', 'name', 'is_shs', 'branch_id']);
        $strands = Strand::with('track')->orderBy('name')->get(['id', 'name', 'track_id', 'branch_id']);
        $sections = Section::with('gradeLevel')->orderBy('name')->get(['id', 'name', 'grade_level_id', 'branch_id']);

        return Inertia::render('Enrollments/Index', [
            'enrollments' => $enrollments,
            'schoolYears' => $schoolYears,
            'statuses'     => $statuses,
            'students'     => $students,
            'gradeLevels'  => $gradeLevels,
            'strands'      => $strands,
            'sections'     => $sections,
        ]);
    }

    // The create method is no longer needed – creation happens via drawer in the index page.
    // We'll keep it for compatibility but it can be removed.
    public function create()
    {
        // Redirect to index; drawer handles creation
        return redirect()->route('enrollments.index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'      => 'required|exists:students,id',
            'school_year_id'  => 'required|exists:school_years,id',
            'grade_level_id'  => 'required|exists:grade_levels,id',
            'section_id'      => 'nullable|exists:sections,id',
            'strand_id'       => 'nullable|exists:strands,id',
            'enrollment_type' => 'required|string|max:50',
            'status'          => 'required|in:pending,approved,rejected,cancelled',
            'enrollment_date' => 'nullable|date',
            'remarks'         => 'nullable|string',
        ]);

        // --- Business Rules ---

        // 1. Student must be active
        $student = Student::findOrFail($validated['student_id']);
        if ($student->status !== Student::STATUS_ACTIVE) {
            return back()->withErrors(['student_id' => 'Only active students can be enrolled.'])->withInput();
        }

        // 2. School year must not be locked
        $schoolYear = SchoolYear::findOrFail($validated['school_year_id']);
        if ($schoolYear->is_locked) {
            return back()->withErrors(['school_year_id' => 'Cannot enroll in a locked school year.'])->withInput();
        }

        // 3. No duplicate enrollment for the same student & school year
        $exists = Enrollment::where('student_id', $validated['student_id'])
            ->where('school_year_id', $validated['school_year_id'])
            ->exists();
        if ($exists) {
            return back()->withErrors(['student_id' => 'This student is already enrolled for the selected school year.'])->withInput();
        }

        // 4. Branch consistency
        $branchId = $schoolYear->branch_id;

        // Grade level must belong to the same branch
        $gradeLevel = GradeLevel::findOrFail($validated['grade_level_id']);
        if ($gradeLevel->branch_id != $branchId) {
            return back()->withErrors(['grade_level_id' => 'Grade level does not belong to the selected branch.'])->withInput();
        }

        // If a section is selected, it must belong to the same branch and match the grade level
        if ($validated['section_id']) {
            $section = Section::findOrFail($validated['section_id']);
            if ($section->branch_id != $branchId) {
                return back()->withErrors(['section_id' => 'Section does not belong to the selected branch.'])->withInput();
            }
            if ($section->grade_level_id != $validated['grade_level_id']) {
                return back()->withErrors(['section_id' => 'Section does not match the selected grade level.'])->withInput();
            }
        }

        // If a strand is selected, it must belong to the same branch
        if ($validated['strand_id']) {
            $strand = Strand::findOrFail($validated['strand_id']);
            if ($strand->branch_id != $branchId) {
                return back()->withErrors(['strand_id' => 'Strand does not belong to the selected branch.'])->withInput();
            }
        }

        $validated['branch_id'] = $branchId;

        try {
            DB::transaction(function () use ($validated) {
                Enrollment::create($validated);
            });
            return redirect()->route('enrollments.index')->with('success', 'Enrollment created successfully.');
        } catch (\Exception $e) {
            Log::error('Enrollment creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create enrollment. Please try again.')->withInput();
        }
    }

    public function update(Request $request, Enrollment $enrollment)
    {
        $validated = $request->validate([
            'student_id'      => 'required|exists:students,id',
            'school_year_id'  => 'required|exists:school_years,id',
            'grade_level_id'  => 'required|exists:grade_levels,id',
            'section_id'      => 'nullable|exists:sections,id',
            'strand_id'       => 'nullable|exists:strands,id',
            'enrollment_type' => 'required|string|max:50',
            'status'          => 'required|in:pending,approved,rejected,cancelled',
            'enrollment_date' => 'nullable|date',
            'remarks'         => 'nullable|string',
        ]);

        // --- Business Rules for Update ---

        // 1. If the student or school year is changed, perform duplicate check
        if ($validated['student_id'] != $enrollment->student_id || $validated['school_year_id'] != $enrollment->school_year_id) {
            $exists = Enrollment::where('student_id', $validated['student_id'])
                ->where('school_year_id', $validated['school_year_id'])
                ->where('id', '!=', $enrollment->id)
                ->exists();
            if ($exists) {
                return back()->withErrors(['student_id' => 'Another enrollment already exists for this student and school year.'])->withInput();
            }
        }

        // 2. Student must be active (if changed or always)
        $student = Student::findOrFail($validated['student_id']);
        if ($student->status !== Student::STATUS_ACTIVE) {
            return back()->withErrors(['student_id' => 'Only active students can be enrolled.'])->withInput();
        }

        // 3. School year must not be locked
        $schoolYear = SchoolYear::findOrFail($validated['school_year_id']);
        if ($schoolYear->is_locked) {
            return back()->withErrors(['school_year_id' => 'Cannot enroll in a locked school year.'])->withInput();
        }

        // 4. Branch consistency (re-evaluate)
        $branchId = $schoolYear->branch_id;
        $gradeLevel = GradeLevel::findOrFail($validated['grade_level_id']);
        if ($gradeLevel->branch_id != $branchId) {
            return back()->withErrors(['grade_level_id' => 'Grade level does not belong to the selected branch.'])->withInput();
        }
        if ($validated['section_id']) {
            $section = Section::findOrFail($validated['section_id']);
            if ($section->branch_id != $branchId) {
                return back()->withErrors(['section_id' => 'Section does not belong to the selected branch.'])->withInput();
            }
            if ($section->grade_level_id != $validated['grade_level_id']) {
                return back()->withErrors(['section_id' => 'Section does not match the selected grade level.'])->withInput();
            }
        }
        if ($validated['strand_id']) {
            $strand = Strand::findOrFail($validated['strand_id']);
            if ($strand->branch_id != $branchId) {
                return back()->withErrors(['strand_id' => 'Strand does not belong to the selected branch.'])->withInput();
            }
        }

        $validated['branch_id'] = $branchId;

        try {
            DB::transaction(function () use ($enrollment, $validated) {
                $enrollment->update($validated);
            });
            return redirect()->route('enrollments.index')->with('success', 'Enrollment updated successfully.');
        } catch (\Exception $e) {
            Log::error('Enrollment update failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to update enrollment. Please try again.')->withInput();
        }
    }

    public function destroy(Enrollment $enrollment)
    {
        // Only pending enrollments can be deleted
        if ($enrollment->status !== Enrollment::STATUS_PENDING) {
            return back()->with('error', 'Only pending enrollments can be deleted.');
        }

        try {
            DB::transaction(function () use ($enrollment) {
                // Also delete related requirements if any
                $enrollment->requirements()->delete();
                $enrollment->delete();
            });
            return redirect()->route('enrollments.index')->with('success', 'Enrollment deleted.');
        } catch (\Exception $e) {
            Log::error('Enrollment deletion failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete enrollment. Please try again.');
        }
    }

    // Approval workflow
    public function approve(Enrollment $enrollment)
    {
        if ($enrollment->status !== Enrollment::STATUS_PENDING) {
            return back()->with('error', 'Only pending enrollments can be approved.');
        }

        try {
            $enrollment->approve(auth()->id());
            return back()->with('success', 'Enrollment approved.');
        } catch (\Exception $e) {
            Log::error('Enrollment approval failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to approve enrollment.');
        }
    }

    public function reject(Enrollment $enrollment)
    {
        if ($enrollment->status !== Enrollment::STATUS_PENDING) {
            return back()->with('error', 'Only pending enrollments can be rejected.');
        }

        try {
            $enrollment->update(['status' => Enrollment::STATUS_REJECTED]);
            return back()->with('success', 'Enrollment rejected.');
        } catch (\Exception $e) {
            Log::error('Enrollment rejection failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to reject enrollment.');
        }
    }

    // Section Assignment – bulk update
    public function bulkAssignSection(Request $request)
    {
        $validated = $request->validate([
            'enrollment_ids'   => 'required|array',
            'enrollment_ids.*' => 'exists:enrollments,id',
            'section_id'       => 'required|exists:sections,id',
        ]);

        // Optional: Ensure section belongs to a specific branch or grade level?
        // We can add a check if needed; for now, just assign.

        try {
            DB::transaction(function () use ($validated) {
                Enrollment::whereIn('id', $validated['enrollment_ids'])
                    ->update(['section_id' => $validated['section_id']]);
            });

            return back()->with('success', 'Sections assigned successfully.');
        } catch (\Exception $e) {
            Log::error('Bulk section assignment failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to assign sections.');
        }
    }

    // Enrollment Requirements page (list enrollments with requirements summary)
    public function requirementsIndex(Request $request)
    {
        $search = $request->input('search');
        $school_year = $request->input('school_year');

        $enrollments = Enrollment::with(['student', 'schoolYear', 'requirements'])
            ->when($search, function ($q, $search) {
                $q->whereHas('student', fn($s) => $s->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->when($school_year, fn($q, $sy) => $q->where('school_year_id', $sy))
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $schoolYears = SchoolYear::with('branch')->where('is_locked', false)->orderBy('start_date', 'desc')->get();

        return Inertia::render('Enrollments/Requirements', [
            'enrollments' => $enrollments,
            'schoolYears' => $schoolYears,
        ]);
    }

    public function sectionAssignmentForm(Request $request)
    {
        $schoolYearId = $request->input('school_year_id');
        $gradeLevelId = $request->input('grade_level_id');
        $search = $request->input('search');

        // Only unlocked school years
        $schoolYears = SchoolYear::with('branch')->where('is_locked', false)->orderBy('start_date', 'desc')->get();
        $gradeLevels = GradeLevel::orderBy('order')->get();

        // Sections filterable by grade level if selected
        $sections = Section::when($gradeLevelId, fn($q) => $q->where('grade_level_id', $gradeLevelId))
            ->get();

        $enrollments = Enrollment::with(['student', 'gradeLevel', 'section'])
            ->whereNull('section_id')
            ->when($schoolYearId, fn($q) => $q->where('school_year_id', $schoolYearId))
            ->when($gradeLevelId, fn($q) => $q->where('grade_level_id', $gradeLevelId))
            ->when($search, function ($q) use ($search) {
                $q->whereHas('student', fn($s) => $s->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->get();

        return Inertia::render('Enrollments/SectionAssignment', [
            'schoolYears' => $schoolYears,
            'gradeLevels' => $gradeLevels,
            'sections'    => $sections,
            'enrollments' => $enrollments,
            'filters'     => $request->only(['school_year_id', 'grade_level_id']),
        ]);
    }

    public function approvalIndex(Request $request)
    {
        $enrollments = Enrollment::with(['student', 'schoolYear', 'gradeLevel', 'section'])
            ->where('status', Enrollment::STATUS_PENDING)
            ->when($request->search, fn($q, $s) => $q->whereHas('student', fn($st) => $st->where('first_name', 'like', "%{$s}%")->orWhere('last_name', 'like', "%{$s}%")))
            ->orderBy('created_at', 'asc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Enrollments/Approval', [
            'enrollments' => $enrollments,
        ]);
    }

    public function history(Request $request)
    {
        $search = $request->input('search');
        $school_year = $request->input('school_year');
        $status = $request->input('status');

        $enrollments = Enrollment::with(['student', 'schoolYear', 'gradeLevel', 'section'])
            ->when($search, fn($q, $s) => $q->whereHas(
                'student',
                fn($st) =>
                $st->where('first_name', 'like', "%{$s}%")
                    ->orWhere('last_name', 'like', "%{$s}%")
            ))
            ->when($school_year, fn($q, $sy) => $q->where('school_year_id', $sy))
            ->when($status, fn($q, $s) => $q->where('status', $s))
            ->orderBy('school_year_id', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(25)
            ->withQueryString();

        $schoolYears = SchoolYear::with('branch')->orderBy('start_date', 'desc')->get();
        $statuses = [
            Enrollment::STATUS_PENDING,
            Enrollment::STATUS_APPROVED,
            Enrollment::STATUS_REJECTED,
            Enrollment::STATUS_CANCELLED,
        ];

        return Inertia::render('Enrollments/History', [
            'enrollments' => $enrollments,
            'schoolYears' => $schoolYears,
            'statuses'    => $statuses,
        ]);
    }
}
