'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FirstBlock from '@/components/Products/Admin/NotApproved/SingleProduct/FirstBlock';
import SecondBlock from '@/components/Products/SingleProduct/SecondBlock';

interface ProductData {
  _id: string;
  name: string;
  description: string;
  info: string;
  ref: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  brand?: Brand;
  stock: number;
  category: Category;
  dimensions?: string;
  discount?: number;
  warranty?: number;
  weight?: number;
  color?: string;
  material?: string;
  status?: string;
  boutique: { _id: string; nom: string; address:string;city:string;phoneNumber:string;vadmin:string };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
  place: string;
  imageUrl: string;
}

export default function ProductPage() {
  const { slugCategory, slugProduct } = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `/api/products/admin/getProductByIdAdmin/${slugProduct}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          console.error('Product not found');
          return;
        }

        const data = await res.json();
        if (data.category.slug !== slugCategory) {
          console.error('Category mismatch');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [slugCategory, slugProduct]);

  if (!product) {
    return <div>Product not found or loading...</div>;
  }

  return (
    <div>
      <FirstBlock product={product} />
      <SecondBlock product={product} />
    </div>
  );
}
