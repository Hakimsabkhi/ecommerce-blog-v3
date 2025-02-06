"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OrderTable from "@/components/OrderComp/OrderTable";
import OrderAddress from "@/components/OrderComp/OrderAddress";
import Orderitemslistproduct from "@/components/OrderComp/Orderitemslistproduct";
import Ordercustomerinfo from "@/components/OrderComp/Ordercustomerinfo";


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


interface User {
  _id: string;
  username: string;
  phone: number;
}

interface Address {
  _id: string;
  user: User;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

export default function Dashboard() {
  const [itemList, setItemList] = useState<Items[]>([]);
  const [customer, setCustomer] = useState<string>("");
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
  const [customers, setCustomers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<string>("");
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    governorate: "",
    city: "",
    zipcode: "",
    address: "",
  });
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [OpenCustomer,setOpenCustomer]=useState<boolean>(false);
  const [isOn, setIsOn] = useState(false);

  // Toggle state on click
  const handleToggle = () => setIsOn(!isOn);
  const handleSearchCustomers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
  
    // Filter the customers based on the query (search by username or other customer properties)
    const filteredCustomers = customers.filter((cust) =>
      cust.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setOpenCustomer(true);
    setFilteredCustomers(filteredCustomers); // Update the filtered customer list
  };
  const handleCustomerSelect = (customerId: string, username: string) => {
    setOpenCustomer(false);
    setCustomer(customerId); // Set the selected customer ID
    setSearchTerm(username);  // Set the search term to the selected username
  };
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const router = useRouter();

  // Add item to the order
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
  const calculateTotal = (items: Items[], deliveryCost: number, isOn: boolean): number => {
    // Calculate total items cost after applying the discount
    const totalItemsCost = items.reduce((total, item) => {
      const discountedPrice = item.price - (item.price * (item.discount / 100)); // Apply discount
      return total + discountedPrice * item.quantity;
    }, 0);
  
    // Calculate total
    let total = totalItemsCost + deliveryCost;
  
    // If isOn is true, add 1 to the total
    if (isOn) {
      total += 1;
    }
  
    return total;
  };
  
  
  
  const handleDeleteItem = (ref: string) => {
    // Filter out the item based on refproduct (or _id)
    const updatedItemList = itemList.filter(item => item.refproduct !== ref);
    
    // Update the itemList state with the new list
    setItemList(updatedItemList);
  };
  
  const handlecloseAddress=()=>{
   
   setShowNewAddressModal(false);
    setNewAddress({
      governorate: "",
      city: "",
      zipcode: "",
      address: "",
    });

  }
const handleAddNewAddress = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  
  // Append fields from newAddress and customer to FormData
  Object.keys(newAddress).forEach((key) => {
    // Type guard to make sure `key` is a valid key of `newAddress`
    if (key in newAddress) {
      formData.append(key, newAddress[key as keyof typeof newAddress]); // Explicitly cast key type
    }
  });
  formData.append("userId", customer); // Append userId

  try {
    const res = await fetch(`/api/address/admin/postaddressbyuser`, {
      method: "POST",
      body: formData, // Send FormData as the request body
    });

    if (res.ok) {
      const {address} = await res.json();
      const addedAddress =address;
      console.log(addedAddress)
      setAddresses((prev) => [...prev, addedAddress]); // Update address list
      setNewAddress({
        governorate: "",
        city: "",
        zipcode: "",
        address: "",
      });
      setShowNewAddressModal(false); // Close modal
    } else {
      console.error("Failed to add address");
    }
  } catch (err) {
    console.error("Error adding address:", err);
  }
};





  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle creating the order here

   const orderData = {
    itemList: itemList,
    totalCost: calculateTotal(itemList, costs,isOn),
    deliveryMethod: Deliverymethod,
    customer: customer,
    address: address,
    deliveryCost:costs,
    statustimbre:isOn,
    paymentMethod: paymentMethod,
  };

  try {
    // Send POST request to API
    const response = await fetch('/api/order/admin/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      // Handle success
      const data = await response.json();
      
      router.push(`/admin/order/bondelivraison/${data.ref}`)

    } else {
      // Handle error
      console.error('Failed to create order', response.statusText);
    }
  } catch (error) {
    // Handle network error
    console.error('Error submitting order:', error);
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
  useEffect(() => {

    const fetchAddress = async () => {
      const res = await fetch(`/api/address/admin/getaddressbyid/${customer}`);
      const data = await res.json();
      setAddresses(data);
    };
    fetchAddress();
  }, [customer]);

  // Fetch customers and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      const [usersResponse, productsResponse] = await Promise.all([
        fetch("/api/users/userdashboard"),
        fetch("/api/products/admin/getAllProduct"),
      ]);

      const usersData = await usersResponse.json();
      const productsData = await productsResponse.json();

      setCustomers(usersData);
      setProducts(productsData);
      setFilteredProducts(productsData); // Initialize filtered products
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <main className="min-h-[90vh] flex items-start">
        <div className="w-full h-full p-6">
          <h2 className="font-bold text-2xl mb-3">Add new order</h2>

          <form className="w-full flex flex-col" onSubmit={handleFormSubmit}>
           <Ordercustomerinfo searchTerm={searchTerm} 
           handleSearchCustomers={handleSearchCustomers } 
           OpenCustomer={OpenCustomer} 
           filteredCustomers={filteredCustomers} 
           handleCustomerSelect={handleCustomerSelect} 
           address={address} 
           setAddress={setAddress } 
           addresses={addresses} 
           setShowNewAddressModal={setShowNewAddressModal} 
           Deliverymethod={Deliverymethod} 
           handleDeliveryChange={handleDeliveryChange } 
           deliveryMethods={deliveryMethods} 
           paymentMethod={paymentMethod} 
           setPaymentMethod={setPaymentMethod} 
           isOn={isOn} 
           handleToggle={handleToggle }/>
          
            {/* Items */}
           <Orderitemslistproduct searchQuery={searchQuery} handleSearchChange={handleSearchChange } 
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
            <OrderTable items={itemList}handleDeleteItem={handleDeleteItem} calculateTotal={calculateTotal} costs={costs} isOn={isOn} />

            {/* Save Button */}
            <button
              className="bg-gray-800 hover:bg-gray-600 text-white w-full py-4 rounded mt-6"
              type="submit"
            >
              SAVE & PREVIEW ORDER
            </button>
          </form>

          {/* showNewAddressModal*/} 
      <OrderAddress showNewAddressModal={showNewAddressModal} handleAddNewAddress={handleAddNewAddress} handlecloseAddress={handlecloseAddress} setNewAddress={setNewAddress} newAddress={newAddress} />
        </div>
      </main>
    </div>
  );
}
