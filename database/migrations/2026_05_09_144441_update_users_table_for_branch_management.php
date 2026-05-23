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
        Schema::table('users', function (Blueprint $table) {

            // Branch Assignment
            $table->foreignId('branch_id')
                ->nullable()
                ->after('id')
                ->constrained('branches')
                ->nullOnDelete();

            // Additional User Info
            $table->string('employee_id')
                ->nullable()
                ->after('status');

            $table->string('mobile_number')
                ->nullable()
                ->after('employee_id');

            $table->string('avatar')
                ->nullable()
                ->after('mobile_number');

            // Account State
            $table->boolean('is_active')
                ->default(true)
                ->after('avatar');

            $table->timestamp('last_login_at')
                ->nullable()
                ->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropConstrainedForeignId('branch_id');

            $table->dropColumn([
                'employee_id',
                'mobile_number',
                'avatar',
                'is_active',
                'last_login_at',
            ]);
        });
    }
};
