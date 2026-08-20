<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to the Estele E-Commerce API Backend.',
        'status' => 'healthy',
        'frontend_url' => env('FRONTEND_URL', 'https://estele.vercel.app')
    ]);
});
