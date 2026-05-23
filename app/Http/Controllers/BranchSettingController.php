<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BranchSettingController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $settings = BranchSetting::with('branch')
            ->when($search, function ($q, $search) {
                $q->where('group', 'like', "%{$search}%")
                    ->orWhere('key', 'like', "%{$search}%")
                    ->orWhereHas('branch', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%");
                    });
            })
            ->paginate(15)
            ->withQueryString();

        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('BranchSettings/Index', [
            'settings' => $settings,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'group' => 'required|string|max:255',
            'key' => 'required|string|max:255',
            'value' => 'nullable|string',
        ]);

        // Uniqueness check (business rule)
        $exists = BranchSetting::where('branch_id', $validated['branch_id'])
            ->where('group', $validated['group'])
            ->where('key', $validated['key'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'key' => 'This setting already exists for the selected branch and group.'
            ]);
        }

        try {
            DB::transaction(function () use ($validated) {
                BranchSetting::create($validated);
            });

            return redirect()->route('branch-settings.index')
                ->with('success', 'Setting created successfully.');
        } catch (\Exception $e) {
            Log::error('BranchSetting creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create setting. Please try again.');
        }
    }

    public function edit(BranchSetting $branchSetting)
    {
        $branches = Branch::orderBy('name')->get(['id', 'name', 'code']);
        return Inertia::render('BranchSettings/Form', [
            'setting' => $branchSetting,
            'branches' => $branches,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, BranchSetting $branchSetting)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'group' => 'required|string|max:255',
            'key' => 'required|string|max:255',
            'value' => 'nullable|string',
        ]);

        // Uniqueness check excluding current record
        $exists = BranchSetting::where('branch_id', $validated['branch_id'])
            ->where('group', $validated['group'])
            ->where('key', $validated['key'])
            ->where('id', '!=', $branchSetting->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'key' => 'This setting already exists for the selected branch and group.'
            ]);
        }

        try {
            DB::transaction(function () use ($branchSetting, $validated) {
                $branchSetting->update($validated);
            });

            return redirect()->route('branch-settings.index')
                ->with('success', 'Setting updated successfully.');
        } catch (\Exception $e) {
            Log::error('BranchSetting update failed for ID ' . $branchSetting->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to update setting. Please try again.');
        }
    }

    public function destroy(BranchSetting $branchSetting)
    {
        try {
            $branchSetting->delete();
            return redirect()->route('branch-settings.index')
                ->with('success', 'Setting deleted successfully.');
        } catch (\Exception $e) {
            Log::error('BranchSetting deletion failed for ID ' . $branchSetting->id . ': ' . $e->getMessage());
            return back()->with('error', 'Failed to delete setting. Please try again.');
        }
    }
}
