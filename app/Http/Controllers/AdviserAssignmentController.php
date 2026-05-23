<?php

namespace App\Http\Controllers;

use App\Models\SectionAdviserAssignment;
use App\Models\Section;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdviserAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $assignments = SectionAdviserAssignment::with(['section.branch', 'section.schoolYear', 'user'])
            ->when($search, function ($q, $search) {
                $q->whereHas('section', fn($s) => $s->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn($u) => $u->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->orderBy('assigned_at', 'desc')
            ->paginate(15);

        $sections = Section::with('branch')->orderBy('name')->get();
        $teachers = User::role('Teacher')->orderBy('last_name')->get();

        return Inertia::render('AdviserAssignments/Index', [
            'assignments' => $assignments,
            'sections' => $sections,
            'teachers' => $teachers,
        ]);
    }
}
