import { getProducts } from '@/utils/api';
import ShopBrowser from '@/components/shop/ShopBrowser';

interface SubCategoryPageProps {
  params: Promise<{ category: string; subCategory: string }>;
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { category: rawCategory, subCategory: rawSubCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const subCategory = decodeURIComponent(rawSubCategory);

  const products = await getProducts(1, 100); // Fetch first 100 on server
  
  return (
    <ShopBrowser
      products={products}
      title={subCategory.replace(/-/g, ' ')}
      subtitle={`Selected styles for the ${subCategory.replace(/-/g, ' ')} collection.`}
      initialCategory={category}
      initialSubCategory={subCategory}
    />
  );
}
