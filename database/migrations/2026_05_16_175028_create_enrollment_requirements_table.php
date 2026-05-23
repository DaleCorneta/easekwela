<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollment_requirements', function (Blueprint $table) {

            $table->id();

            $table->foreignId('enrollment_id')
                ->constrained()
                ->cascadeOnDelete();

            // PSA
            // SF9
            // SF10
            $table->string('requirement_type');

            $table->boolean('is_submitted')
                ->default(false);

            $table->boolean('is_verified')
                ->default(false);

            $table->foreignId('verified_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('verified_at')
                ->nullable();

            $table->text('remarks')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollment_requirements');
    }
};
