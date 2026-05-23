<?php

namespace App\Models;

use App\Models\BranchSetting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $fillable = [
        'code',
        'name',
        'type',
        'email',
        'phone',
        'address',
        'is_main',
        'is_active',
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function settings(): HasMany
    {
        return $this->hasMany(BranchSetting::class);
    }

    public function schoolYears()
    {
        return $this->hasMany(SchoolYear::class);
    }

    public function tracks()
    {
        return $this->hasMany(Track::class);
    }

    public function strands()
    {
        return $this->hasMany(Strand::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
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

    public function gradeLevels()
    {
        return $this->hasMany(GradeLevel::class)
            ->orderBy('order');
    }
}
