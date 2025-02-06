import React from 'react';
import Products from '@/components/Products';
import Chairsbanner from '@/components/Chairsbanner';
import { notFound } from 'next/navigation';
import { searchcategory } from '@/lib/StaticCatgoryproduct';





// CategoryPage component
async function CategoryPage({ params }:{ params:Promise< { slugCategory: string }>}) {
  // Await the params object if it is a Promise
  const resolvedParams = await params;

  const id = resolvedParams?.slugCategory;

  if (!id) {
    return notFound();
  }

  // Fetch category data
  const categorys = await searchcategory(id);
  const category = JSON.parse(categorys)
  if (!category) {
    return notFound();
  }

  // Render category-specific components
  return (
    <div>
      {/* Banner showcasing category details */}
      <Chairsbanner category={category} />
      {/* Products listing */}
      <Products params={resolvedParams} />
    </div>
  );
}

export default CategoryPage;
