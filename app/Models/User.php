<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'branch_id',
        'first_name',
        'middle_name',
        'last_name',
        'prefix',
        'suffix',
        'status',
        'employee_id',
        'mobile_number',
        'avatar',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim(implode(' ', array_filter([
            $this->prefix,
            $this->first_name,
            $this->middle_name,
            $this->last_name,
            $this->suffix,
        ])));
    }

    /**
     * Get the user's middle initial.
     */
    public function getMiddleInitialAttribute(): string
    {
        if (empty($this->middle_name)) {
            return '';
        }
        return strtoupper(substr($this->middle_name, 0, 1)) . '.';
    }

    /**
     * Override the default name getter (used by some Laravel features like route model binding).
     */
    public function getNameAttribute(): string
    {
        return $this->full_name;
    }

    protected $appends = ['full_name', 'middle_initial']; // add 'full_name'

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function advisorySections()
    {
        return $this->hasMany(Section::class, 'adviser_user_id');
    }

    public function sectionAdviserAssignments()
    {
        return $this->hasMany(SectionAdviserAssignment::class);
    }
}
