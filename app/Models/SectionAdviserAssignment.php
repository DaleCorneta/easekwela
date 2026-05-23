<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SectionAdviserAssignment extends Model
{
    protected $fillable = [
        'section_id',
        'user_id',
        'assigned_at',
        'unassigned_at',
        'is_active',
        'remarks',
    ];

    protected $casts = [
        'assigned_at' => 'date',
        'unassigned_at' => 'date',
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
