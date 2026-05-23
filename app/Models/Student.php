<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Constants
    |--------------------------------------------------------------------------
    */

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_GRADUATED = 'graduated';

    public const STATUS_TRANSFERRED = 'transferred';

    public const STATUS_DROPPED = 'dropped';

    /*
    |--------------------------------------------------------------------------
    | Mass Assignment
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'branch_id',
        'lrn',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'birth_date',
        'gender',
        'civil_status',
        'nationality',
        'religion',
        'address',
        'mobile_number',
        'email',
        'is_4ps_beneficiary',
        'is_indigenous',
        'has_disability',
        'status',
        'remarks',
    ];

    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'birth_date' => 'date',

        'is_4ps_beneficiary' => 'boolean',

        'is_indigenous' => 'boolean',

        'has_disability' => 'boolean',
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

    public function guardians(): HasMany
    {
        return $this->hasMany(StudentGuardian::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(StudentStatusHistory::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getFullNameAttribute(): string
    {
        return collect([
            $this->first_name,
            $this->middle_name,
            $this->last_name,
            $this->suffix,
        ])->filter()->implode(' ');
    }

    public function getDisplayNameAttribute(): string
    {
        return collect([
            $this->last_name . ',',
            $this->first_name,
            $this->middle_name,
            $this->suffix,
        ])->filter()->implode(' ');
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function updateStatus(
        string $status,
        ?int $updatedBy = null,
        ?string $remarks = null
    ): void {
        $this->update([
            'status' => $status,
        ]);

        $this->statusHistories()->create([
            'status' => $status,
            'effective_date' => now(),
            'updated_by' => $updatedBy,
            'remarks' => $remarks,
        ]);
    }
}
