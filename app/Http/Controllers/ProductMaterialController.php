<?php

namespace App\Http\Controllers;

use App\Models\ProductMaterial;
use Illuminate\Http\Request;

class ProductMaterialController extends Controller
{
    public function index()
    {
        $productMaterials
            = ProductMaterial::all();
        return response()->json($productMaterials);
    }

    public function search(Request $request)
    {
        $description = $request->input('description');
        $productMaterials = ProductMaterial::where('material_description', 'like', "%$description%")->get();
        return response()->json($productMaterials);
    }
}

