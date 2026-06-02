<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Application\Central\Dashboard\Actions\GetCentralStatsAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CentralDashboardController extends Controller
{
    public function stats(GetCentralStatsAction $action): JsonResponse
    {
        return response()->json($action->execute());
    }
}
