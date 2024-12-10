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

export interface SearchProps {
  setResults: (results: Product[]) => void;
  setError: (error: string|null) => void;
}

export interface SearchResultsProps {
  searchResults: Array<{
    ID: string; Name: string; Description: string; Price: number;
    Quantity: number;
    Images: string[];
  }>;
  searchError: string|null;
}

export interface HomeProps {
  products: Product[];
}

export interface NavBarProps {
  user: {Username: string}|null;
  theme: 'light'|'dark';
  setIsModalOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
  handleLogout: () => void;
  setResults: (results: Product[]) => void;
  setError: (error: string|null) => void;
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