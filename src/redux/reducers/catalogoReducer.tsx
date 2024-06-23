/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as productsRequest from "../../axios/request/productsRequest";

interface ISearchProductState {
  page: number;
  rows: number;
  text?: string;
  vMarc?: string;
  pMarc?: string;
}

export interface IProduct {
  id: number;
  article: string;
  description: string;
  brand: { id: number; name: string; code: string; rentabilidad: number };
  price: { price: number; endPrice: number };
  stock: { stock: number; minStock: number };
  images: string[];
}

export interface ISearchProductInitialState {
  loading: boolean;
  data: { pages: number; products: IProduct[] };
  error: string;
}

const initialState: ISearchProductInitialState = {
  loading: false,
  data: { pages: 0, products: [] },
  error: "",
};

export const SearchProductState = createAsyncThunk<
  { pages: number; products: IProduct[] },
  ISearchProductState /*primero es el tipo que devuelve y segundo el tipo que recibe*/
>("CATALOGO_LIST", async (data) => {
  try {
    const response = await productsRequest.SearchCatalogo(data);
    return response;
  } catch (error) {
    throw error;
  }
});

const catalogoSlice = createSlice({
  name: "catalogo",
  initialState: initialState,
  reducers: {}, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(SearchProductState.pending, (state) => {
        state.loading = true;
      })
      .addCase(SearchProductState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        SearchProductState.fulfilled,
        (
          state,
          action: PayloadAction<{
            pages: number;
            products: IProduct[];
          }>
        ) => {
          state.loading = false;
          state.data = action.payload;
        }
      );
  },
});

export default catalogoSlice.reducer;
