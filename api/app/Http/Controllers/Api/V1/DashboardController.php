<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Dashboard\Actions\GetDashboardStatsAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(GetDashboardStatsAction $action): JsonResponse
    {
        return response()->json($action->execute());
    }
}
