<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('bill_to_name')->default('')->after('work_order_id');
            $table->text('bill_to_address')->nullable()->after('bill_to_name');
            $table->decimal('discount_amount', 10, 2)->default(0)->after('bill_to_address');
            $table->text('notes')->nullable()->after('total');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['bill_to_name', 'bill_to_address', 'discount_amount', 'notes']);
        });
    }
};
