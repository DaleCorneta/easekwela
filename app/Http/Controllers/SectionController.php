<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\GradeLevel;
use App\Models\SchoolYear;
use App\Models\Section;
use App\Models\Strand;
use App\Models\User;
use App\Models\SectionAdviserAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $branch = $request->input('branch');
        $schoolYear = $request->input('school_year');
        $gradeLevel = $request->input('grade_level');

        $sections = Section::with([
            'branch',
            'schoolYear',
            'gradeLevel',
            'strand',
            'adviser'
        ])
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->when($branch, fn($q, $b) => $q->where('branch_id', $b))
            ->when($schoolYear, fn($q, $sy) => $q->where('school_year_id', $sy))
            ->when($gradeLevel, fn($q, $gl) => $q->where('grade_level_id', $gl))
            ->orderBy('branch_id')
            ->orderBy('school_year_id')
            ->orderBy('grade_level_id')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);
        $schoolYears = SchoolYear::with('branch')->orderBy('start_date', 'desc')->get();
        $gradeLevels = GradeLevel::orderBy('order')->get();
        $strands = Strand::with('track')->orderBy('name')->get();
        $teachers = User::role('Teacher') // Assuming teachers have "Teacher" role; adjust as needed
            ->orderBy('last_name')
            ->get(['id', 'first_name', 'last_name']);

        return Inertia::render('Sections/Index', [
            'sections' => $sections,
            'branches' => $branches,
            'schoolYears' => $schoolYears,
            'gradeLevels' => $gradeLevels,
            'strands' => $strands,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'school_year_id' => 'required|exists:school_years,id',
            'grade_level_id' => 'required|exists:grade_levels,id',
            'strand_id' => 'nullable|exists:strands,id',
            'adviser_user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:sections,code,NULL,id,school_year_id,' . $request->school_year_id,
            'max_students' => 'integer|min:1|max:999',
            'is_active' => 'boolean',
        ]);

        // Optional: ensure strand belongs to the same branch and is SHS
        if ($validated['strand_id']) {
            $strand = Strand::findOrFail($validated['strand_id']);
            if ($strand->branch_id != $validated['branch_id']) {
                return back()->withErrors(['strand_id' => 'Selected strand does not belong to the chosen branch.'])->withInput();
            }
        }

        try {
            DB::transaction(function () use ($validated) {
                $section = Section::create($validated);

                // If adviser assigned, create first adviser assignment
                if (!empty($validated['adviser_user_id'])) {
                    SectionAdviserAssignment::create([
                        'section_id' => $section->id,
                        'user_id' => $validated['adviser_user_id'],
                        'assigned_at' => now(),
                        'is_active' => true,
                    ]);
                }
            });

            return redirect()->route('sections.index')->with('success', 'Section created successfully.');
        } catch (\Exception $e) {
            Log::error('Section creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create section. Please try again.');
        }
    }

    public function update(Request $request, Section $section)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'school_year_id' => 'required|exists:school_years,id',
            'grade_level_id' => 'required|exists:grade_levels,id',
            'strand_id' => 'nullable|exists:strands,id',
            'adviser_user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:sections,code,' . $section->id . ',id,school_year_id,' . $request->school_year_id,
            'max_students' => 'integer|min:1|max:999',
            'is_active' => 'boolean',
        ]);

        if ($validated['strand_id']) {
            $strand = Strand::findOrFail($validated['strand_id']);
            if ($strand->branch_id != $validated['branch_id']) {
                return back()->withErrors(['strand_id' => 'Selected strand does not belong to the chosen branch.'])->withInput();
            }
        }

        try {
            DB::transaction(function () use ($section, $validated) {
                $oldAdviserId = $section->adviser_user_id;
                $section->update($validated);

                // Handle adviser change
                if ($validated['adviser_user_id'] != $oldAdviserId) {
                    // Deactivate old assignment
                    SectionAdviserAssignment::where('section_id', $section->id)
                        ->where('is_active', true)
                        ->update(['is_active' => false, 'unassigned_at' => now()]);

                    // Create new assignment if new adviser set
                    if (!empty($validated['adviser_user_id'])) {
                        SectionAdviserAssignment::create([
                            'section_id' => $section->id,
                            'user_id' => $validated['adviser_user_id'],
                            'assigned_at' => now(),
                            'is_active' => true,
                        ]);
                    }
                }
            });

            return redirect()->route('sections.index')->with('success', 'Section updated successfully.');
        } catch (\Exception $e) {
            Log::error('Section update failed for ID ' . $section->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update section. Please try again.');
        }
    }

    public function destroy(Section $section)
    {
        try {
            $section->delete();
            return redirect()->route('sections.index')->with('success', 'Section deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Section deletion failed for ID ' . $section->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete section. Please try again.');
        }
    }

    public function activate(Section $section)
    {
        try {
            $section->update(['is_active' => true]);
            return redirect()->route('sections.index')->with('success', 'Section activated successfully.');
        } catch (\Exception $e) {
            Log::error('Section activation failed for ID ' . $section->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to activate section. Please try again.');
        }
    }

    public function deactivate(Section $section)
    {
        try {
            $section->update(['is_active' => false]);
            return redirect()->route('sections.index')->with('success', 'Section deactivated successfully.');
        } catch (\Exception $e) {
            Log::error('Section deactivation failed for ID ' . $section->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to deactivate section. Please try again.');
        }
    }

    // Additional adviser assignment methods (optional, but can be used from modal)
    public function assignAdviser(Request $request, Section $section)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'remarks' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($section, $validated) {
                // Deactivate current
                SectionAdviserAssignment::where('section_id', $section->id)
                    ->where('is_active', true)
                    ->update(['is_active' => false, 'unassigned_at' => now()]);

                // New assignment
                SectionAdviserAssignment::create([
                    'section_id' => $section->id,
                    'user_id' => $validated['user_id'],
                    'assigned_at' => now(),
                    'is_active' => true,
                    'remarks' => $validated['remarks'] ?? null,
                ]);

                $section->update(['adviser_user_id' => $validated['user_id']]);
            });

            return back()->with('success', 'Adviser assigned successfully.');
        } catch (\Exception $e) {
            Log::error('Adviser assignment failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to assign adviser.');
        }
    }

    public function unassignAdviser(Section $section)
    {
        try {
            DB::transaction(function () use ($section) {
                SectionAdviserAssignment::where('section_id', $section->id)
                    ->where('is_active', true)
                    ->update(['is_active' => false, 'unassigned_at' => now()]);

                $section->update(['adviser_user_id' => null]);
            });

            return back()->with('success', 'Adviser unassigned successfully.');
        } catch (\Exception $e) {
            Log::error('Adviser unassign failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to unassign adviser.');
        }
    }
}
