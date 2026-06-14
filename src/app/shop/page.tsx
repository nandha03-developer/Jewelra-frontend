import { getProducts } from '@/utils/api';
import ShopBrowser from '@/components/shop/ShopBrowser';

export default async function ShopPage() {
  const products = await getProducts(1, 100);

  return (
    <ShopBrowser
      products={products}
      title="Shop premium jewellery"
      subtitle="Browse the latest premium collections, festive pieces, engagement rings and statement gold jewellery."
    />
  );
}
