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
        Schema::create('section_settings', function (Blueprint $table) {

            $table->id();

            $table->foreignId('section_id')
                ->constrained()
                ->cascadeOnDelete();

            // Example:
            // grading
            // attendance
            // report_cards
            $table->string('group');

            // Example:
            // grading_enabled
            // strict_mode
            $table->string('key');

            $table->longText('value')
                ->nullable();

            $table->timestamps();

            $table->unique([
                'section_id',
                'group',
                'key'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_settings');
    }
};
