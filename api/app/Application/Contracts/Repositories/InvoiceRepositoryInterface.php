<?php

namespace App\Application\Contracts\Repositories;

use App\Infrastructure\Persistence\Eloquent\Models\Invoice;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface InvoiceRepositoryInterface
{
    public function paginate(int $perPage = 10): LengthAwarePaginator;

    public function findById(int $id): ?Invoice;

    public function create(array $attributes): Invoice;

    public function update(Invoice $invoice, array $attributes): Invoice;

    public function delete(Invoice $invoice): void;
}
