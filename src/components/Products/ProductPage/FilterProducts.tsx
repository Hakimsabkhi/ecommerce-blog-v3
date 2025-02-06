import React, {
  ReactElement,
  HTMLAttributes,
  cloneElement
} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface RenderProps {
  index: number;
  value: number;
  dragging: boolean;
}

// 1) Define your handleRender function
function handleRender(
  origin: ReactElement<HTMLAttributes<HTMLDivElement>>,
  { index, value }: RenderProps
): ReactElement<HTMLAttributes<HTMLDivElement>> {
  const ariaLabel =
    index === 0 ? "Minimum price slider handle" : "Maximum price slider handle";

  return cloneElement(origin, {
    role: "slider",
    "aria-label": ariaLabel,
    "aria-valuemin": 1,
    "aria-valuemax": 200000,
    "aria-valuenow": value,
    style: {
      ...origin.props.style,
      borderColor: "#007bff", // your custom color
      backgroundColor: "#fff",
    },
  });
}

// 2) Other interfaces (unchanged from your code)
interface FilterProductsProps {
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  selectedBoutique: string | null;
  setSelectedBoutique: (brand: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedMaterial: string | null;
  setSelectedMaterial: (material: string | null) => void;
  minPrice: number | null;
  setMinPrice: (price: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (price: number | null) => void;
  brands: { _id: string; name: string }[];
  boutique: { _id: string; nom: string }[];
  uniqueColors: string[];
  uniqueMaterials: string[];
}

const FilterProducts: React.FC<FilterProductsProps> = ({
  selectedBrand,
  setSelectedBrand,
  selectedBoutique,
  setSelectedBoutique,
  selectedColor,
  setSelectedColor,
  selectedMaterial,
  setSelectedMaterial,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  brands,
  boutique,
  uniqueColors,
  uniqueMaterials,
}) => {
  return (
    <div className="flex flex-col w-full justify-center px-2">
      {/* Brand Filter */}
      <div className="mb-4">
        <label htmlFor="brand-filter" className="font-bold">
          Brand:
        </label>
        <select
          id="brand-filter"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedBrand || ""}
          onChange={(e) => setSelectedBrand(e.target.value || null)}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Boutique Filter */}
      <div className="mb-4">
        <label htmlFor="boutique-filter" className="font-bold">
          Boutique:
        </label>
        <select
          id="boutique-filter"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedBoutique || ""}
          onChange={(e) => setSelectedBoutique(e.target.value || null)}
        >
          <option value="">All Boutique</option>
          {boutique.map((b) => (
            <option key={b._id} value={b._id}>
              {b.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Color Filter */}
      <div className="mb-4">
        <label htmlFor="color-filter" className="font-bold">
          Color:
        </label>
        <select
          id="color-filter"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedColor || ""}
          onChange={(e) => setSelectedColor(e.target.value || null)}
        >
          <option value="">All Colors</option>
          {uniqueColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Material Filter */}
      <div className="mb-4">
        <label htmlFor="material-filter" className="font-bold">
          Material:
        </label>
        <select
          id="material-filter"
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedMaterial || ""}
          onChange={(e) => setSelectedMaterial(e.target.value || null)}
        >
          <option value="">All Materials</option>
          {uniqueMaterials.map((material) => (
            <option key={material} value={material}>
              {material}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="font-bold">Price:</label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Min Price"
            className="w-1/2 p-2 border border-gray-300 rounded"
            value={minPrice || ""}
            onChange={(e) => setMinPrice(Number(e.target.value) || null)}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="w-1/2 p-2 border border-gray-300 rounded"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(Number(e.target.value) || null)}
          />
        </div>
        <Slider
          range
          min={1}
          max={10000}
          value={[minPrice || 1, maxPrice || 10000]}
          onChange={(values) => {
            const [min, max] = values as number[];
            setMinPrice(min);
            setMaxPrice(max);
          }}
          allowCross={false}
          trackStyle={[{ backgroundColor: "#007bff" }]}
          // 3) The typed handleRender function
          handleRender={handleRender}
        />
      </div>
    </div>
  );
};

export default FilterProducts;
