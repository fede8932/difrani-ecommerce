/* eslint-disable no-useless-catch */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IProduct {
  id: number;
  article: string;
  description: string;
  brand: { id: number; name: string; code: string; rentabilidad: number };
  price: { price: number; endPrice: number };
  stock: { stock: number; minStock: number };
  images: any[];
}

const initialState: { value: string; page: number } = { value: "", page: 1 };

const searchInputSlice = createSlice({
  name: "search_input",
  initialState: initialState,
  reducers: {
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
      state.page = 1;
    },
    setSearchPage: (state, action: PayloadAction<number>) => {
      console.log(action.payload);
      state.page = action.payload;
    },
  }, // Puedes definir acciones síncronas aquí si es necesario
});

export const { setSearchInput, setSearchPage } = searchInputSlice.actions;

export default searchInputSlice.reducer;
