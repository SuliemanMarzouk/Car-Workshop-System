<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('discount_type', 16)->default('amount')->after('bill_to_address');
            $table->decimal('discount_value', 10, 2)->default(0)->after('discount_type');
        });

        DB::table('invoices')->where('discount_amount', '>', 0)->update([
            'discount_type' => 'amount',
            'discount_value' => DB::raw('discount_amount'),
        ]);
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['discount_type', 'discount_value']);
        });
    }
};
