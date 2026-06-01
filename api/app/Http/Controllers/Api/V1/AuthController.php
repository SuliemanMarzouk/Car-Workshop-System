<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Auth\Actions\GetAuthenticatedUserAction;
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
    public function register(
        RegisterRequest $request,
        RegisterUserAction $action,
        GetAuthenticatedUserAction $profile,
    ): JsonResponse {
        $payload = $action->execute(RegisterUserData::fromValidated($request->validated()));

        return response()->json([
            'access_token' => $payload['access_token'],
            'token_type' => $payload['token_type'],
            'user' => $profile->execute($payload['user'])->toArray(),
        ], 201);
    }

    public function login(
        LoginRequest $request,
        LoginUserAction $action,
        GetAuthenticatedUserAction $profile,
    ): JsonResponse {
        $payload = $action->execute(LoginCredentials::fromValidated($request->validated()));

        return response()->json([
            'access_token' => $payload['access_token'],
            'token_type' => $payload['token_type'],
            'user' => $profile->execute($payload['user'])->toArray(),
        ]);
    }

    public function logout(Request $request, LogoutUserAction $action): JsonResponse
    {
        $action->execute($request->user());

        return response()->json([
            'message' => __('auth.logged_out'),
        ]);
    }

    public function user(Request $request, GetAuthenticatedUserAction $action): JsonResponse
    {
        return response()->json(
            $action->execute($request->user())->toArray(),
        );
    }
}
