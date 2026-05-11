
import Component from "@/components/pages/ProductDetailPage";
import { getSingleProduct } from "@/lib/getPageData";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getSingleProduct(id);
  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <>
      <Component currentProduct={product} />
    </>
  );
}
