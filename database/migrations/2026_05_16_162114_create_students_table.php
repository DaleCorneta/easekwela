<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {

            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Branch
            |--------------------------------------------------------------------------
            */

            $table->foreignId('branch_id')
                ->constrained()
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | DepEd Information
            |--------------------------------------------------------------------------
            */

            // Learner Reference Number
            $table->string('lrn')
                ->nullable()
                ->unique();

            /*
            |--------------------------------------------------------------------------
            | Personal Information
            |--------------------------------------------------------------------------
            */

            $table->string('first_name');

            $table->string('middle_name')
                ->nullable();

            $table->string('last_name');

            $table->string('suffix')
                ->nullable();

            $table->date('birth_date')
                ->nullable();

            // Male / Female
            $table->string('gender')
                ->nullable();

            $table->string('civil_status')
                ->nullable();

            $table->string('nationality')
                ->nullable();

            $table->string('religion')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Contact Information
            |--------------------------------------------------------------------------
            */

            $table->text('address')
                ->nullable();

            $table->string('mobile_number')
                ->nullable();

            $table->string('email')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | DepEd Flags
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_4ps_beneficiary')
                ->default(false);

            $table->boolean('is_indigenous')
                ->default(false);

            $table->boolean('has_disability')
                ->default(false);

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            // active
            // inactive
            // graduated
            // transferred
            // dropped
            $table->string('status')
                ->default('active');

            /*
            |--------------------------------------------------------------------------
            | Additional
            |--------------------------------------------------------------------------
            */

            $table->text('remarks')
                ->nullable();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'last_name',
                'first_name'
            ]);

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
