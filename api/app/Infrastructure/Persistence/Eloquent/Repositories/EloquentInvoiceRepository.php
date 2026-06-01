<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Application\Contracts\Repositories\InvoiceRepositoryInterface;
use App\Domain\WorkOrder\Enums\WorkOrderStatus;
use App\Infrastructure\Persistence\Eloquent\Models\Invoice;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EloquentInvoiceRepository implements InvoiceRepositoryInterface
{
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return Invoice::query()
            ->with('workOrder.car')
            ->latest()
            ->paginate($perPage);
    }

    public function findById(int $id): ?Invoice
    {
        return Invoice::query()->find($id);
    }

    public function create(array $attributes): Invoice
    {
        return DB::transaction(function () use ($attributes) {
            $invoice = Invoice::query()->create($attributes);

            $invoice->workOrder()->update([
                'status' => WorkOrderStatus::Completed->value,
            ]);

            return $invoice->load('workOrder.car');
        });
    }

    public function update(Invoice $invoice, array $attributes): Invoice
    {
        $invoice->update($attributes);

        return $invoice->fresh('workOrder.car');
    }

    public function delete(Invoice $invoice): void
    {
        $invoice->delete();
    }
}
