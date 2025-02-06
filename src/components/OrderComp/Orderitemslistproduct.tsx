import React from 'react'
interface Product {
    _id: string;
    name: string;
    description: string;
    ref: string;
    tva: number;
    price: number;
    imageUrl?: string;
    stock: number;
    discount?: number;
    color?: string;
    material?: string;
    status?: string;
    quantity: number;
  }
interface orderitemslistproductProps {
    searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProductSelect: (product: Product) => void;
  filteredProducts: Product[];
  refa: string; // Renamed to avoid conflict with native `ref`
  setRef: React.Dispatch<React.SetStateAction<string>>; // Updated to match state setter type
  itemName: string;
  setItemName: React.Dispatch<React.SetStateAction<string>>; // Updated to match state setter type
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>; // Updated to match state setter type
  itemTva: number | undefined; // Allow undefined
  setItemTva: React.Dispatch<React.SetStateAction<number | undefined>>; // Updated to match state setter type
  itemDiscount: number;
  setItemDiscount: React.Dispatch<React.SetStateAction<number>>; // Updated to match state setter type
  itemQuantity: number;
  setItemQuantity: React.Dispatch<React.SetStateAction<number>>; // Updated to match state setter type
  itemImage: string;
  setItemImage: React.Dispatch<React.SetStateAction<string>>; // Updated to match state setter type
  itemProduct: string;
  setItemProduct: React.Dispatch<React.SetStateAction<string>>; // Updated to match state setter type
  handleAddItem: (e: React.FormEvent) => void;
  
  }
const Orderitemslistproduct:React.FC<orderitemslistproductProps> = ({
    searchQuery,
    handleSearchChange,
    filteredProducts,
    handleProductSelect,
    refa,
  setRef,
  itemName,
  setItemName,
  price,
  setPrice,
  itemTva,
  setItemTva,
  itemDiscount,
  setItemDiscount,
  itemQuantity,
  setItemQuantity,
  itemImage,
  setItemImage,
  itemProduct,
  setItemProduct,
  handleAddItem,
  
  }) => {
    const safeItemTva = itemTva ?? 0; // Default to 0 if undefined
    const safeItemDiscount = itemDiscount ?? 0; // Default to 0 if undefined
    const safeItemQuantity = itemQuantity ?? 0; // Default to 0 if undefined
    const safePrice = price ?? 0; // Def
    
  return (
    <div  className="w-full flex flex-col mt-4 mb-3">
    <h3 className="font-bold mb-2">Items List</h3>
    {/* Form for adding items */}
    <div className="space-x-3">
      {/* Item search */}
      <div className="w-full">
        <label htmlFor="search" className="font-bold">
          Search Product
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a product..."
          className="py-2 px-4 bg-gray-100 w-full mt-2"
        />

        {/* Show filtered products */}
        {filteredProducts.length > 0 && searchQuery && (
          <div className="mt-2 border border-gray-300 rounded-sm max-h-60 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleProductSelect(product)}
              >
               <div className="flex gap-5 justify-between items-center m-2 text-xl"><h1>{product.ref}</h1><h1>{product.name}</h1><h1>{product.price.toFixed(3)} TND</h1><h1>{product.discount||0}%</h1><h1>{(product.price - product.price * ((product.discount||0) / 100)).toFixed(3) } TND </h1></div><hr/>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {/* Inputs for customizing selected product */}
        <div className="flex flex-col">
          <h2 className="font-bold">ref :</h2>
          <input
            type="text"
            placeholder="ref"
            value={refa}
            onChange={(e) => setRef(e.target.value)}
            className="py-2 px-4 bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold">Designation :</h2>
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="py-2 px-4 bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold">PU BRUT :</h2>
          <input
            type="number"
            placeholder="Prix brut"
            value={safePrice}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="py-2 px-4 bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold">Tav % :</h2>
          <input
            type="number"
            placeholder="TVA"
            value={safeItemTva}
            onChange={(e) => setItemTva(Number(e.target.value))}
            className="py-2 px-4 bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold">rem % :</h2>
          <input
            type="number"
            placeholder="Discount"
            value={safeItemDiscount}
            onChange={(e) => setItemDiscount(Number(e.target.value))}
            className="py-2 px-4 bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold">Qte :</h2>
          <input
            type="number"
            placeholder="Quantity"
            value={safeItemQuantity}
            onChange={(e) => setItemQuantity(Number(e.target.value))}
            className="py-2 px-4 bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold">Pu Tva :</h2>
          <input
            type="number"
            placeholder="Quantity"
            value={safePrice - (safePrice * (safeItemDiscount / 100 || 0))}
            readOnly
            className="py-2 px-4 bg-gray-100"
          />
        </div>
        <div>
          <input
            type="text"
            value={itemImage}
            onChange={(e) => setItemImage(e.target.value)}
            className="py-2 px-4 bg-gray-100 hidden"
          />
          <input
            type="text"
            value={itemProduct}
            onChange={(e) => setItemProduct(e.target.value)}
            className="py-2 px-4 bg-gray-100 hidden"
          />
        </div>
      </div>
      <div className="flex justify-end mt-2 ">
      <button
        onClick={handleAddItem}
        className="bg-gray-400 w-1/2 hover:bg-gray-600 text-white px-4 h-12 rounded mt-2"
      >
        Add Item
      </button>
      </div>
    </div>
  </div>

  )
}

export default Orderitemslistproduct