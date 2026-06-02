<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Application\Central\Tenancy\Actions\CreateCentralTenantUserAction;
use App\Application\Central\Tenancy\Actions\ListCentralTenantRolesAction;
use App\Application\Central\Tenancy\Actions\ListCentralTenantUsersAction;
use App\Application\Central\Tenancy\Actions\ResetCentralTenantUserPasswordAction;
use App\Application\User\Data\CreateUserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Central\CentralResetTenantUserPasswordRequest;
use App\Http\Requests\Central\CentralStoreTenantUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

class CentralTenantUserController extends Controller
{
    public function index(string $tenant, ListCentralTenantUsersAction $action): JsonResponse
    {
        $paginator = $action->execute($tenant);

        return response()->json([
            'data' => UserResource::collection($paginator->getCollection())->resolve(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function roles(string $tenant, ListCentralTenantRolesAction $action): JsonResponse
    {
        $roles = $action->execute($tenant);

        return response()->json(
            $roles->map(fn ($role) => [
                'id' => $role->id,
                'slug' => $role->slug,
                'name' => $role->name,
                'name_ar' => $role->name_ar,
            ])->values(),
        );
    }

    public function store(
        string $tenant,
        CentralStoreTenantUserRequest $request,
        CreateCentralTenantUserAction $action,
    ): JsonResponse {
        $user = $action->execute($tenant, CreateUserData::fromValidated($request->validated()));

        return response()->json((new UserResource($user))->resolve(), 201);
    }

    public function resetPassword(
        string $tenant,
        int $user,
        CentralResetTenantUserPasswordRequest $request,
        ResetCentralTenantUserPasswordAction $action,
    ): JsonResponse {
        $updated = $action->execute($tenant, $user, (string) $request->validated('password'));

        return response()->json((new UserResource($updated))->resolve());
    }
}
