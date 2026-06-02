<?php

declare(strict_types=1);

use App\Domain\Tenancy\Enums\TenantStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('central')->table('tenants', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
            $table->string('status', 32)->default(TenantStatus::Active->value)->after('name');
        });
    }

    public function down(): void
    {
        Schema::connection('central')->table('tenants', function (Blueprint $table) {
            $table->dropColumn(['name', 'status']);
        });
    }
};
