<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\SectionSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SectionSettingController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $settings = SectionSetting::with('section.branch')
            ->when($search, function ($q, $search) {
                $q->where('group', 'like', "%{$search}%")
                    ->orWhere('key', 'like', "%{$search}%")
                    ->orWhereHas('section', fn($s) => $s->where('name', 'like', "%{$search}%"));
            })
            ->paginate(15)
            ->withQueryString();

        $sections = Section::orderBy('name')->get();

        return Inertia::render('SectionSettings/Index', [
            'settings' => $settings,
            'sections' => $sections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_id' => 'required|exists:sections,id',
            'group' => 'required|string|max:255',
            'key' => 'required|string|max:255',
            'value' => 'nullable|string',
        ]);

        // Uniqueness check
        $exists = SectionSetting::where('section_id', $validated['section_id'])
            ->where('group', $validated['group'])
            ->where('key', $validated['key'])
            ->exists();
        if ($exists) {
            return back()->withErrors(['key' => 'Setting already exists for this section/group.']);
        }

        try {
            DB::transaction(function () use ($validated) {
                SectionSetting::create($validated);
            });
            return redirect()->route('section-settings.index')->with('success', 'Setting created successfully.');
        } catch (\Exception $e) {
            Log::error('SectionSetting creation failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create setting.');
        }
    }

    public function update(Request $request, SectionSetting $sectionSetting)
    {
        $validated = $request->validate([
            'section_id' => 'required|exists:sections,id',
            'group' => 'required|string|max:255',
            'key' => 'required|string|max:255',
            'value' => 'nullable|string',
        ]);

        $exists = SectionSetting::where('section_id', $validated['section_id'])
            ->where('group', $validated['group'])
            ->where('key', $validated['key'])
            ->where('id', '!=', $sectionSetting->id)
            ->exists();
        if ($exists) {
            return back()->withErrors(['key' => 'Setting already exists.']);
        }

        try {
            $sectionSetting->update($validated);
            return redirect()->route('section-settings.index')->with('success', 'Setting updated successfully.');
        } catch (\Exception $e) {
            Log::error('SectionSetting update failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to update setting.');
        }
    }

    public function destroy(SectionSetting $sectionSetting)
    {
        try {
            $sectionSetting->delete();
            return redirect()->route('section-settings.index')->with('success', 'Setting deleted successfully.');
        } catch (\Exception $e) {
            Log::error('SectionSetting deletion failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete setting.');
        }
    }
}
