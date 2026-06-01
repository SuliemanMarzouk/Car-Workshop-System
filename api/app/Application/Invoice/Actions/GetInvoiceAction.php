<?php

namespace App\Application\Invoice\Actions;

use App\Application\Contracts\Repositories\InvoiceRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Models\Invoice;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class GetInvoiceAction
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $invoices,
    ) {}

    public function execute(int $id): Invoice
    {
        $invoice = $this->invoices->findById($id);

        if ($invoice === null) {
            throw new NotFoundHttpException(__('Invoice not found.'));
        }

        return $invoice->load(['workOrder.car', 'workOrder.items']);
    }
}
