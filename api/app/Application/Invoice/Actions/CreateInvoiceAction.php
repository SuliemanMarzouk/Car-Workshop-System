<?php

namespace App\Application\Invoice\Actions;

use App\Application\Contracts\Repositories\InvoiceRepositoryInterface;
use App\Application\Invoice\Data\CreateInvoiceData;
use App\Application\Invoice\Services\InvoiceTotalsCalculator;
use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use App\Infrastructure\Persistence\Eloquent\Models\Invoice;
use App\Infrastructure\Persistence\Eloquent\Models\WorkOrder;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class CreateInvoiceAction
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $invoices,
        private readonly InvoiceTotalsCalculator $totalsCalculator,
    ) {}

    public function execute(CreateInvoiceData $data): Invoice
    {
        $workOrder = WorkOrder::query()
            ->with(['items', 'invoice', 'car'])
            ->find($data->workOrderId);

        if ($workOrder === null) {
            throw ValidationException::withMessages([
                'work_order_id' => [__('The selected work order does not exist.')],
            ]);
        }

        if ($workOrder->status !== WorkOrderStatus::Approved->value) {
            throw ValidationException::withMessages([
                'work_order_id' => [__('Only approved work orders can be invoiced.')],
            ]);
        }

        if ($workOrder->invoice !== null) {
            throw ValidationException::withMessages([
                'work_order_id' => [__('This work order already has an invoice.')],
            ]);
        }

        try {
            $totals = $this->totalsCalculator->fromWorkOrder($workOrder, $data->discountAmount);
        } catch (InvalidArgumentException $exception) {
            throw ValidationException::withMessages([
                'work_order_id' => [$exception->getMessage()],
            ]);
        }

        return $this->invoices->create([
            'work_order_id' => $workOrder->id,
            'bill_to_name' => $data->billToName,
            'bill_to_address' => $data->billToAddress,
            'discount_amount' => $totals['discount_amount'],
            'subtotal' => $totals['subtotal'],
            'tax' => $totals['tax'],
            'total' => $totals['total'],
            'notes' => $data->notes,
        ]);
    }
}
