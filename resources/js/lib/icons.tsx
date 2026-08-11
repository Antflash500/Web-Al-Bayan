import {
    Award,
    Book,
    BookOpen,
    GraduationCap,
    Heart,
    Home,
    MapPin,
    MessageCircle,
    Phone,
    Users,
    Wrench,
    type LucideIcon,
} from 'lucide-react';

const ICON_MAP = {
    mosque: GraduationCap,
    map: MapPin,
    home: Home,
    book: Book,
    user: Users,
    wrench: Wrench,
    users: Users,
    heart: Heart,
    award: Award,
    phone: Phone,
    whatsapp: MessageCircle,
    bookopen: BookOpen,
} as const;

export type IconName = keyof typeof ICON_MAP;

export function getIcon(name: string): LucideIcon {
    return ICON_MAP[name as IconName] ?? Users;
}

export { ICON_MAP };
