<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_order_id',
        'description',
        'status',
        'price',
    ];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class);
    }
}
