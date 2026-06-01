<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Auth\Actions\ResetPasswordAction;
use App\Application\Auth\Actions\SendPasswordResetLinkAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request, SendPasswordResetLinkAction $action): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        return response()->json([
            'status' => $action->execute($request->input('email')),
        ]);
    }

    public function reset(Request $request, ResetPasswordAction $action): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        return response()->json([
            'status' => $action->execute($request->only(
                'email',
                'password',
                'password_confirmation',
                'token',
            )),
        ]);
    }
}
