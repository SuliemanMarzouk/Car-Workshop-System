<?php

namespace App\Application\Invoice\Actions;

use App\Application\Contracts\Repositories\InvoiceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListInvoicesAction
{
    public function __construct(
        private readonly InvoiceRepositoryInterface $invoices,
    ) {}

    public function execute(int $perPage = 10): LengthAwarePaginator
    {
        return $this->invoices->paginate($perPage);
    }
}
