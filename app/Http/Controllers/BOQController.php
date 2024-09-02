<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BOQ;

class BOQController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'product_cost' => 'required|numeric',
            'quantity' => 'required|numeric',
            'total' => 'required|numeric',
        ]);

        $boq = new BOQ();
        $boq->product_id = $request->product_id;
        $boq->product_cost = $request->product_cost;
        $boq->quantity = $request->quantity;
        $boq->total = $request->total;
        $boq->save();

        return response()->json(['message' => 'BOQ created successfully!'], 201);
    }
}