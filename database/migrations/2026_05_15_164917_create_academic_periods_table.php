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
        Schema::create('academic_periods', function (Blueprint $table) {

            $table->id();

            $table->foreignId('school_year_id')
                ->constrained()
                ->cascadeOnDelete();

            // Example:
            // Quarter 1
            // Quarter 2
            $table->string('name');

            // Order sequence
            $table->integer('order');

            $table->date('start_date');

            $table->date('end_date');

            $table->boolean('is_active')
                ->default(false);

            $table->boolean('is_locked')
                ->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_periods');
    }
};
