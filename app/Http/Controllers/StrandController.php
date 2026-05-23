<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Strand;
use App\Models\Track;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StrandController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $strands = Strand::with(['track.branch', 'branch'])
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhereHas('track', fn($t) => $t->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('branch', fn($b) => $b->where('name', 'like', "%{$search}%"));
            })
            ->orderBy('branch_id')
            ->orderBy('track_id')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);
        $tracks = Track::with('branch')->orderBy('name')->get(['id', 'name', 'code', 'branch_id']);

        return Inertia::render('Strands/Index', [
            'strands' => $strands,
            'branches' => $branches,
            'tracks' => $tracks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'track_id' => 'required|exists:tracks,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:strands,code,NULL,id,branch_id,' . $request->branch_id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Optional: Ensure track belongs to the selected branch (backend validation)
        $track = Track::findOrFail($validated['track_id']);
        if ($track->branch_id != $validated['branch_id']) {
            return back()->withErrors(['track_id' => 'Selected track does not belong to the chosen branch.'])->withInput();
        }

        try {
            DB::transaction(function () use ($validated) {
                Strand::create($validated);
            });

            return redirect()->route('strands.index')
                ->with('success', 'Strand created successfully.');
        } catch (\Exception $e) {
            Log::error('Strand creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create strand. Please try again.');
        }
    }

    public function update(Request $request, Strand $strand)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'track_id' => 'required|exists:tracks,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:strands,code,' . $strand->id . ',id,branch_id,' . $request->branch_id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $track = Track::findOrFail($validated['track_id']);
        if ($track->branch_id != $validated['branch_id']) {
            return back()->withErrors(['track_id' => 'Selected track does not belong to the chosen branch.'])->withInput();
        }

        try {
            DB::transaction(function () use ($strand, $validated) {
                $strand->update($validated);
            });

            return redirect()->route('strands.index')
                ->with('success', 'Strand updated successfully.');
        } catch (\Exception $e) {
            Log::error('Strand update failed for ID ' . $strand->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update strand. Please try again.');
        }
    }

    public function destroy(Strand $strand)
    {
        try {
            $strand->delete();
            return redirect()->route('strands.index')
                ->with('success', 'Strand deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Strand deletion failed for ID ' . $strand->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete strand. Please try again.');
        }
    }

    public function activate(Strand $strand)
    {
        try {
            $strand->update(['is_active' => true]);
            return redirect()->route('strands.index')->with('success', 'Strand activated successfully.');
        } catch (\Exception $e) {
            Log::error('Strand activation failed for ID ' . $strand->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to activate strand. Please try again.');
        }
    }

    public function deactivate(Strand $strand)
    {
        try {
            $strand->update(['is_active' => false]);
            return redirect()->route('strands.index')->with('success', 'Strand deactivated successfully.');
        } catch (\Exception $e) {
            Log::error('Strand deactivation failed for ID ' . $strand->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to deactivate strand. Please try again.');
        }
    }
}
