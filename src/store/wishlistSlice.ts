
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Brand {
    _id: string;
    name: string;
  }
  
  interface Product {
    _id: string;
    name: string;
    description: string;
    ref: string;
    price: number;
    imageUrl?: string;
    brand?: Brand;
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
  }
interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const productExists = state.items.find(item => item._id === action.payload._id
      );
      if (!productExists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
  },
});

// Export actions and reducer
export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
