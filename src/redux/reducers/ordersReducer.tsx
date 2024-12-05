/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as ordersRequest from "../../axios/request/ordersRequest";

export interface order {
  id: number;
  numero: string;
  date: string;
  status: number | string;
  subTotal: number;
  iva: number;
  total: number;
  payPending: boolean;
  saldoOferta?: number;
}
export interface IGetOrders {
  page: number;
  rows: number;
  clientId: number;
}

export interface ResGetOrders {
  totalPages: number;
  totalRows: number;
  list: order[];
}
export interface IOrdersState {
  loading: boolean;
  data: {
    totalPages: number;
    totalRows: number;
    list: order[];
  };
  error: string;
}

const initialState: IOrdersState = {
  loading: false,
  data: { totalPages: 0, totalRows: 0, list: [] },
  error: "",
};

export const GetOrderState = createAsyncThunk<ResGetOrders, IGetOrders>(
  "ORDER_LIST",
  async (data: IGetOrders) => {
    try {
      const response: ResGetOrders = await ordersRequest.GetAllOrders(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const catalogoSlice = createSlice({
  name: "ordenes",
  initialState: initialState,
  reducers: {}, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(GetOrderState.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetOrderState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        GetOrderState.fulfilled,
        (state, action: PayloadAction<ResGetOrders>) => {
          state.loading = false;
          state.data = action.payload;
        }
      );
  },
});

export default catalogoSlice.reducer;
