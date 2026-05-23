<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\GradeLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GradeLevelController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $gradeLevels = GradeLevel::with('branch')
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('educational_stage', 'like', "%{$search}%")
                    ->orWhereHas('branch', fn($b) => $b->where('name', 'like', "%{$search}%"));
            })
            ->orderBy('branch_id')
            ->orderBy('order')
            ->paginate(10)
            ->withQueryString();

        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('GradeLevels/Index', [
            'gradeLevels' => $gradeLevels,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:grade_levels,code,NULL,id,branch_id,' . $request->branch_id,
            'order' => 'required|integer|min:0',
            'educational_stage' => 'required|string|max:255',
            'is_shs' => 'boolean',
            'is_active' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                GradeLevel::create($validated);
            });

            return redirect()->route('grade-levels.index')
                ->with('success', 'Grade level created successfully.');
        } catch (\Exception $e) {
            Log::error('GradeLevel creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create grade level. Please try again.');
        }
    }

    public function update(Request $request, GradeLevel $gradeLevel)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:grade_levels,code,' . $gradeLevel->id . ',id,branch_id,' . $request->branch_id,
            'order' => 'required|integer|min:0',
            'educational_stage' => 'required|string|max:255',
            'is_shs' => 'boolean',
            'is_active' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($gradeLevel, $validated) {
                $gradeLevel->update($validated);
            });

            return redirect()->route('grade-levels.index')
                ->with('success', 'Grade level updated successfully.');
        } catch (\Exception $e) {
            Log::error('GradeLevel update failed for ID ' . $gradeLevel->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update grade level. Please try again.');
        }
    }

    public function destroy(GradeLevel $gradeLevel)
    {
        // Optional future: prevent deletion if sections/students exist
        // For now, allow but log
        try {
            $gradeLevel->delete();
            return redirect()->route('grade-levels.index')
                ->with('success', 'Grade level deleted successfully.');
        } catch (\Exception $e) {
            Log::error('GradeLevel deletion failed for ID ' . $gradeLevel->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete grade level. Please try again.');
        }
    }

    // Custom toggle actions (activate/deactivate)
    public function activate(GradeLevel $gradeLevel)
    {
        try {
            $gradeLevel->update(['is_active' => true]);
            return redirect()->route('grade-levels.index')
                ->with('success', 'Grade level activated successfully.');
        } catch (\Exception $e) {
            Log::error('GradeLevel activation failed for ID ' . $gradeLevel->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to activate grade level. Please try again.');
        }
    }

    public function deactivate(GradeLevel $gradeLevel)
    {
        try {
            $gradeLevel->update(['is_active' => false]);
            return redirect()->route('grade-levels.index')
                ->with('success', 'Grade level deactivated successfully.');
        } catch (\Exception $e) {
            Log::error('GradeLevel deactivation failed for ID ' . $gradeLevel->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to deactivate grade level. Please try again.');
        }
    }
}
