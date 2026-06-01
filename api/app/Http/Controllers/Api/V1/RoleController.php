<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Role\Actions\CreateRoleAction;
use App\Application\Role\Actions\DeleteRoleAction;
use App\Application\Role\Actions\ListRolesAction;
use App\Application\Role\Actions\UpdateRoleAction;
use App\Application\Role\Data\CreateRoleData;
use App\Application\Role\Data\UpdateRoleData;
use App\Domain\Authorization\Enums\Permission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoleController extends Controller
{
    public function index(ListRolesAction $action): AnonymousResourceCollection
    {
        return RoleResource::collection($action->execute());
    }

    public function store(StoreRoleRequest $request, CreateRoleAction $action): RoleResource
    {
        $role = $action->execute(CreateRoleData::fromValidated($request->validated()));

        return new RoleResource($role);
    }

    public function update(
        UpdateRoleRequest $request,
        string $role,
        UpdateRoleAction $action,
    ): RoleResource {
        $updated = $action->execute((int) $role, UpdateRoleData::fromValidated($request->validated()));

        return new RoleResource($updated);
    }

    public function destroy(Request $request, string $role, DeleteRoleAction $action): JsonResponse
    {
        if (! $request->user()?->hasPermission(Permission::RolesDelete->value)) {
            return response()->json(['message' => __('auth.unauthorized')], 403);
        }

        $action->execute((int) $role);

        return response()->json(null, 204);
    }
}
