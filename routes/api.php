<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MaterialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductMaterialController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BOQController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);


    Route::get('/dashboard', [DashboardController::class, 'index']);
});

Route::post('/product_materials', [MaterialController::class, 'store']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/product_materials', [ProductMaterialController::class, 'index']);
Route::get('/product_materials/search', [ProductMaterialController::class, 'search']);
Route::post('/products', [ProductController::class, 'store']);
Route::post('/boqs', [BOQController::class, 'store']);
Route::get('/products', [ProductController::class, 'index']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/product_materials', [ProductMaterialController::class, 'update']);