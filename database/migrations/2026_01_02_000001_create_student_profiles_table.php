<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('full_name');
            $table->string('nim')->unique();
            $table->date('birth_date');
            $table->enum('gender', ['male', 'female']);
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('avatar')->nullable();
            $table->boolean('agreed_terms')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};
