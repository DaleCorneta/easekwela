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
        Schema::create('branch_settings', function (Blueprint $table) {

            $table->id();

            $table->foreignId('branch_id')
                ->constrained()
                ->cascadeOnDelete();

            // Setting Group
            // Example:
            // branding
            // report_cards
            // signatories
            // attendance
            $table->string('group');

            // Example:
            // principal_name
            // school_logo
            // report_footer
            $table->string('key');

            // Flexible value
            $table->longText('value')->nullable();

            $table->timestamps();

            // Prevent duplicate keys per branch/group
            $table->unique([
                'branch_id',
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
        Schema::dropIfExists('branch_settings');
    }
};
