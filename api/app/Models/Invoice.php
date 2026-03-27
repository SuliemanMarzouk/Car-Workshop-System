<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_order_id',
        'subtotal',
        'tax',
        'total',
    ];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class);
    }
}
