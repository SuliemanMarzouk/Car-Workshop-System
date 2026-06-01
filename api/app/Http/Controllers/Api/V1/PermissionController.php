<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Role\Actions\ListPermissionsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PermissionController extends Controller
{
    public function index(ListPermissionsAction $action): AnonymousResourceCollection
    {
        return PermissionResource::collection($action->execute());
    }
}
