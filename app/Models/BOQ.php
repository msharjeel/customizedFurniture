<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BOQ extends Model
{
    protected $table = 'boqs';
    protected $fillable = [
        'product_id',
        'product_cost',
        'quantity',
        'total',
    ];
}