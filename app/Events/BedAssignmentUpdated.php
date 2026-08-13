<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BedAssignmentUpdated implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public int $userId;

    public ?int $kamarId;

    public ?int $ranjangId;

    public ?int $kasurId;

    public ?string $kamarNomor;

    public ?string $ranjangNomor;

    public ?string $posisi;

    public string $status;

    public string $action;

    public function __construct(
        int $userId,
        ?int $kamarId,
        ?int $ranjangId,
        ?int $kasurId,
        ?string $kamarNomor,
        ?string $ranjangNomor,
        ?string $posisi,
        string $status = 'assigned',
        string $action = 'assigned'
    ) {
        $this->userId = $userId;
        $this->kamarId = $kamarId;
        $this->ranjangId = $ranjangId;
        $this->kasurId = $kasurId;
        $this->kamarNomor = $kamarNomor;
        $this->ranjangNomor = $ranjangNomor;
        $this->posisi = $posisi;
        $this->status = $status;
        $this->action = $action;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->userId}"),
            new PrivateChannel('admin'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'BedAssignmentUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'userId' => $this->userId,
            'kamarId' => $this->kamarId,
            'ranjangId' => $this->ranjangId,
            'kasurId' => $this->kasurId,
            'kamarNomor' => $this->kamarNomor,
            'ranjangNomor' => $this->ranjangNomor,
            'posisi' => $this->posisi,
            'status' => $this->status,
            'action' => $this->action,
        ];
    }
}
