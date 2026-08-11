import { useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;

const REVERB_KEY = import.meta.env.VITE_REVERB_KEY ?? '';
const REVERB_PORT = Number(import.meta.env.VITE_REVERB_PORT ?? 8080);
const HEARTBEAT_INTERVAL = 45000;

let echo: Echo<'reverb'> | null = null;

export function getEcho(): Echo<'reverb'> | null {
    if (typeof window === 'undefined') return null;
    if (echo) return echo;

    echo = new Echo({
        broadcaster: 'reverb',
        key: REVERB_KEY,
        wsHost: window.location.hostname,
        wsPort: REVERB_PORT,
        forceTLS: false,
        enabledTransports: ['ws'],
        authEndpoint: '/broadcasting/auth',
        authWithCredentials: true,
    } as never);

    return echo;
}

export interface RealtimeOptions {
    userId?: number | null;
    isAdmin?: boolean;
    events?: string[];
    reloadProps?: string[];
}

export function useRealtime(options: RealtimeOptions): void {
    const { userId, isAdmin, events = [], reloadProps } = options;
    const { url } = usePage();

    const eventsKey = events.join(',');
    const reloadKey = reloadProps?.join(',') ?? '';

    useEffect(() => {
        const e = getEcho();
        if (!e) return;

        const channelNames: string[] = [];

        const reload = () => {
            if (reloadProps?.length) {
                router.reload({ only: reloadProps });
            } else {
                router.reload();
            }
        };

        if (userId) {
            const channelName = `private-user.${userId}`;
            const userChannel = e.private(channelName);
            channelNames.push(channelName);

            const userEvents = [
                'StudentStatusUpdated',
                'PaymentStatusUpdated',
                'ProgramEnrollmentUpdated',
                'BedAssignmentUpdated',
            ];

            userEvents.forEach((eventName) => {
                if (events.length === 0 || events.includes(eventName)) {
                    userChannel.listen(`.${eventName}`, () => reload());
                }
            });
        }

        if (isAdmin) {
            const adminChannelName = 'private-admin';
            const adminChannel = e.private(adminChannelName);
            channelNames.push(adminChannelName);

            const adminEvents = ['BedAssignmentUpdated', 'RoomUpdated'];

            adminEvents.forEach((eventName) => {
                if (events.length === 0 || events.includes(eventName)) {
                    adminChannel.listen(`.${eventName}`, () => reload());
                }
            });

            const albayanChannelName = 'albayan';
            const albayanChannel = e.channel(albayanChannelName);
            channelNames.push(albayanChannelName);

            albayanChannel.listen('.data.changed', () => reload());
        }

        return () => {
            channelNames.forEach((name) => {
                e.leave(name);
            });
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, isAdmin, eventsKey, reloadKey, url]);
}

export function useHeartbeat(userId?: number | null): void {
    useEffect(() => {
        if (!userId) return;

        const ping = () => {
            // Plain JSON API — must NOT go through the Inertia router,
            // otherwise Inertia shows "plain JSON response" popups each ping.
            const cookie = document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='));
            const token = cookie ? decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) : '';

            axios
                .post('/siswa/heartbeat', {}, {
                    headers: {
                        'X-XSRF-TOKEN': token,
                        Accept: 'application/json',
                    },
                })
                .catch(() => {});
        };

        ping();

        const interval = setInterval(ping, HEARTBEAT_INTERVAL);

        return () => clearInterval(interval);
    }, [userId]);
}
