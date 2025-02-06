'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Products from '@/components/approve/Products';
import Banner from '@/components/approve/Banner';

interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl?: string;
  brand: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  category: Category;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
  bannerUrl: string;
}

interface Brand {
  _id: string;
  name: string;
}

export default function CategoryPage() {
  const { slugCategory } = useParams();

  const [category, setCategory] = useState<Category >();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(
          `/api/category/admin/GetNotApprovedCategory/${slugCategory}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!res.ok) {
          const res = await fetch(
            `/api/SubCategory/admin/getNotApprovedSubcatgorey/${slugCategory}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          );
          if (!res.ok) {
            console.error('nod data')
            return;
          }
          const data = await res.json();
          setCategory(data); 
        }else if(res.status==202){
          const res = await fetch(
            `/api/SubCategory/admin/getNotApprovedSubcatgorey/${slugCategory}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          );
          if (!res.ok) {
            console.error('nod data')
            return;
          }
          const data = await res.json();
          setCategory(data);
        }else if(res.status==200){
          const data = await res.json();
          setCategory(data);
        }

        // Update if response wraps data
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

 const fetchProductsData = async () => {
      try {
        const res = await fetch(
          `/api/products/admin/GetNotApprovedProduct/${slugCategory}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!res.ok) {
          console.error('Products not found');
          return;
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products data:', error);
      }
    };

    const fetchBrandData = async () => {
      try {
        const res = await fetch(
          `/api/brand/getAllBrand`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!res.ok) {
          console.error('Brands not found');
          return;
        }

        const data = await res.json();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brand data:', error);
      }
    }; 

    fetchCategoryData();
    fetchProductsData();
    fetchBrandData(); 
  },  [slugCategory]);

  return (
    <div>
      
      <Banner category={category} />
       <Products products={products} brands={brands} /> 
    </div>
  );
}
