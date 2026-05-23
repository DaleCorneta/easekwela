<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $branches = Branch::query()
            ->when($search, function ($q, $search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('code')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Branches/Index', [
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:branches',
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'is_main' => 'boolean',
            'is_active' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                // If new branch is marked as main, clear any existing main flag
                if (!empty($validated['is_main'])) {
                    Branch::where('is_main', true)->update(['is_main' => false]);
                }

                Branch::create($validated);
            });

            return redirect()->route('branches.index')->with('success', 'Branch created successfully.');
        } catch (\Exception $e) {
            Log::error('Branch creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create branch. Please try again.');
        }
    }

    public function update(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:branches,code,' . $branch->id,
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'is_main' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Prevent unsetting the only main branch
        if (empty($validated['is_main']) && $branch->is_main) {
            $otherMainExists = Branch::where('is_main', true)->where('id', '!=', $branch->id)->exists();
            if (!$otherMainExists) {
                return back()->with('error', 'Cannot remove main status from the only main branch. Set another branch as main first.');
            }
        }

        try {
            DB::transaction(function () use ($validated, $branch) {
                // If setting this branch as main (and it wasn't already), clear others
                if (!empty($validated['is_main']) && !$branch->is_main) {
                    Branch::where('is_main', true)->where('id', '!=', $branch->id)->update(['is_main' => false]);
                }

                $branch->update($validated);
            });

            return redirect()->route('branches.index')->with('success', 'Branch updated successfully.');
        } catch (\Exception $e) {
            Log::error('Branch update failed for branch ID ' . $branch->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update branch. Please try again.');
        }
    }

    public function destroy(Branch $branch)
    {
        // Prevent deletion if branch has assigned users
        if ($branch->users()->count() > 0) {
            return back()->with('error', 'Cannot delete branch with assigned users.');
        }

        try {
            $branch->delete();
            return redirect()->route('branches.index')->with('success', 'Branch deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Branch deletion failed for branch ID ' . $branch->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete branch. Please try again.');
        }
    }
}
