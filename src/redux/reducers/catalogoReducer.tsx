/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as productsRequest from "../../axios/request/productsRequest";
import * as equivalencesRequest from "../../axios/request/equivalenceRequest";

interface ISearchProductState {
  page: number;
  rows: number;
  text?: string;
  vMarc?: string;
  pMarc?: string;
  sale?: boolean;
}

interface ISearchEquiv {
  id: number;
  description: string;
  images: { id: number; url: string }[];
  products: IProduct[];
}

export interface ISale {
  id: number;
  referencia: string;
  brand?: { id: number; name: string; code: string };
  product?: { id: number; article: string; code: string };
  observations?: string;
  minUnit: number;
  percentage: number;
}

export interface IProduct {
  id: number;
  article: string;
  description: string;
  brand: {
    id: number;
    name: string;
    code: string;
    rentabilidad: number;
    sales: ISale[];
  };
  price: { price: number; endPrice: number };
  stock: { stock: number; minStock: number };
  sales: ISale[];
  images: any[];
  equivalence: any;
}

export interface ISearchProductInitialState {
  loading: boolean;
  data: { totalPages: number; list: IProduct[] };
  error: string;
}

const initialState: ISearchProductInitialState = {
  loading: false,
  data: { totalPages: 0, list: [] },
  error: "",
};

export const SearchProductState = createAsyncThunk<
  { totalPages: number; list: IProduct[] },
  ISearchProductState /*primero es el tipo que devuelve y segundo el tipo que recibe*/
>("CATALOGO_LIST", async (data) => {
  try {
    const response = await productsRequest.SearchCatalogo(data);
    return response;
  } catch (error) {
    throw error;
  }
});

export const SearchEquivalencesState = createAsyncThunk<
  ISearchEquiv,
  number /*primero es el tipo que devuelve y segundo el tipo que recibe*/
>("CATALOGO_EQUIV_LIST", async (id) => {
  try {
    const response = await equivalencesRequest.SearchEquivalences(id);
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
            totalPages: number;
            list: IProduct[];
          }>
        ) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(SearchEquivalencesState.pending, (state) => {
        state.loading = true;
      })
      .addCase(SearchEquivalencesState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        SearchEquivalencesState.fulfilled,
        (state, action: PayloadAction<ISearchEquiv>) => {
          // eslint-disable-next-line prefer-const
          const images = action.payload.images;
          const newList = [...action.payload.products];

          newList.map((p: IProduct) => {
            p.equivalence = { images: images };
          });
          state.loading = false;
          state.data = { totalPages: 1, list: newList };
        }
      );
  },
});

export default catalogoSlice.reducer;
