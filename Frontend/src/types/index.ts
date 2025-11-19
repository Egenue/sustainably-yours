export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  description: string;
  sustainabilityScore: number;
  ratings: Rating[];
  averageRating: number;
  price: number;
  certifications: string[];
}

export interface Business {
  id: string;
  name: string;
  description: string;
  logo: string;
  sustainabilityScore: number;
  categories: string[];
  location: string;
  website: string;
  ratings: Rating[];
  averageRating: number;
}

export interface Rating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  aspects: {
    materials: number;
    packaging: number;
    carbonFootprint: number;
    laborPractices: number;
  };
}

export type UserRole = "buyer" | "seller";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}
