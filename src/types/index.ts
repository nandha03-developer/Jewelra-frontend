export interface Category {
  _id: string;
  name: string;
  displayName?: string;
  description?: string;
  image?: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  displayName?: string;
  category: string | { _id: string; name: string; displayName?: string };
  image?: string;
  slug?: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  ctaLabel: string;
  ctaLink: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string | { _id: string; name: string; displayName?: string };
  subcategory: string | { _id: string; name: string; displayName?: string };
  material: string | { _id: string; name: string; value?: string };
  purity: string | { _id: string; name: string; value?: string };
  weight: number;
  makingCharge: number;
  price: number;
  stock: number;
  images: string[];
  image: string; // Keep this as primary image for UI ease
  description?: string;
  status: 'active' | 'inactive';
  rating?: number;
  discount?: number;
  quantity?: number;
  isPopular?: boolean;
  isNew?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  category: {
    _id: string;
    name: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
}

export interface NewsletterPayload {
  email: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  helpfulCount: number;
  images?: string[];
  isVerified: boolean;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}
