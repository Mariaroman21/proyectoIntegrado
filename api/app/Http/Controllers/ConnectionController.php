<?php
namespace App\Http\Controllers;

use App\Models\CoupleFrase;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Connection;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class ConnectionController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $connections = Connection::with(['user', 'connectedUser'])
        ->where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('connected_user_id', $user->id);
        })->get()
            ->map(function ($connection) use ($user) {
                $other = $connection->user_id === $user->id ? $connection->connectedUser : $connection->user;

                return [
                    'id' => $connection->id,
                    'type' => $connection->type,
                    'start_date' => $connection->start_date,
                    'name' => $connection->name,
                    'user' => [
                        'id' => $other->id,
                        'name' => $other->name,
                        'surname' => $other->surname,
                        'username' => $other->username,
                        'photo' => $other->photo,
                    ],
                ];
            });

        return response()->json($connections);
    }


    public function store(Request $request)
    {

        $request->validate([
            'type' => 'required|string',
            'name' => 'required|string|max:255',
            'email' => 'required|email'
        ]);

        $currentUser = auth()->user();

        $otherUser = User::where('email', $request->email)->first();

        if (!$otherUser) {
            return response()->json([
                'message' => 'El usuario con ese correo no existe.'
            ], 404);
        }

        $connection = Connection::create([
            'user_id' => $currentUser->id,
            'connected_user_id' => $otherUser->id,
            'type' => $request->type,
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'Conexión creada correctamente',
            'connection' => $connection
        ]);
    }


    public function destroy($id)
    {
        $connection = Connection::find($id);

        if (!$connection) {
            return response()->json([
                'message' => 'Conexión no encontrada'
            ], 404);
        }

        try {
            $connection->delete();

            return response()->json([
                'message' => 'Conexión eliminada correctamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la conexión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCoupleData($id)
    {
        $connection = Connection::with('plans')->findOrFail($id);

        return response()->json([
            'start_date' => $connection->start_date,
            'plans' => $connection->plans
                ? $connection->plans->map(function ($plan) {
                    return [
                        'id' => $plan->id,
                        'plan' => $plan->plan,

                    ];
                })
                : [],
        ]);
    }

    public function update(Request $request, $id)
    {
        $connection = Connection::find($id);

        if (!$connection) {
            return response()->json(['message' => 'Connection not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'plans' => 'nullable|array',
            'plans.*.plan' => 'required_with:plans|string|max:255',

        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $connection->start_date = $request->start_date;
        $connection->save();

        $connection->plans()->delete();

        if ($request->filled('plans')) {
            foreach ($request->plans as $planData) {
                $connection->plans()->create([
                    'plan' => $planData['plan'],
                    'photo' => $planData['photo'] ?? null,
                ]);
            }
        }

        return response()->json(['message' => 'Connection updated successfully.']);
    }


    public function getFrases()
    {
        $frases = CoupleFrase::pluck('frase');
        return response()->json($frases->toArray());
    }



    public function userWithConnections(Request $request)
    {
        $user = auth()->user()->load('connections.creator', 'connections.connectedUser');

        return response()->json([
            'user' => $user,
            'connections' => $user->connections,
            'connectionCount' => $user->connections->count()
        ]);
    }

    public function getConnectionsCount()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $count = Connection::where('user_id', $user->id)
            ->orWhere('connected_user_id', $user->id)
            ->count();
        return response()->json([
            'count' => $count
        ]);
    }
}
