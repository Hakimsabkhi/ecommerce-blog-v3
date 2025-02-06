"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import InvoiceTable from "@/components/invoice/postinvoice/InvoiceTable";
import Invoiceitemproduct from "@/components/invoice/postinvoice/Invoiceitemproduct";
import InvoiceCompanyinfo from "@/components/invoice/postinvoice/InvoiceCompanyinfo";


// Item interface
interface Items {
  refproduct: string;
  product: string;
  name: string;
  tva: number;
  quantity: number;
  image: string;
  discount: number;
  price: number;
}

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


interface Companies {
  _id: string;
    name: string;
    matriculefiscal:string;
    gerantsoc:string;
}



export default function Dashboard() {
    const params = useParams() as { id: string };
  const [itemList, setItemList] = useState<Items[]>([]);
  const [company, setCompany] = useState<string>("");
  const [ref, setRef] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const [itemName, setItemName] = useState<string>("");
  const [itemProduct, setItemProduct] = useState<string>("");
  const [itemTva, setItemTva] = useState<number>();
  const [itemImage, setItemImage] = useState<string>("");
  const [itemDiscount, setItemDiscount] = useState<number>(0);
    const[Deliverymethod,setDeliverymethod]=useState<string>("");
    const [costs, setCost] = useState<number>(0);
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
 

  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompany, setFilteredCompany] = useState<Companies[]>([]);
  const [OpenCompany,setOpenCompany]=useState<boolean>(false);
  const [isOn] = useState(true);


  const handleSearchCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
  
    // Filter the customers based on the query (search by username or other customer properties)
    const filteredCustomers = companies.filter((cust) =>
      cust.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setOpenCompany(true);
    setFilteredCompany(filteredCustomers); // Update the filtered customer list
  };
  const handleCompanySelect = (companiesId: string, name: string) => {
    setOpenCompany(false);
    setCompany(companiesId); // Set the selected customer ID
    setSearchTerm(name);  // Set the search term to the selected username
  };
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const router = useRouter();

  // Add item to the invoice
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (itemName.trim() && price > 0 && itemQuantity >= 1) {
      // Check if the item already exists based on the refproduct (or _id)
      const existingItemIndex = itemList.findIndex(item => item.refproduct === ref);
  
      if (existingItemIndex !== -1) {
        // If the item exists, update the quantity
        const updatedItemList = [...itemList];
        updatedItemList[existingItemIndex].quantity += itemQuantity;
  
        setItemList(updatedItemList);
      } else {
        // If the item doesn't exist, add a new one
        setItemList([
          ...itemList,
          {
            refproduct: ref,
            product: itemProduct,
            name: itemName,
            tva: itemTva || 0,
            quantity: itemQuantity,
            image: itemImage,
            discount: itemDiscount,
            price: price,
          },
        ]);
      }
  
      // Reset fields
      setItemName("");
      setPrice(0);
      setItemDiscount(0);
      setRef("");
      setItemTva(0);
      setItemQuantity(0);
    }
  };
  
  // Calculate total amount
  const calculateTotal = (items: Items[], deliveryCost: number): number => {
    console.log(items);
    
    // Calculate total items cost after applying the discount
    const totalItemsCost = items.reduce((total, item) => {
      const discountedPrice = item.price - (item.price * (item.discount / 100)); // Apply discount
      return total + discountedPrice * item.quantity;
    }, 0);
  
    // Calculate total
    let total = totalItemsCost + deliveryCost;
  
    // If isOn is true, add 1 to the total
   
      total += 1;
    
  
    return total;
  };
  
  
  
  const handleDeleteItem = (ref: string) => {
    // Filter out the item based on refproduct (or _id)
    const updatedItemList = itemList.filter(item => item.refproduct !== ref);
    
    // Update the itemList state with the new list
    setItemList(updatedItemList);
  };
  







  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle creating the invoice here
 /*    console.log(itemList)
    console.log(calculateTotal(itemList,costs))
    console.log(Deliverymethod)
    console.log(costs)
    console.log(customer);
   console.log(address);
   console.log(paymentMethod); */
const invoiceData = {
    itemList: itemList,
    totalCost: calculateTotal(itemList, costs),
    deliveryMethod: Deliverymethod,
    company: company,
    deliveryCost:costs,
    statustimbre:isOn,
    paymentMethod: paymentMethod,
  };
  console.log(invoiceData); 
  try {
    // Send POST request to API
    const response = await fetch(`/api/invoice/postinvoicecompany/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    if (response.ok) {
      // Handle success
      const data = await response.json();
      
      router.push(`/admin/invoice/${data.ref}`)

    } else {
      // Handle error
      console.error('Failed to create invoice', response.statusText);
    }
  } catch (error) {
    // Handle network error
    console.error('Error submitting invoice:', error);
  }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
  setSearchQuery(query);

  // Filter products based on name, ref, price, and tva
  const filtered = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) || // Search by name
      product.ref.toLowerCase().includes(query) || // Search by ref
      product.price.toString().includes(query) || // Search by price
      product.tva.toString().includes(query) // Search by tva
    );
  });

  setFilteredProducts(filtered);
  };

  const handleProductSelect = (product: Product) => {
    setRef(product.ref || "");
    setItemName(product.name || "");
    setItemImage(product.imageUrl || "");
    setItemDiscount(product.discount || 0);
    setItemProduct(product._id || "");
    setItemTva(product.tva || 0);
    setPrice(product.price || 0);
    setItemQuantity(1); // Default quantity
    setSearchQuery(""); // Clear search query after selecting a product
  };
   // Handle delivery method change
   const handleDeliveryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMethodId = e.target.value;
    setDeliverymethod(selectedMethodId);

    // Find the selected method and update the cost
    const selectedMethod = deliveryMethods.find(
      (method) => method.id === selectedMethodId
    );
    if (selectedMethod) {
      setCost(selectedMethod.cost);
    }
  };
  const deliveryMethods = [
    {id: "store", label: "Boutique", cost: 0 },
    { id: "fedex", label: "FedEx", cost: 0 },
    { id: "dhl", label: "Fast delivery DHL", cost: 15 },
    { id: "express", label: "Express delivery", cost: 49 },
  ];

  // Fetch address when customer changes
 

  // Fetch customers and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      const [usersResponse, productsResponse,] = await Promise.all([
        fetch("/api/companies/admin/getcompanies"),
        fetch("/api/products/admin/getAllProduct"),
      
      ]);

      const usersData = await usersResponse.json();
      const productsData = await productsResponse.json();
     
      setCompanies(usersData);
      setProducts(productsData);
      setFilteredProducts(productsData); // Initialize filtered products
    };
    fetchData();
  }, [params.id]);

  return (
    <div className="w-full">
      <main className="min-h-[90vh] flex items-start">
        <div className="w-full h-full p-6">
          <h2 className="font-bold text-2xl mb-3">Add create new invoice</h2>

          <form className="w-full flex flex-col" onSubmit={handleFormSubmit}>
          <InvoiceCompanyinfo
          searchTerm={searchTerm} 
          handleSearchCompany={handleSearchCompany } 
          OpenCompany={OpenCompany} 
          filteredCompany={filteredCompany} 
          handleCompanySelect={handleCompanySelect} 
          Deliverymethod={Deliverymethod} 
          handleDeliveryChange={handleDeliveryChange} 
          deliveryMethods={deliveryMethods} 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
          />
          
            {/* Items */}
            <Invoiceitemproduct searchQuery={searchQuery} handleSearchChange={handleSearchChange } 
           handleProductSelect={handleProductSelect} 
           filteredProducts={filteredProducts} refa={ref}
            setRef={setRef} itemName={itemName} 
            setItemName={setItemName} 
            price={price} 
            setPrice={setPrice} 
            itemTva={itemTva} 
            setItemTva={setItemTva}
            itemDiscount={itemDiscount} 
            setItemDiscount={setItemDiscount } 
            itemQuantity={itemQuantity} setItemQuantity={setItemQuantity} 
            itemImage={itemImage} 
            setItemImage={setItemImage} 
            itemProduct={itemProduct} 
            setItemProduct={setItemProduct } 
            handleAddItem={handleAddItem }/>

            {/* Items Table */}
            <InvoiceTable items={itemList}handleDeleteItem={handleDeleteItem} calculateTotal={calculateTotal} costs={costs} />

            {/* Save Button */}
            <button
              className="bg-gray-800 hover:bg-gray-600 text-white w-full py-4 rounded mt-6"
              type="submit"
            >
              Create Invoice
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}
