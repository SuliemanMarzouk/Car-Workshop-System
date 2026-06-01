<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Auth\Actions\LoginUserAction;
use App\Application\Auth\Actions\LogoutUserAction;
use App\Application\Auth\Actions\RegisterUserAction;
use App\Application\Auth\Data\LoginCredentials;
use App\Application\Auth\Data\RegisterUserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, RegisterUserAction $action): JsonResponse
    {
        $payload = $action->execute(RegisterUserData::fromValidated($request->validated()));

        return response()->json($payload, 201);
    }

    public function login(LoginRequest $request, LoginUserAction $action): JsonResponse
    {
        return response()->json(
            $action->execute(LoginCredentials::fromValidated($request->validated())),
        );
    }

    public function logout(Request $request, LogoutUserAction $action): JsonResponse
    {
        $action->execute($request->user());

        return response()->json([
            'message' => __('auth.logged_out'),
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
