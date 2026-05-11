import { Suspense } from 'react';
import Component from '@/components/pages/CategoryPage';
import GetAllPages from '@/components/pages/GetAllPages';
import GetAllMenus from '@/components/cms/menus/GetAllMenus';
import GetAllProducts from '@/lib/GetAllDetails/GetAllProducts';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Shop...</div>}>
      <GetAllPages />
      <GetAllMenus />
      <GetAllProducts />
      <Component />
    </Suspense>
  );
}
