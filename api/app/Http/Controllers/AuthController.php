<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request){


        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'surname' => 'required|string',
            'lastname' => 'required|string',
            'birthdate' => 'required|date',
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);
        //falta por si falla
    if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);


    }else {

            $user = User::create([
                'name' => $request->name,
                'surname' => $request->surname,
                'lastname' => $request->lastname,
                'birthdate' => $request->birthdate,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);


            $token = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Usuario registrado correctamente',
                'user' => $user,
                'token' => $token,
            ], 201);
        }
    }


    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['message' => 'Usuario o contraseña incorrecto'], 401);
        }

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'token' => $token,
            'user' => auth('api')->user(),
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Sesión cerrada con éxito'],200);
    }


    public function profile()
    {
        return response()->json(auth()->user());
    }

    public function getAuthenticatedUser()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'user_not_found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'invalid_token'], 401);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profilePhoto' => $user->profile_photo_url ?? null,
            
        ]);
    }

}
