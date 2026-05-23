<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnrollmentRequirement extends Model
{
    protected $fillable = [
        'enrollment_id',
        'requirement_type',
        'is_submitted',
        'is_verified',
        'verified_by',
        'verified_at',
        'remarks',
    ];

    protected $casts = [
        'is_submitted' => 'boolean',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
