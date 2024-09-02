<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Material;

class ProductController extends Controller
{

    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer',
            'description' => 'nullable|string',
            'materials' => 'required|array',
            'materials.*.material_description' => 'required|string',
            'materials.*.materialQuantity' => 'required|integer',
            'materials.*.materialRate' => 'required|numeric',
            'wastePercentage' => 'required|numeric',
            'labourCostPercentage' => 'required|numeric',
            'equipmentCost' => 'required|numeric',
            'otherCostPercentage' => 'required|numeric',
            'marginPercentage' => 'required|numeric',
            'total' => 'required|numeric'  // Ensure total is validated
        ]);

        // Create or update the product
        $product = Product::updateOrCreate(
            ['id' => $request->input('id')],
            $validated
        );

        // Detach existing materials and attach new ones
        $product->materials()->delete();

        foreach ($request->input('materials') as $materialData) {
            $product->materials()->create([
                'material_description' => $materialData['material_description'],
                'materialQuantity' => $materialData['materialQuantity'],
                'materialRate' => $materialData['materialRate'],
            ]);
        }

        // Return the product with its materials and total
        return response()->json([
            'product' => $product,
            'total' => $product->total,
            'materials' => $product->materials->map(function ($material) {
                return [
                    'materialId' => $material->material_id,
                    'materialDescription' => $material->material_description,
                    'materialQuantity' => $material->materialQuantity,
                    'materialRate' => $material->materialRate,
                    // Exclude amount here
                ];
            }),
        ]);
    }

    // Update an existing product
    public function update(Request $request, $id)
    {
        // Validate the request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer',
            'description' => 'nullable|string',
            'wastePercentage' => 'required|numeric',
            'labourCostPercentage' => 'required|numeric',
            'equipmentCost' => 'required|numeric',
            'otherCostPercentage' => 'required|numeric',
            'marginPercentage' => 'required|numeric',
            'total' => 'required|numeric',
            'materials' => 'required|array',
            'materials.*.material_description' => 'required|string',
            'materials.*.materialQuantity' => 'required|integer',
            'materials.*.materialRate' => 'required|numeric',
        ]);

        // Find the existing product
        $product = Product::findOrFail($id);

        // Update the product details
        $product->update([
            'name' => $validatedData['name'],
            'quantity' => $validatedData['quantity'],
            'description' => $validatedData['description'],
            'wastePercentage' => $validatedData['wastePercentage'],
            'labourCostPercentage' => $validatedData['labourCostPercentage'],
            'equipmentCost' => $validatedData['equipmentCost'],
            'otherCostPercentage' => $validatedData['otherCostPercentage'],
            'marginPercentage' => $validatedData['marginPercentage'],
            'total' => $validatedData['total'],
        ]);

        // Update materials - Clear old materials and add the new ones
        $product->materials()->delete(); // Delete old materials

        foreach ($validatedData['materials'] as $material) {
            Material::create([
                'product_id' => $product->id,
                'material_description' => $material['material_description'],
                'materialQuantity' => $material['materialQuantity'],
                'materialRate' => $material['materialRate'],
            ]);
        }

        // Return the updated product with materials
        return response()->json([
            'product' => $product,
            'total' => $product->total,
            'materials' => $product->materials->map(function ($material) {
                return [
                    'materialId' => $material->material_id,
                    'materialDescription' => $material->material_description,
                    'materialQuantity' => $material->materialQuantity,
                    'materialRate' => $material->materialRate,
                ];
            }),
        ]);
    }
    public function index()
    {
        try {
            $products = Product::all();
            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching products'], 500);
        }
    }
    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();
            return response()->json(['message' => 'Product deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting product'], 500);
        }
    }
    public function show($id)
    {
        try {
            $product = Product::with('materials')->findOrFail($id);
            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Product not found'], 404);
        }
    }
}