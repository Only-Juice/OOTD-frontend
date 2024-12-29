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
  Sale?: number;
  StoreID: number;
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
  isPendingUserInfo: boolean;
  dataUserInfo: UserInfo;
  refetchUserInfo: () => void;
}

export interface UserBadgeProps {
  username: string;
  size?: number;
}

export interface LoginProps {
  isModalOpen: boolean|undefined;
  setIsModalOpen: (isOpen: boolean) => void;
  refetchUserInfo: () => void;
  dataUserInfo: UserInfo;
}

export interface Store {
  Description: string;
  Name: string;
  OwnerUsername: string;
  StoreID: number;
}

export interface SearchStoresResponse {
  PageCoint: number;
  Stores: Store[];
}

export interface RatingResult {
  Username: string;
  Rating: number;
  CreatedAt: string;
}

export interface Coupon {
  CouponID: number;
  Name: string;
  Description: string;
  Discount: number;
  StartDate: string;
  ExpireDate: string;
  Enabled: boolean;
}

export interface ProductInCart {
  key: React.Key;
  ID: number;
  Name: string;
  Images: string[];
  Price: number;
  Quantity: number;
  Description: string;
}
