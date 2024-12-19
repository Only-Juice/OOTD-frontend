// src/types.ts

export interface SearchProduct {
  PageCount: number;
  Products: Product[];
}
export interface Product {
  ID: number;
  Name: string;
  Description: string;
  Price: number;
  Quantity: number;
  Images: string[];
}

export interface User {
  UID: number;
  Username: string;
  Exp: string;
}

export interface UserInfo {
  Username: string;
  Email: string;
  Address: string;
  IsAdministrator: boolean;
  HaveStore: boolean;
}

export interface SearchResultsProps {
  searchResults: Product[]
  searchError: string|null;
}


export interface NavBarProps {
  theme: 'light'|'dark';
  setIsModalOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
  handleLogout: () => void;
}

export interface UserBadgeProps {
  username: string;
  size?: number;
}

export interface UserInfo {
  Username: string;
  Email: string;
  Address: string;
  IsAdministrator: boolean;
  HaveStore: boolean;
}

export interface LoginProps {
  isModalOpen: boolean|undefined;
  setIsModalOpen: (isOpen: boolean) => void;
}

export interface Store {
  Description: string;
  Name: string;
  OwnerUsername: string;
  StoreID: number;
}
