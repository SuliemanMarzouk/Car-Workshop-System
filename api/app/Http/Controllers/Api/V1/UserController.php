<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\User\Actions\CreateUserAction;
use App\Application\User\Actions\DeleteUserAction;
use App\Application\User\Actions\ListUsersAction;
use App\Application\User\Actions\UpdateUserAction;
use App\Application\User\Data\CreateUserData;
use App\Application\User\Data\UpdateUserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function index(ListUsersAction $action): AnonymousResourceCollection
    {
        return UserResource::collection($action->execute());
    }

    public function store(StoreUserRequest $request, CreateUserAction $action): UserResource
    {
        $user = $action->execute(CreateUserData::fromValidated($request->validated()));

        return new UserResource($user);
    }

    public function update(
        UpdateUserRequest $request,
        string $user,
        UpdateUserAction $action,
    ): UserResource {
        $updated = $action->execute(
            (int) $user,
            UpdateUserData::fromValidated($request->validated()),
            $request->user(),
        );

        return new UserResource($updated);
    }

    public function destroy(Request $request, string $user, DeleteUserAction $action): JsonResponse
    {
        if (! $request->user()?->hasPermission('users.delete')) {
            return response()->json(['message' => __('auth.unauthorized')], 403);
        }

        $action->execute((int) $user, $request->user());

        return response()->json(null, 204);
    }
}
