<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
}, ['guards' => ['web']]);

Broadcast::channel('admin', function ($user) {
    return $user?->isAdmin();
}, ['guards' => ['web']]);
