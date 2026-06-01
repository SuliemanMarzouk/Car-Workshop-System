<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_order_id',
        'bill_to_name',
        'bill_to_address',
        'discount_type',
        'discount_value',
        'discount_amount',
        'subtotal',
        'tax',
        'total',
        'notes',
        'currency',
        'base_currency',
        'exchange_rate',
    ];

    protected $casts = [
        'exchange_rate' => 'decimal:6',
        'discount_type' => 'string',
        'discount_value' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }
}
