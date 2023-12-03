import { HelpCircle, Home, Settings, User, MessageSquare } from "lucide-react";

export const links = [
  {
    label: 'Home',
    url: '/',
    auth: false,
    icon: <Home />
  },
  {
    label: 'About',
    url: '/about',
    auth: false,
    icon: <HelpCircle />
  },
  {
    label: 'Chat',
    url: '/chat',
    auth: true,
    icon: <MessageSquare />
  },
  {
    label: 'Profile',
    url: '/u',
    auth: true,
    icon: <User />
  },
  {
    label: 'Settings',
    url: '/settings',
    auth: true,
    icon: <Settings />
  }
];

export const mobileLinks = [
  {
    label: 'Home',
    url: '/',
    auth: false,
    icon: <Home />
  },
  {
    label: 'About',
    url: '/about',
    auth: false,
    icon: <HelpCircle />
  },
  {
    label: 'Chat',
    url: '/chat',
    auth: true,
    icon: <MessageSquare />
  },
  {
    label: 'Settings',
    url: '/settings',
    auth: true,
    icon: <Settings />
  }
];