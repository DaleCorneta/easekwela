<?php

namespace App\Http\Controllers;

use App\Models\AcademicPeriod;
use App\Models\SchoolYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AcademicPeriodController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $periods = AcademicPeriod::with('schoolYear.branch')
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('schoolYear', fn($sy) => $sy->where('name', 'like', "%{$search}%"));
            })
            ->orderBy('school_year_id')
            ->orderBy('order')
            ->paginate(10)
            ->withQueryString();

        $schoolYears = SchoolYear::with('branch')->orderBy('name')->get();

        return Inertia::render('AcademicPeriods/Index', [
            'periods' => $periods,
            'schoolYears' => $schoolYears,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_year_id' => 'required|exists:school_years,id',
            'name' => 'required|string|max:255',
            'order' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
            'is_locked' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                // If this period is set as active, deactivate others in the same school year
                if (!empty($validated['is_active'])) {
                    AcademicPeriod::where('school_year_id', $validated['school_year_id'])
                        ->where('is_active', true)
                        ->update(['is_active' => false]);
                }

                AcademicPeriod::create($validated);
            });

            return redirect()->route('academic-periods.index')
                ->with('success', 'Academic period created successfully.');
        } catch (\Exception $e) {
            Log::error('AcademicPeriod creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create academic period. Please try again.');
        }
    }

    public function update(Request $request, AcademicPeriod $academicPeriod)
    {
        $validated = $request->validate([
            'school_year_id' => 'required|exists:school_years,id',
            'name' => 'required|string|max:255',
            'order' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
            'is_locked' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated, $academicPeriod) {
                // Handle activation: if setting active, deactivate others in same school year (excluding current)
                if (!empty($validated['is_active']) && !$academicPeriod->is_active) {
                    AcademicPeriod::where('school_year_id', $validated['school_year_id'])
                        ->where('id', '!=', $academicPeriod->id)
                        ->update(['is_active' => false]);
                }

                $academicPeriod->update($validated);
            });

            return redirect()->route('academic-periods.index')
                ->with('success', 'Academic period updated successfully.');
        } catch (\Exception $e) {
            Log::error('AcademicPeriod update failed for ID ' . $academicPeriod->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update academic period. Please try again.');
        }
    }

    public function destroy(AcademicPeriod $academicPeriod)
    {
        // Optional future: prevent deletion if grades or attendance exist
        // For now, allow deletion but wrap in try/catch
        try {
            $academicPeriod->delete();
            return redirect()->route('academic-periods.index')
                ->with('success', 'Academic period deleted successfully.');
        } catch (\Exception $e) {
            Log::error('AcademicPeriod deletion failed for ID ' . $academicPeriod->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete academic period. Please try again.');
        }
    }

    public function activate(AcademicPeriod $academicPeriod)
    {
        try {
            DB::transaction(function () use ($academicPeriod) {
                $academicPeriod->activate(); // model method deactivates others in same school year
            });

            return redirect()->route('academic-periods.index')
                ->with('success', 'Academic period activated successfully.');
        } catch (\Exception $e) {
            Log::error('AcademicPeriod activation failed for ID ' . $academicPeriod->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to activate academic period. Please try again.');
        }
    }

    public function lock(AcademicPeriod $academicPeriod)
    {
        try {
            $academicPeriod->lock(); // model method
            return redirect()->route('academic-periods.index')
                ->with('success', 'Academic period locked successfully.');
        } catch (\Exception $e) {
            Log::error('AcademicPeriod lock failed for ID ' . $academicPeriod->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to lock academic period. Please try again.');
        }
    }

    public function unlock(AcademicPeriod $academicPeriod)
    {
        try {
            $academicPeriod->unlock(); // model method
            return redirect()->route('academic-periods.index')
                ->with('success', 'Academic period unlocked successfully.');
        } catch (\Exception $e) {
            Log::error('AcademicPeriod unlock failed for ID ' . $academicPeriod->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to unlock academic period. Please try again.');
        }
    }
}
