import { cache } from "react";
import { connectTenantDB } from "./db";
import { ObjectId } from "mongodb";
import { isHex } from "@/app/api/ecommerce/categories/util";


function serialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, value) => {
    if (value instanceof ObjectId) {
      return value.toString();
    }
    return value;
  }));
}


export const getPageData = cache(async (slug: string) => {
  const db = await connectTenantDB();
  const page = await db.collection("pages").findOne({ slug });
 if (!page) {
    return null;
  }
  return serialize(page);
});

export const getSingleProduct = cache(async (id: string) => {
  const db = await connectTenantDB();
  const productColl = db.collection("products");

  const matchStage: any = {};
  if (isHex(id)) {
    matchStage._id = new ObjectId(id);
  } else {
    matchStage.slug = id;
  }

  const products = await productColl
    .aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },

      
    ])
    .toArray();
  if (products.length === 0) {
    return null;
  }

  return serialize(products[0]);
});

export const getTenantRegistry = cache(async () => {
  const db = await connectTenantDB();
  const tenantRegistry = db.collection("tenant_registry");

  const tenant = await tenantRegistry.findOne({ type: "branding" });

  return serialize(tenant);
});

export const getBusinessBlueprint = cache(async () => {
  const tenantHeader = process.env.NEXT_PUBLIC_TENANT_ID;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(
      `${API_BASE_URL}/platform/business-blueprint`,
      {
        headers: {
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      },
    );
    const data = await response.json();
    return serialize(data.data);
  } catch (error) {
    console.error("Error fetching business blueprint:", error);
    return null;
  }
});
