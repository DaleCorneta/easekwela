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
        Schema::create('sections', function (Blueprint $table) {

            $table->id();

            $table->foreignId('branch_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('school_year_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('grade_level_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('strand_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Current adviser
            $table->foreignId('adviser_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Example:
            // Rizal
            // Mabini
            // STEM A
            $table->string('name');

            // Example:
            // G7-RIZAL
            // G11-STEM-A
            $table->string('code');

            $table->integer('max_students')
                ->default(45);

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();

            $table->unique([
                'school_year_id',
                'code'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
