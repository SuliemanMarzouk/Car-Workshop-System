<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Application\Setting\Actions\GetSettingsAction;
use App\Application\Setting\Actions\GetWorkshopConfigAction;
use App\Application\Setting\Actions\UpdateSettingsAction;
use App\Application\Setting\Data\UpdateSettingsData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Setting\UpdateSettingsRequest;
use App\Http\Resources\SettingsResource;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function index(GetSettingsAction $action): SettingsResource
    {
        return new SettingsResource($action->execute());
    }

    public function update(UpdateSettingsRequest $request, UpdateSettingsAction $action): SettingsResource
    {
        $settings = $action->execute(UpdateSettingsData::fromValidated($request->validated()));

        return new SettingsResource($settings);
    }

    public function workshop(GetWorkshopConfigAction $action): JsonResponse
    {
        return response()->json($action->execute());
    }
}
