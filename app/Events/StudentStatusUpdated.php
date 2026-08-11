<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StudentStatusUpdated implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public int $userId;

    public string $status;

    public ?string $lastActivityAt;

    public function __construct(int $userId, string $status, ?string $lastActivityAt = null)
    {
        $this->userId = $userId;
        $this->status = $status;
        $this->lastActivityAt = $lastActivityAt;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->userId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'StudentStatusUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'userId' => $this->userId,
            'status' => $this->status,
            'lastActivityAt' => $this->lastActivityAt,
        ];
    }
}
