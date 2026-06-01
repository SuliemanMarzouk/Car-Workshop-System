<?php

declare(strict_types=1);

namespace App\Application\WorkOrder\Listeners;

use App\Application\Contracts\Repositories\SettingRepositoryInterface;
use App\Domain\WorkOrder\Events\WorkOrderApproved;
use Illuminate\Support\Facades\Log;

class HandleWorkOrderApproved
{
    public function __construct(
        private readonly SettingRepositoryInterface $settings,
    ) {}

    public function handle(WorkOrderApproved $event): void
    {
        $workOrder = $event->workOrder->loadMissing(['car', 'items']);

        if ($this->settings->get('email_notifications', true)) {
            Log::info('Work order approved — invoice can be created.', [
                'work_order_id' => $workOrder->id,
                'approved_by' => $event->approvedBy,
                'car_id' => $workOrder->car_id,
            ]);
        }

        if ($this->settings->get('sms_notifications', false)) {
            Log::info('Work order approved — SMS notification queued.', [
                'work_order_id' => $workOrder->id,
            ]);
        }
    }
}
