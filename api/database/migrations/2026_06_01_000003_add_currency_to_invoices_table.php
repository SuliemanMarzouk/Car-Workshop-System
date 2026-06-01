<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('currency', 3)->default('USD')->after('notes');
            $table->string('base_currency', 3)->default('USD')->after('currency');
            $table->decimal('exchange_rate', 12, 6)->default(1)->after('base_currency');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['currency', 'base_currency', 'exchange_rate']);
        });
    }
};
