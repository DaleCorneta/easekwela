<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the old 'name' column
            $table->dropColumn('name');

            // Add new name fields
            $table->string('first_name')->after('id');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('last_name')->after('middle_name');
            $table->string('prefix')->nullable()->after('last_name');   // e.g., Mr., Ms., Dr.
            $table->string('suffix')->nullable()->after('prefix');     // e.g., Jr., Sr., III
            $table->string('status')->default('active')->after('suffix'); // active, inactive, etc.
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name');
            $table->dropColumn([
                'first_name',
                'middle_name',
                'last_name',
                'prefix',
                'suffix',
                'status'
            ]);
        });
    }
};
