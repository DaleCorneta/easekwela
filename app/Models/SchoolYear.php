<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolYear extends Model
{
    protected $fillable = [
        'branch_id',
        'name',
        'start_date',
        'end_date',
        'is_active',
        'is_locked',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'is_locked' => 'boolean',
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

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function activate(): void
    {
        static::where('branch_id', $this->branch_id)
            ->update(['is_active' => false]);

        $this->update(['is_active' => true]);
    }


    public function lock(): void
    {
        $this->update([
            'is_locked' => true
        ]);
    }

    public static function getActiveForBranch(int $branchId)
    {
        return static::where('branch_id', $branchId)
            ->where('is_active', true)
            ->first();
    }

    public function academicPeriods()
    {
        return $this->hasMany(AcademicPeriod::class)->orderBy('order');
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
