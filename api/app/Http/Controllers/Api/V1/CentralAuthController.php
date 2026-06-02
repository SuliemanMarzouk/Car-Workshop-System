<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Application\Central\Auth\Actions\CentralLoginAction;
use App\Application\Central\Auth\Actions\LogoutCentralUserAction;
use App\Application\Central\Auth\Data\CentralLoginCredentials;
use App\Http\Controllers\Controller;
use App\Http\Requests\Central\CentralLoginRequest;
use App\Infrastructure\Persistence\Eloquent\Models\CentralUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CentralAuthController extends Controller
{
    public function login(CentralLoginRequest $request, CentralLoginAction $action): JsonResponse
    {
        $payload = $action->execute(
            CentralLoginCredentials::fromValidated($request->validated()),
        );

        /** @var CentralUser $user */
        $user = $payload['user'];

        return response()->json([
            'access_token' => $payload['access_token'],
            'token_type' => $payload['token_type'],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(Request $request, LogoutCentralUserAction $action): JsonResponse
    {
        /** @var CentralUser $user */
        $user = $request->user();
        $action->execute($user);

        return response()->json([
            'message' => __('auth.logged_out'),
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        /** @var CentralUser $user */
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }
}
