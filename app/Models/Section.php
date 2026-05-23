<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    protected $fillable = [
        'branch_id',
        'school_year_id',
        'grade_level_id',
        'strand_id',
        'adviser_user_id',
        'name',
        'code',
        'max_students',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class);
    }

    public function gradeLevel(): BelongsTo
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function strand(): BelongsTo
    {
        return $this->belongsTo(Strand::class);
    }

    public function adviser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'adviser_user_id');
    }

    public function adviserAssignments(): HasMany
    {
        return $this->hasMany(SectionAdviserAssignment::class);
    }

    public function settings(): HasMany
    {
        return $this->hasMany(SectionSetting::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function getSetting(string $group, string $key, $default = null)
    {
        return $this->settings()
            ->where('group', $group)
            ->where('key', $key)
            ->value('value') ?? $default;
    }
}
