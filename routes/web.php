<?php

use App\Http\Controllers\AcademicPeriodController;
use App\Http\Controllers\AdviserAssignmentController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\BranchSettingController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\EnrollmentRequirementController;
use App\Http\Controllers\GradeLevelController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolYearController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SectionSettingController;
use App\Http\Controllers\StrandController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentDocumentController;
use App\Http\Controllers\StudentGuardianController;
use App\Http\Controllers\StudentStatusController;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\UserController;
use App\Models\Branch;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // User Management
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('roles', RoleController::class)->except(['show']);

    // Branch Management
    Route::resource('branches', BranchController::class)->except(['show']);
    Route::resource('branch-settings', BranchSettingController::class)
        ->except(['show'])
        ->parameter('branch-settings', 'branchSetting');

    // School Year Management
    Route::resource('school-years', SchoolYearController::class)->except(['show']);
    Route::post('/school-years/{schoolYear}/activate', [SchoolYearController::class, 'activate'])->name('school-years.activate');
    Route::post('/school-years/{schoolYear}/lock', [SchoolYearController::class, 'lock'])->name('school-years.lock');
    Route::post('/school-years/{schoolYear}/unlock', [SchoolYearController::class, 'unlock'])->name('school-years.unlock');

    // Academic Period
    Route::resource('academic-periods', AcademicPeriodController::class)->except(['show']);
    Route::post('/academic-periods/{academicPeriod}/activate', [AcademicPeriodController::class, 'activate'])->name('academic-periods.activate');
    Route::post('/academic-periods/{academicPeriod}/lock', [AcademicPeriodController::class, 'lock'])->name('academic-periods.lock');
    Route::post('/academic-periods/{academicPeriod}/unlock', [AcademicPeriodController::class, 'unlock'])->name('academic-periods.unlock');

    // Grade Level
    Route::resource('grade-levels', GradeLevelController::class);
    Route::post('grade-levels/{gradeLevel}/activate', [GradeLevelController::class, 'activate'])->name('grade-levels.activate');
    Route::post('grade-levels/{gradeLevel}/deactivate', [GradeLevelController::class, 'deactivate'])->name('grade-levels.deactivate');


    Route::get('/tracks-by-branch/{branch}', function (Branch $branch) {
        return $branch->tracks()->orderBy('name')->get(['id', 'name', 'code']);
    });

    // Tracks
    Route::resource('tracks', TrackController::class);
    Route::post('tracks/{track}/activate', [TrackController::class, 'activate'])->name('tracks.activate');
    Route::post('tracks/{track}/deactivate', [TrackController::class, 'deactivate'])->name('tracks.deactivate');

    // Strands
    Route::resource('strands', StrandController::class);
    Route::post('strands/{strand}/activate', [StrandController::class, 'activate'])->name('strands.activate');
    Route::post('strands/{strand}/deactivate', [StrandController::class, 'deactivate'])->name('strands.deactivate');

    // Section
    Route::resource('sections', SectionController::class);
    Route::post('sections/{section}/activate', [SectionController::class, 'activate'])->name('sections.activate');
    Route::post('sections/{section}/deactivate', [SectionController::class, 'deactivate'])->name('sections.deactivate');
    Route::post('sections/{section}/assign-adviser', [SectionController::class, 'assignAdviser'])->name('sections.assign-adviser');
    Route::post('sections/{section}/unassign-adviser', [SectionController::class, 'unassignAdviser'])->name('sections.unassign-adviser');

    Route::resource('adviser-assignments', AdviserAssignmentController::class);
    Route::resource('section-settings', SectionSettingController::class);

    // SIS Student Information System
    Route::resource('students', StudentController::class);
    Route::post('students/{student}/activate', [StudentController::class, 'activate'])->name('students.activate');
    Route::get('/students/{student}/profile', [StudentController::class, 'profile'])
        ->name('students.profile');
    Route::put('/students/{student}/update-from-profile', [StudentController::class, 'updateFromProfile'])
        ->name('students.profile.update');

    Route::prefix('students/{student}/guardians')->name('students.guardians.')->group(function () {
        Route::post('/', [StudentGuardianController::class, 'store'])->name('store');
        Route::put('/{guardian}', [StudentGuardianController::class, 'update'])->name('update');
        Route::delete('/{guardian}', [StudentGuardianController::class, 'destroy'])->name('destroy');
        Route::post('/{guardian}/toggle-emergency', [StudentGuardianController::class, 'toggleEmergency'])->name('toggle-emergency');
    });

    Route::prefix('students/{student}/documents')->name('students.documents.')->group(function () {
        Route::post('/', [StudentDocumentController::class, 'store'])->name('store');
        Route::post('/{document}', [StudentDocumentController::class, 'update'])->name('update');
        Route::delete('/{document}', [StudentDocumentController::class, 'destroy'])->name('destroy');
        Route::post('/{document}/verify', [StudentDocumentController::class, 'verify'])->name('verify');
    });

    Route::post('/students/{student}/update-status', [StudentStatusController::class, 'update'])
        ->name('students.update-status');

    Route::resource('enrollments', EnrollmentController::class);
    Route::post('enrollments/{enrollment}/approve', [EnrollmentController::class, 'approve'])->name('enrollments.approve');
    Route::post('enrollments/{enrollment}/reject', [EnrollmentController::class, 'reject'])->name('enrollments.reject');
    Route::post('/section-assignment/bulk', [EnrollmentController::class, 'bulkAssignSection'])->name('section-assignment.bulk');

    Route::prefix('enrollments/{enrollment}/requirements')->name('enrollments.requirements.')->group(function () {
        Route::post('/', [EnrollmentRequirementController::class, 'store'])->name('store');
        Route::put('/{requirement}', [EnrollmentRequirementController::class, 'update'])->name('update');
        Route::delete('/{requirement}', [EnrollmentRequirementController::class, 'destroy'])->name('destroy');
    });

    Route::get('/enrollment-requirements', [EnrollmentController::class, 'requirementsIndex'])->name('enrollment-requirements.index');
    Route::get('/section-assignment', [EnrollmentController::class, 'sectionAssignmentForm'])->name('section-assignment.index');
    Route::get('/enrollment-approval', [EnrollmentController::class, 'approvalIndex'])->name('enrollment-approval.index');
    Route::get('/enrollment-history', [EnrollmentController::class, 'history'])->name('enrollment-history.index');
});

require __DIR__ . '/auth.php';
