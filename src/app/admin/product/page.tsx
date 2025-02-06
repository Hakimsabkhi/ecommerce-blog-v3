"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaSpinner, FaTrashAlt, FaRegEye, FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import useIs2xl from "@/hooks/useIs2x";

type User = {
  _id: string;
  username: string;
};

interface Boutique {
  _id: string;
  nom: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  vadmin: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}

type Product = {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl: string;
  category: Category;
  subcategory: SubCategory;
  boutique: Boutique;
  stock: number;
  user: User;
  discount: number;
  status: string;
  statuspage: string;
  vadmin: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
};

const AddedProducts: React.FC = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const is2xl = useIs2xl();
  const productsPerPage = is2xl ? 7 : 5;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState({ id: "", name: "" });
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedBoutique, setSelectedBoutique] = useState<string>("");

  const [colSpan, setColSpan] = useState(6);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) HANDLERS FOR DELETE / APPROVE / STATUS / PLACEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  const handleDeleteClick = (product: Product) => {
    setLoadingProductId(product._id);
    setSelectedProduct({ id: product._id, name: product.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingProductId(null);
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `/api/products/admin/deleteProduct/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }

      setCurrentPage(1);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success(`Product ${selectedProduct.name} deleted successfully!`);
      handleClosePopup();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting product:", error.message);
        setError(error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
        setError(error);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoadingProductId(null);
    }
  };

  const updateProductStatusstock = async (
    productId: string,
    newStatus: string
  ) => {
    setLoadingProductId(productId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("status", newStatus);

      const response = await fetch(
        `/api/products/admin/updateStatusProductstock/${productId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setProducts((prevData) =>
        prevData.map((item) =>
          item._id === productId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Failed to update product status:", error);
      toast.error("Failed to update product status");
    } finally {
      setLoadingProductId(null);
    }
  };

  const updateProductvadmin = async (productId: string, newStatus: string) => {
    setLoadingProductId(productId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(
        `/api/products/admin/updateProductvadmin/${productId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setProducts((prevData) =>
        prevData.map((item) =>
          item._id === productId ? { ...item, vadmin: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Failed to update product approve status:", error);
      toast.error("Failed to update product approve");
    } finally {
      setLoadingProductId(null);
    }
  };

  const updateProductStatusPlace = async (
    productId: string,
    statuspage: string
  ) => {
    setLoadingProductId(productId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("statuspage", statuspage);

      const response = await fetch(
        `/api/products/admin/updatePlaceProduct/${productId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setProducts((prevData) =>
        prevData.map((item) =>
          item._id === productId ? { ...item, statuspage: statuspage } : item
        )
      );
      toast.success("Product status updated successfully");
    } catch (error) {
      console.error("Failed to update product status page:", error);
      toast.error("Failed to update product status");
    } finally {
      setLoadingProductId(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) CALCULATE COLSPAN DYNAMICALLY
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const updateColSpan = () => {
      const isSmallestScreen = window.innerWidth <= 640; // max-sm
      const isSmallScreen = window.innerWidth <= 768; // max-md
      const isMediumScreen = window.innerWidth <= 1024; // max-lg
      const isXlLScreen = window.innerWidth <= 1280; // max-xl

      if (isSmallestScreen) {
        setColSpan(1);
      } else if (isSmallScreen) {
        setColSpan(2);
      } else if (isMediumScreen) {
        setColSpan(3);
      } else if (isXlLScreen) {
        setColSpan(4);
      } else {
        setColSpan(6); // default
      }
    };

    updateColSpan();
    window.addEventListener("resize", updateColSpan);
    return () => window.removeEventListener("resize", updateColSpan);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) FETCH ALL DATA IN ONE PLACE USING Promise.all
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [prodRes, storeRes, catRes, subcatRes] = await Promise.all([
          fetch("/api/products/admin/getAllProduct"),
          fetch("/api/store/admin/getallstore"),
          fetch("/api/category/admin/getAllCategoryAdmin"),
          fetch("/api/SubCategory/admin/getallSubCategory"),
        ]);

        if (!prodRes.ok) throw new Error("Failed to fetch products");
        if (!storeRes.ok) throw new Error("Failed to fetch boutiques");
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        if (!subcatRes.ok) throw new Error("Failed to fetch subcategories");

        const [prodData, storeData, catData, subcatData] = await Promise.all([
          prodRes.json(),
          storeRes.json(),
          catRes.json(),
          subcatRes.json(),
        ]);

        setProducts(prodData);
        setBoutiques(storeData);
        setCategories(catData);
        setSubCategories(subcatData);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message);
          setError(error.message);
        } else if (typeof error === "string") {
          console.error("String error:", error);
          setError(error);
        } else {
          console.error("Unknown error:", error);
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) FILTER PRODUCTS
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const filtered = products.filter((product) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm =
        product.name.toLowerCase().includes(searchTermLower) ||
        product.ref.toLowerCase().includes(searchTermLower);

      const matchesCategory =
        !selectedCategory || product.category?._id === selectedCategory;
      const matchesSubCategory =
        !selectedSubCategory ||
        product.subcategory?._id === selectedSubCategory;
      const matchesBoutique =
        !selectedBoutique || product.boutique?._id === selectedBoutique;

      return (
        matchesSearchTerm &&
        matchesCategory &&
        matchesSubCategory &&
        matchesBoutique
      );
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    selectedSubCategory,
    selectedBoutique,
    products,
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) PAGINATION CALCS
  // ─────────────────────────────────────────────────────────────────────────────
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) RENDERING
  // ─────────────────────────────────────────────────────────────────────────────
  if (error) {
    return <div className="mx-auto mt-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
      {/* Header */}
      <div className="flex items-center justify-between h-[80px] ">
        <p className="text-3xl max-sm:text-sm font-bold">ALL Products</p>
        <div className="flex gap-2">
          <Link href="/admin/product/costmize">
            <button className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
              <p>Costmize Product</p>
            </button>
          </Link>
          <Link href="/admin/product/addproduct">
            <button className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
              <p>Add Product</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="h-[50px] flex justify-between items-center">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg max-w-max"
        />
        <div className=" flex gap-2">
          <select
            name="boutique"
            value={selectedBoutique}
            onChange={(e) => setSelectedBoutique(e.target.value)}
            className="p-2 border bg-gray-50 border-gray-300 rounded-lg max-w-max"
            required
          >
            <option value="">Select Boutique</option>
            {boutiques.map((boutique) => (
              <option key={boutique._id} value={boutique._id}>
                {boutique.nom}
              </option>
            ))}
          </select>
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border bg-gray-50 border-gray-300 rounded-lg max-w-max"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            name="subcategory"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="p-2 border bg-gray-50 border-gray-300 rounded-lg max-w-max"
            required
          >
            <option value="">Select SubCategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table View (Desktop) */}
      <div className="h-[50vh] max-2xl:h-80 max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-3 xl:w-[9%] lg:w-1/6 md:w-1/6">REF</th>
              <th className="px-4 py-3 xl:w-[9%] lg:w-1/6 md:w-1/6">Name</th>
              <th className="px-4 py-3 xl:w-[8%] max-xl:hidden">Quantity</th>
              <th className="px-4 py-3 xl:w-[8%] lg:w-1/6 max-xl:hidden">
                Image
              </th>
              <th className="px-4 py-3 xl:w-[11%] max-xl:hidden">Created By</th>
              <th className="px-4 py-3 xl:w-[55%] lg:w-2/3 md:w-4/6 text-center">
                Action
              </th>
            </tr>
          </thead>

          {/* MAIN LOGIC: LOADING / NO DATA / RENDER ROWS */}
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px]" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredProducts.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucune Products trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentProducts.map((item) => (
                <tr key={item._id} className="even:bg-gray-100 odd:bg-white">
                  <td className="border px-4 py-2 truncate">{item.ref}</td>
                  <td className="border px-4 py-2 truncate">{item.name}</td>
                  <td className="border px-4 py-2 text-center max-xl:hidden">
                    {item.stock}
                  </td>
                  <td className="border px-4 py-2 max-xl:hidden">
                    <div className="flex justify-center ">
                      <Image
                        alt={item.name}
                        src={item.imageUrl}
                        width={30}
                        height={30}
                      />
                    </div>
                  </td>
                  <td className="border px-4 py-2 truncate max-xl:hidden">
                    {item?.user?.username}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {/* Approve / Not approve */}
                      <select
                        className={`w-32 text-black rounded-md h-10 ${
                          item.vadmin === "not-approve"
                            ? "bg-gray-400 text-white"
                            : "bg-green-500 text-white"
                        }`}
                        value={item.vadmin}
                        onChange={(e) =>
                          updateProductvadmin(item._id, e.target.value)
                        }
                        disabled={loadingProductId === item._id}
                      >
                        <option value="approve" className="text-white uppercase">
                          approve
                        </option>
                        <option
                          value="not-approve"
                          className="text-white uppercase"
                        >
                          Not approve
                        </option>
                      </select>

                      {/* In stock / out of stock */}
                      {item.stock > 0 ? (
                        <select
                          className={`w-32 h-10 text-white text-center rounded-md p-2 ${
                            item.status === "in-stock"
                              ? "bg-gray-800"
                              : "bg-red-700"
                          }`}
                          value={item.status}
                          onChange={(e) =>
                            updateProductStatusstock(item._id, e.target.value)
                          }
                          disabled={loadingProductId === item._id}
                        >
                          <option value="in-stock">In stock</option>
                          <option value="out-of-stock">Out of stock</option>
                        </select>
                      ) : (
                        <div className="w-32 bg-gray-500 text-white text-center rounded-md p-2">
                          Out of stock
                        </div>
                      )}

                      {/* Place: home-page/best-collection/promotion */}
                      <select
                        className={`w-36 h-10 text-white rounded-md p-2 ${
                          item.statuspage === "none"
                            ? "bg-gray-800"
                            : "bg-emerald-950"
                        }`}
                        value={item.statuspage || ""}
                        onChange={(e) =>
                          updateProductStatusPlace(item._id, e.target.value)
                        }
                        disabled={loadingProductId === item._id}
                      >
                        <option value="">Select a Place</option>
                        <option value="home-page">Weekly Best Sellers</option>
                        <option value="best-collection">Best Collection</option>
                        <option value="promotion">Promotion</option>
                      </select>

                      {/* Edit */}
                      <Link href={`/admin/product/${item._id}`}>
                        <button
                          className="bg-gray-800 text-white w-10 h-10 hover:bg-gray-600 rounded-md flex items-center justify-center"
                          disabled={loadingProductId === item._id}
                        >
                          <FaRegEdit />
                        </button>
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="bg-gray-800 text-white w-10 h-10 hover:bg-gray-600 rounded-md flex items-center justify-center"
                        disabled={loadingProductId === item._id}
                      >
                        {loadingProductId === item._id ? (
                          "..."
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>

                      {/* Eye / View */}
                      <Link
                        href={`/${
                          item.vadmin === "approve" ? "" : "admin/"
                        }${item.category?.slug}/${item.slug}`}
                      >
                        <button
                          className="bg-gray-800 text-white w-10 h-10 hover:bg-gray-600 rounded-md flex items-center justify-center"
                          disabled={loadingProductId === item._id}
                        >
                          <FaRegEye />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {/* Delete Confirmation Popup */}
        {isPopupOpen && (
          <DeletePopup
            handleClosePopup={handleClosePopup}
            Delete={deleteProduct}
            id={selectedProduct.id}
            name={selectedProduct.name}
          />
        )}
      </div>

      {/* Card View (Mobile) */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full py-6">
            <FaSpinner className="animate-spin text-[30px]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-6 text-gray-600 w-full">
            <p>Aucune Products trouvée.</p>
          </div>
        ) : (
          currentProducts.map((item) => (
            <div
              key={item._id}
              className="p-4 mb-4 flex flex-col gap-4 bg-gray-100 rounded shadow-md"
            >
              <div>
                <div className="flex gap-1 text-3xl font-semibold uppercase text-center justify-center">
                  <p className="text-gray-600 w-1/5">REF:</p>
                  <p>{item.ref}</p>
                </div>
                <hr className="border-white border-2 w-full my-2" />
                <div className="flex gap-1 font-semibold pl-[15%]">
                  <p className="text-gray-600 w-1/5 mr-4">Name:</p>
                  <p className="truncate">{item.name}</p>
                </div>
                <div className="flex gap-1 font-semibold pl-[15%]">
                  <p className="text-gray-600 w-1/5 mr-4">Quantity:</p>
                  <p>{item.stock}</p>
                </div>
                <div className="w-full flex justify-center py-2">
                  <Image
                    alt={item.name}
                    src={item.imageUrl}
                    width={300}
                    height={500}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-center gap-4">
                  {/* Approve / Not approve */}
                  <select
                    className={`w-50 text-black rounded-md p-2 ${
                      item.vadmin === "not-approve"
                        ? "bg-gray-400 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    value={item.vadmin}
                    onChange={(e) =>
                      updateProductvadmin(item._id, e.target.value)
                    }
                    disabled={loadingProductId === item._id}
                  >
                    <option value="approve" className="text-white uppercase">
                      Approve
                    </option>
                    <option
                      value="not-approve"
                      className="text-white uppercase"
                    >
                      Not Approve
                    </option>
                  </select>

                  {/* In-stock / Out-of-stock */}
                  {item.stock > 0 ? (
                    <select
                      className={`w-50 text-white rounded-md p-2 ${
                        item.status === "in-stock"
                          ? "bg-gray-800"
                          : "bg-red-700"
                      }`}
                      value={item.status}
                      onChange={(e) =>
                        updateProductStatusstock(item._id, e.target.value)
                      }
                      disabled={loadingProductId === item._id}
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  ) : (
                    <div className="w-32 bg-gray-500 text-white rounded-md p-2 text-center">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Placement */}
                <div className="flex justify-center">
                  <select
                    className={`w-72 text-white rounded-md p-2 ${
                      item.statuspage === "none"
                        ? "bg-gray-800"
                        : "bg-emerald-950"
                    }`}
                    value={item.statuspage || ""}
                    onChange={(e) =>
                      updateProductStatusPlace(item._id, e.target.value)
                    }
                    disabled={loadingProductId === item._id}
                  >
                    <option value="">Select a Place</option>
                    <option value="home-page">Weekly Best Sellers</option>
                    <option value="best-collection">Best Collection</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>

                {/* Edit/Delete/View Buttons */}
                <div className="flex justify-center gap-5">
                  <Link href={`/admin/product/${item._id}`}>
                    <button
                      className="bg-gray-800 text-white w-10 h-10 hover:bg-gray-600 rounded-md flex items-center justify-center"
                      disabled={loadingProductId === item._id}
                    >
                      <FaRegEdit />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="bg-gray-800 text-white w-10 h-10 hover:bg-gray-600 rounded-md flex items-center justify-center"
                    disabled={loadingProductId === item._id}
                  >
                    {loadingProductId === item._id ? "..." : <FaTrashAlt />}
                  </button>

                  <Link
                    href={`/${
                      item.vadmin === "approve" ? "" : "admin/"
                    }${item.category?.slug}/${item.slug}`}
                  >
                    <button
                      className="bg-gray-800 text-white w-10 h-10 hover:bg-gray-600 rounded-md flex items-center justify-center"
                      disabled={loadingProductId === item._id}
                    >
                      <FaRegEye />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AddedProducts;
