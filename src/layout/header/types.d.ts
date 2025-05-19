interface AuthButtonsProps {
  isLoggedIn: boolean;
  toggleMenu: () => void;
}

interface NavigationMenuProps {
  isLoggedIn: boolean;
  toggleMenu: () => void;
}

interface NavItemsProps {
  handleNavigation: (path: string, state?: { from: string }) => void;
}

interface MenuItemsProps {
  isLoggedIn: boolean;
  handleNavigation: (path: string, state?: { from: string }) => void;
}

interface SideMenuProps {
  isLoggedIn: boolean;
}

interface UserProfileProps {
  userInfo?: UserType;
  parsedData?: ParsedDataType;
}
interface UserType {
  fullName: string;
}

interface ParsedDataType {
  name?: string;
}
interface NavigationMenuProps {
  isLoggedIn: boolean;
  toggleMenu: () => void;
  toggleNotifications: () => void;
  unseenCount: number;
}

interface NavItemsProps {
  handleNavigation: (path: string, state?: { from: string }) => void;
  toggleNotifications: () => void;
  unseenCount: number;
}

interface MenuItemsProps {
  isLoggedIn: boolean;
  handleNavigation: (path: string, state?: { from: string }) => void;
}
interface NotificationAuthor {
  fullName: string;
  image: string;
  _id: string;
}

interface NotificationLike {
  post: {
    _id: string;
    channel: string;
  };
}

interface NotificationComment {
  post: {
    _id: string;
    channel: string;
  };
}

interface NotificationMessage {
  from: string;
  to: string;
  content: string;
  createdAt: string;
  author: {
    _id: string;
  };
}

interface Notification {
  seen: boolean;
  author: NotificationAuthor;
  createdAt: string;
  like?: NotificationLike;
  comment?: NotificationComment;
  message?: NotificationMessage;
  post?: string;
  _id: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  isLoading: boolean;
  onClose: () => void;
  onMarkAllAsSeen: () => void;
  unseenCount: number;
  toggleMenu: () => void;
}
