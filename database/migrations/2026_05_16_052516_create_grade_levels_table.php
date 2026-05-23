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
        Schema::create('grade_levels', function (Blueprint $table) {

            $table->id();

            $table->foreignId('branch_id')
                ->constrained()
                ->cascadeOnDelete();

            // Example:
            // Grade 1
            // Grade 7
            // Grade 11
            $table->string('name');

            // Example:
            // G1
            // G7
            // G11
            $table->string('code');

            // Sequence
            $table->integer('order');

            // Elementary
            // Junior High
            // Senior High
            $table->string('educational_stage');

            // SHS support
            $table->boolean('is_shs')
                ->default(false);

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();

            $table->unique([
                'branch_id',
                'code'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_levels');
    }
};
