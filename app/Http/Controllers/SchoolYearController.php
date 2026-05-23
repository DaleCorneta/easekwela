<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\SchoolYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SchoolYearController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $schoolYears = SchoolYear::with('branch')
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('branch', fn($b) => $b->where('name', 'like', "%{$search}%"));
            })
            ->orderBy('start_date', 'desc')
            ->paginate(10)
            ->withQueryString();

        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('SchoolYears/Index', [
            'schoolYears' => $schoolYears,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
            'is_locked' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                if (!empty($validated['is_active'])) {
                    // Deactivate other active school years for THIS branch only
                    SchoolYear::where('branch_id', $validated['branch_id'])
                        ->where('is_active', true)
                        ->update(['is_active' => false]);
                }
                SchoolYear::create($validated);
            });

            return redirect()->route('school-years.index')
                ->with('success', 'School year created successfully.');
        } catch (\Exception $e) {
            Log::error('SchoolYear creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create school year. Please try again.');
        }
    }

    public function update(Request $request, SchoolYear $schoolYear)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
            'is_locked' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated, $schoolYear) {
                if (!empty($validated['is_active']) && !$schoolYear->is_active) {
                    // Deactivate others in the same branch (excluding current)
                    SchoolYear::where('branch_id', $validated['branch_id'])
                        ->where('is_active', true)
                        ->where('id', '!=', $schoolYear->id)
                        ->update(['is_active' => false]);
                }
                $schoolYear->update($validated);
            });

            return redirect()->route('school-years.index')
                ->with('success', 'School year updated successfully.');
        } catch (\Exception $e) {
            Log::error('SchoolYear update failed for ID ' . $schoolYear->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update school year. Please try again.');
        }
    }

    public function destroy(SchoolYear $schoolYear)
    {
        if ($schoolYear->is_active) {
            return back()->with('error', 'Cannot delete the active school year. Please activate another one first.');
        }

        try {
            $schoolYear->delete();
            return redirect()->route('school-years.index')
                ->with('success', 'School year deleted successfully.');
        } catch (\Exception $e) {
            Log::error('SchoolYear deletion failed for ID ' . $schoolYear->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete school year. Please try again.');
        }
    }

    public function activate(SchoolYear $schoolYear)
    {
        try {
            DB::transaction(function () use ($schoolYear) {
                // Model’s activate() deactivates others in the same branch
                $schoolYear->activate();
            });

            return redirect()->route('school-years.index')
                ->with('success', 'School year activated successfully.');
        } catch (\Exception $e) {
            Log::error('SchoolYear activation failed for ID ' . $schoolYear->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to activate school year. Please try again.');
        }
    }

    public function lock(SchoolYear $schoolYear)
    {
        try {
            $schoolYear->update(['is_locked' => true]);
            return redirect()->route('school-years.index')
                ->with('success', 'School year locked successfully.');
        } catch (\Exception $e) {
            Log::error('SchoolYear lock failed for ID ' . $schoolYear->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to lock school year. Please try again.');
        }
    }

    public function unlock(SchoolYear $schoolYear)
    {
        try {
            $schoolYear->update(['is_locked' => false]);
            return redirect()->route('school-years.index')
                ->with('success', 'School year unlocked successfully.');
        } catch (\Exception $e) {
            Log::error('SchoolYear unlock failed for ID ' . $schoolYear->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to unlock school year. Please try again.');
        }
    }
}
