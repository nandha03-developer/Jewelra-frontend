import type { Banner, Category, Product, SubCategory } from '@/types';
import { useAuthStore } from '@/store/authStore';


const resolveApiUrl = (path: string) => {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return new URL(path, base).toString();
};

const fetchJson = async <T>(path: string, options: RequestInit = {}) => {
  const res = await fetch(resolveApiUrl(path), {
    cache: 'no-store',
    ...options
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return (await res.json()) as T;
};

export const getCategories = async () => {
  const data = await fetchJson<any>('/api/categories?page=1&limit=100');
  return data?.categories || data?.data || [];
};

export const getSubCategories = async () => {
  const data = await fetchJson<any>('/api/subcategories?page=1&limit=500');
  return data?.subcategories || data?.data || [];
};

export const getBanners = async () => {
  const data = await fetchJson<any>('/api/banners?page=1&limit=10');
  return data?.banners || data?.data || [];
};

export const getProducts = async (page = 1, limit = 50) => {
  try {
    // Fetch products, categories, and subcategories in parallel for efficiency
    const [productsData, categories, subcategories] = await Promise.all([
      fetchJson<{ products: Product[] }>(`/api/products?page=${page}&limit=${limit}`),
      getCategories(),
      getSubCategories()
    ]);

    const catObjMap = new Map(categories.map((c: any) => [c._id, c]));
    const subObjMap = new Map(subcategories.map((s: any) => [s._id, s]));

    if (productsData && Array.isArray(productsData.products)) {
      return productsData.products.map(p => {
        // Enrich category if it's just an ID
        let categoryObj = p.category;
        if (typeof p.category === 'string' && catObjMap.has(p.category)) {
          categoryObj = catObjMap.get(p.category)! as any;
        }

        // Enrich subcategory if it's just an ID
        let subcategoryObj = p.subcategory;
        if (typeof p.subcategory === 'string' && subObjMap.has(p.subcategory)) {
          subcategoryObj = subObjMap.get(p.subcategory)! as any;
        }

        return {
          ...p,
          category: categoryObj,
          subcategory: subcategoryObj,
          image: p.image || p.images?.[0] || ''
        };
      });
    }

    return [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};

export const getMaterials = async () => {
  const data = await fetchJson<{ data: { name: string }[] }>('/api/materials?page=1&limit=10');
  return data.data || [];
};

export const getPurities = async () => {
  const data = await fetchJson<{ data: { value: string }[] }>('/api/purities?page=1&limit=10');
  return data.data || [];
};

export const submitContactForm = async (formData: { name: string; email: string; phone: string; message: string }) => {
  let token = useAuthStore.getState().token;

  // Fallback for hydration issues
  if (!token && typeof window !== 'undefined') {
    const persisted = localStorage.getItem('jewelra-auth');
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        token = parsed.state?.token;
      } catch (e) { }
    }
  }

  if (!token) {
    console.warn('Attempting to send contact form without token');
  }


  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('API Error details:', errorData);

      if (res.status === 401) {
        throw new Error('Unauthorized: Please login to send a message');
      }
      if (res.status === 403) {
        console.error('SERVER FORBIDDEN:', errorData);
        throw new Error(errorData.error || errorData.message || 'Access Forbidden: Backend blocked the request.');
      }
      throw new Error(errorData.message || errorData.error || 'Failed to submit contact form');

    }

    return await res.json();
  } catch (err: any) {
    console.error('Contact submission failed:', err);
    throw err;
  }
};

export const subscribeNewsletter = async (email: string) => {
  try {
    const res = await fetch('/api/newsletters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to subscribe to newsletter');
    }

    return await res.json();
  } catch (err: any) {
    console.error('Newsletter subscription failed:', err);
    throw err;
  }
}; export const getUserOrders = async () => {
  let token = useAuthStore.getState().token;

  if (!token && typeof window !== 'undefined') {
    const persisted = localStorage.getItem('jewelra-auth');
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        token = parsed.state?.token;
      } catch (e) { }
    }
  }

  try {
    let res = await fetch('/api/order', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (res.status === 401) {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        // console.log('Token expired on GET /api/order, refreshing...');
        const refreshRes = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken = refreshData.token;
          const newRefreshToken = refreshData.refreshToken;

          useAuthStore.getState().setToken(newToken);
          if (newRefreshToken) useAuthStore.getState().setRefreshToken(newRefreshToken);

          res = await fetch('/api/order', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`
            },
          });
        }
      }
    }

    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await res.json();
    return data || [];
  } catch (err: any) {
    console.error('Fetch orders failed:', err);
    return [];
  }
};
