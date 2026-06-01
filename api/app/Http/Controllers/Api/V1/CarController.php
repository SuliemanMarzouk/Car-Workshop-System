<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Car\Actions\CreateCarAction;
use App\Application\Car\Actions\DeleteCarAction;
use App\Application\Car\Actions\GetCarAction;
use App\Application\Car\Actions\ListCarsAction;
use App\Application\Car\Actions\UpdateCarAction;
use App\Application\Car\Data\CreateCarData;
use App\Application\Car\Data\UpdateCarData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Car\StoreCarRequest;
use App\Http\Requests\Car\UpdateCarRequest;
use App\Http\Resources\CarResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CarController extends Controller
{
    public function index(ListCarsAction $action): AnonymousResourceCollection
    {
        return CarResource::collection($action->execute());
    }

    public function store(StoreCarRequest $request, CreateCarAction $action): CarResource
    {
        $car = $action->execute(CreateCarData::fromValidated($request->validated()));

        return new CarResource($car);
    }

    public function show(int $car, GetCarAction $action): CarResource
    {
        return new CarResource($action->execute($car));
    }

    public function update(UpdateCarRequest $request, int $car, UpdateCarAction $action): CarResource
    {
        $updated = $action->execute($car, UpdateCarData::fromValidated($request->validated()));

        return new CarResource($updated);
    }

    public function destroy(int $car, DeleteCarAction $action): JsonResponse
    {
        $action->execute($car);

        return response()->json(null, 204);
    }
}
