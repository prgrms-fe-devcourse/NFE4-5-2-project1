export interface MenuItem {
  id: string;
  icon: React.ReactNode;
  iconActive?: React.ReactNode;
  text: string;
  path: string;
  isSearchTrigger?: boolean;
}
