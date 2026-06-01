<?php

declare(strict_types=1);

namespace App\Domain\WorkOrder\Events;

use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkOrderApproved
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly WorkOrder $workOrder,
        public readonly int $approvedBy,
    ) {}
}
