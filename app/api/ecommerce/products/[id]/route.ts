import { NextResponse } from "next/server";
import { getProductModel, getVariantModel } from "@/models";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const Product = await getProductModel();
    const Variant = await getVariantModel();
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const variants = await Variant.find({ productId: product._id }).lean();
    return NextResponse.json({ ...product, variants });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Product = await getProductModel();
    const Variant = await getVariantModel();

    const product = await Product.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // If variants array is provided, replace entire variant list
    if (body.variants && Array.isArray(body.variants)) {
      await Variant.deleteMany({ productId: product._id });
      for (const v of body.variants) {
        await Variant.create({
          productId: product._id,
          sku: v.sku,
          title: v.title,
          price: v.price || product.price,
          stock: v.stock || 0,
          optionValues: v.optionValues || {}
        });
      }
    }

    return NextResponse.json({ success: true, message: "Product updated", product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const Product = await getProductModel();
    const Variant = await getVariantModel();

    const result = await Product.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await Variant.deleteMany({ productId: id });

    return NextResponse.json({ success: true, message: "Product deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
