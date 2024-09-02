<?php
namespace App\Http\Controllers;

use App\Models\ProductMaterial;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'material_id' => 'required|unique:product_materials',
            'material_description' => 'required',
        ]);

        ProductMaterial::create($validatedData);

        return response()->json(['message' => 'Material added successfully']);
    }
}



