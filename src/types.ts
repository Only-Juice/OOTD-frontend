// src/types.ts
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
  user: {Username: string}|null;
  theme: 'light'|'dark';
  setIsModalOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
  handleLogout: () => void;
}

export interface ProductSliderProps {
  products: Product[];
}

export interface UserBadgeProps {
  username: string;
}

export interface UserInfo {
  Username: string;
  Email: string;
  Address: string;
  IsAdministrator: boolean;
  HaveStore: boolean;
}

export interface LoginProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fetchUserInfo: (token: string) => void;
}