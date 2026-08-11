<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProgramEnrollmentUpdated implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public int $userId;

    public ?int $programId;

    public string $programName;

    public string $status;

    public float $progress;

    public string $action;

    public function __construct(int $userId, ?int $programId, string $programName, string $status, float $progress = 0.0, string $action = 'created')
    {
        $this->userId = $userId;
        $this->programId = $programId;
        $this->programName = $programName;
        $this->status = $status;
        $this->progress = $progress;
        $this->action = $action;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->userId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ProgramEnrollmentUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'userId' => $this->userId,
            'programId' => $this->programId,
            'programName' => $this->programName,
            'status' => $this->status,
            'progress' => $this->progress,
            'action' => $this->action,
        ];
    }
}
