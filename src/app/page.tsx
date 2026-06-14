import { getBanners, getCategories, getProducts } from '@/utils/api';
import HeroSlider from '@/components/home/HeroSlider';
import VideoSlider from '@/components/home/VideoSlider';
import Celebration from '@/components/home/Celebration';
import Benefit from '@/components/home/Benefit';
import Shop from '@/components/home/Shop';
import ShopCategory from '@/components/home/ShopCategory';
import DiamondHighlight from '@/components/home/DiamondHighlight';

export default async function HomePage() {
  const [banners, categories, products] = await Promise.all([getBanners(), getCategories(), getProducts()]);


  return (
    <>
      <HeroSlider banners={[...banners].reverse()} />
      <div className="px-0 md:px-4 lg:px-8">
        <ShopCategory />
        <Shop />
        <DiamondHighlight />
        <Benefit props="" />
        <Celebration />
        <VideoSlider />
      </div>
    </>
  );
}
