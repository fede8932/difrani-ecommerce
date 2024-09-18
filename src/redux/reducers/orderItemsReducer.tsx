/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as ordersRequest from "../../axios/request/ordersRequest";

export interface Brand {
  id: number;
  name: string;
}
export interface Product {
  id: number;
  article: string;
  description: string;
  brand: Brand;
}
export interface Item {
  id: number;
  amount: number;
  buyPrice: number;
  sellPrice: number;
  product: Product;
}
export interface IGetOrderItems {
  page: number;
  rows: number;
  orderId: number;
}

export interface ResGetOrderItemss {
  totalPages: number;
  totalRows: number;
  list: Item[];
}
export interface IItemsState {
  loading: boolean;
  data: {
    totalPages: number;
    totalRows: number;
    list: Item[];
  };
  error: string;
}

const initialState: IItemsState = {
  loading: false,
  data: { totalPages: 0, totalRows: 0, list: [] },
  error: "",
};

export const GetItemsState = createAsyncThunk<
  ResGetOrderItemss,
  IGetOrderItems
>("ITEM_LIST", async (data: IGetOrderItems) => {
  try {
    const response: ResGetOrderItemss = await ordersRequest.GetOrderItems(data);
    return response;
  } catch (error) {
    throw error;
  }
});

const orderItemSlice = createSlice({
  name: "items_de_orden",
  initialState: initialState,
  reducers: {}, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(GetItemsState.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetItemsState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        GetItemsState.fulfilled,
        (state, action: PayloadAction<ResGetOrderItemss>) => {
          state.error = "";
          state.loading = false;
          state.data = action.payload;
        }
      );
  },
});

export default orderItemSlice.reducer;
