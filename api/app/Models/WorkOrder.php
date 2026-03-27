<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'status',
        'created_by',
        'approved_by',
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function items()
    {
        return $this->hasMany(WorkOrderItem::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
