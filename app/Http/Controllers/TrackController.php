<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Track;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TrackController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $tracks = Track::with('branch')
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhereHas('branch', fn($b) => $b->where('name', 'like', "%{$search}%"));
            })
            ->orderBy('branch_id')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('Tracks/Index', [
            'tracks' => $tracks,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:tracks,code,NULL,id,branch_id,' . $request->branch_id,
            'is_active' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                Track::create($validated);
            });

            return redirect()->route('tracks.index')
                ->with('success', 'Track created successfully.');
        } catch (\Exception $e) {
            Log::error('Track creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create track. Please try again.');
        }
    }

    public function update(Request $request, Track $track)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:tracks,code,' . $track->id . ',id,branch_id,' . $request->branch_id,
            'is_active' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($track, $validated) {
                $track->update($validated);
            });

            return redirect()->route('tracks.index')
                ->with('success', 'Track updated successfully.');
        } catch (\Exception $e) {
            Log::error('Track update failed for ID ' . $track->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update track. Please try again.');
        }
    }

    public function destroy(Track $track)
    {
        try {
            $track->delete();
            return redirect()->route('tracks.index')
                ->with('success', 'Track deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Track deletion failed for ID ' . $track->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete track. Please try again.');
        }
    }

    public function activate(Track $track)
    {
        try {
            $track->update(['is_active' => true]);
            return redirect()->route('tracks.index')
                ->with('success', 'Track activated successfully.');
        } catch (\Exception $e) {
            Log::error('Track activation failed for ID ' . $track->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to activate track. Please try again.');
        }
    }

    public function deactivate(Track $track)
    {
        try {
            $track->update(['is_active' => false]);
            return redirect()->route('tracks.index')
                ->with('success', 'Track deactivated successfully.');
        } catch (\Exception $e) {
            Log::error('Track deactivation failed for ID ' . $track->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to deactivate track. Please try again.');
        }
    }
}
