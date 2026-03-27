<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'plate_number',
        'vin',
        'car_model',
        'color',
        'odometer',
        'owner_name',
    ];

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class);
    }
}
