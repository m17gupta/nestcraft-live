import Component from '@/components/pages/FAQPage';
import { getPageData } from '@/lib/getPageData';

export default async function Page() {
  const pageData = await getPageData('faq');
  return <Component initialData={pageData} />;
}

