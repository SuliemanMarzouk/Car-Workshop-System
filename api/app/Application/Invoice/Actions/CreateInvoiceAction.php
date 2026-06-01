<?php

namespace App\Application\Invoice\Actions;

use App\Application\Contracts\Repositories\InvoiceRepositoryInterface;
use App\Application\Invoice\Data\CreateInvoiceData;
use App\Infrastructure\Persistence\Eloquent\Models\Invoice;

class CreateInvoiceAction
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $invoices,
    ) {}

    public function execute(CreateInvoiceData $data): Invoice
    {
        return $this->invoices->create($data->toAttributes());
    }
}
