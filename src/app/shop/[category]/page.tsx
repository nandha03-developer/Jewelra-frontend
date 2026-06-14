import { getProducts } from '@/utils/api';
import ShopBrowser from '@/components/shop/ShopBrowser';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  
  const products = await getProducts(1, 100);
  
  return (
    <ShopBrowser
      products={products}
      title={category.replace(/-/g, ' ')}
      subtitle={`Browse premium jewellery selected for ${category.replace(/-/g, ' ')} lovers.`}
      initialCategory={category}
    />
  );
}
