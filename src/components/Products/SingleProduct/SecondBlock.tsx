import React from 'react';
interface Product {
    _id: string;
    name: string;
    description: string;
    info:string;
    ref: string;
    tva?:number;
    price: number;
    imageUrl?: string;
    images?: string [];
    brand?: Brand; // Make brand optional
    stock: number;
    dimensions?:string;
    discount?: number;
    warranty?:number;
    weight?:number;
    color?: string;
    material?: string;
    status?: string;
  }
  
  interface Brand {
    _id: string;
    place:string;
    name: string;
    imageUrl:string;
  }

const SecondBlock: React.FC<{ product: Product | null }> = ({ product }) => {
    return (
        <main className=' desktop max-lg:w-[95%] my-10 bg-white rounded-lg  flex max-lg:flex-col justify-between '>
            {product?
                (
            <div className="w-[50%] max-lg:w-full justify-between px-4">
                <div>
                    <p className="text-xl pb-5">Product details</p>
                    {/* <p className="text-[#525566] text-sm">Made possible by exploring innovative molded plywood techniques, Iskos-Berlin’s Soft Edge Chair blends strong curves with extreme lightness to create a three-dimensionality not usually possible with 2-D plywood.</p> */}
                </div>
                
                    <div >
                      {  product.brand &&     <div className="flex items-center justify-between border-b-2 pb-3 ">
                            <p>Brand</p>
                            <p className="text-[#525566]">{product.brand?.name}</p>
                        </div>}
                        <div className="flex items-center justify-between border-b-2 py-3 ">
                            <p>Collection</p>
                            <p className="text-[#525566]">Soft Edge Collection</p>
                        </div>
                        {  product.color &&     <div className="flex items-center justify-between border-b-2 py-3 ">
                            <p>Color</p>
                            <p className="text-[#525566]">{product.color}</p>
                        </div>}
                        {  product.material &&      <div className="flex items-center justify-between border-b-2 py-3 ">
                            <p>Materials</p>
                            <p className="text-[#525566]">{product.material}</p>
                        </div>}
                        {  product.dimensions &&      <div className="flex items-center justify-between border-b-2 py-3 ">
                            <p>General dimensions</p>
                            <p className="text-[#525566]">{product.dimensions}</p>
                        </div>       }             
                        {  product.weight &&   <div className="flex items-center justify-between border-b-2 py-3 ">
                            <p>Product weight</p>
                            <p className="text-[#525566]">{product.weight}</p>
                        </div>}
                      {/*   <div className="flex items-center justify-between border-b-2 py-3 ">
                            <p>Box dimensions</p>
                            <p className="text-[#525566]">37” H 21” W 24” D</p>
                        </div>
                        <div className="flex items-center justify-between border-b-2 py-3 ">
                            <p>Assembly</p>
                            <p className="text-[#525566]">20.72 lbs</p>
                        </div> */}
                      {  product.warranty && <div className="flex items-center justify-between  py-3 ">
                            <p>Warranty</p>
                            <p className="text-[#525566]">{product.warranty}</p>
                        </div> }
                    </div>
                
            </div>
            ):
            (<div className="h-full max-lg:h-[504px]"></div>)
        }
         {  product?.description &&      <div className='w-[50%] max-lg:w-full h-[504px] flex flex-col gap-10 px-4'>
                <p className="text-xl">Description</p>
             {/*    <Image src={product.description} width={500} height={500} alt="description" /> */}
                <p className="text-[#525566]">{product?.description}</p>
              {/*   <ul>
                    <li className=' text-[#525566]'>Choose items in a single color scheme and style</li>
                    <li className=' text-[#525566]'>Consider the area of the room</li>
                    <li className=' text-[#525566]'>Do not buy unnecessary pieces of furniture</li>
                </ul> */}
            </div>}
            
        </main>
    );
}

export default SecondBlock;