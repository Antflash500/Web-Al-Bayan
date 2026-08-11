<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentStatusUpdated implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public int $userId;

    public string $kodeTransaksi;

    public string $oldStatus;

    public string $newStatus;

    public ?string $paidAt;

    public function __construct(int $userId, string $kodeTransaksi, string $oldStatus, string $newStatus, ?string $paidAt = null)
    {
        $this->userId = $userId;
        $this->kodeTransaksi = $kodeTransaksi;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
        $this->paidAt = $paidAt;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->userId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'PaymentStatusUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'userId' => $this->userId,
            'kodeTransaksi' => $this->kodeTransaksi,
            'oldStatus' => $this->oldStatus,
            'newStatus' => $this->newStatus,
            'paidAt' => $this->paidAt,
        ];
    }
}
