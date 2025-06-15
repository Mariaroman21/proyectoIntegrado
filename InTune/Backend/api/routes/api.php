<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConnectionController;
use Illuminate\Support\Facades\Route;


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getAuthenticatedUser']);
    Route::middleware('auth:api')->post('/new', [ConnectionController::class, 'store']);

    Route::prefix('connections')->group(function () {
        Route::get('/', [ConnectionController::class, 'index']);
        Route::get('/count', [ConnectionController::class, 'getConnectionsCount']);
        Route::delete('/{id}', [ConnectionController::class, 'destroy']);
        Route::get('/couples/{id}', [ConnectionController::class, 'getCoupleData']);
        Route::put('/couples/{id}', [ConnectionController::class, 'update']);    });
//Route::get('/user-with-connections', [ConnectionController::class, 'userWithConnections']);


});



