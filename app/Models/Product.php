<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'quantity',
        'description',
        'wastePercentage',
        'labourCostPercentage',
        'equipmentCost',
        'otherCostPercentage',
        'marginPercentage',
        'total',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'wastePercentage' => 'float',
        'labourCostPercentage' => 'float',
        'equipmentCost' => 'float',
        'otherCostPercentage' => 'float',
        'marginPercentage' => 'float',
        'total' => 'float',
    ];

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn($value) => strtoupper($value),
            set: fn($value) => strtoupper($value),
        );
    }

    /**
     * Define a one-to-many relationship with Material.
     */
    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }
}