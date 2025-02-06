import Banner from "@/components/Banner";

import Sellers from "@/components/Sellers";
import Brands from "@/components/Brands";
import Collection from "@/components/Collection";  
import Furniture from "@/components/Furniture";    
import Categories from "@/components/Categorys/Categories";
import Boutique from "@/components/Boutique";

export default function HomePage() {
  return (
    <>
      <Banner />
      <Categories />
      <Collection />
      <Brands />
      <Sellers />  
      <Furniture />   
      <Boutique/>
    </>
  );
}
