<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductMaterial;


class DashboardController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();

        // Total Number of Products
        $total = Product::query()->count();

        // Total Number of Materials
        $Material = ProductMaterial::query()->count();

        // Latest Product
        $latest = Product::query()->latest('created_at')->first();



        return [
            'totalProducts' => $total,
            'latestProduct' => $latest,
            'totalMaterials' => $Material,

        ];
    }
}
