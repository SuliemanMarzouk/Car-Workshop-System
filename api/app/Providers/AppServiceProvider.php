<?php

namespace App\Providers;

use App\Application\Authorization\Contracts\AuthorizerInterface;
use App\Application\WorkOrder\Listeners\HandleWorkOrderApproved;
use App\Domain\WorkOrder\Events\WorkOrderApproved;
use App\Infrastructure\Authorization\PermissionAuthorizer;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthorizerInterface::class, PermissionAuthorizer::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Schema::defaultStringLength(191);

        Event::listen(WorkOrderApproved::class, HandleWorkOrderApproved::class);

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url', 'http://localhost:5173') . "/reset-password?token={$token}&email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
