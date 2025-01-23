/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as sellerRequest from "../../axios/request/sellerRequest";

export interface ICheQueType {
  montoCh: string;
  bancoCh: string;
  numCh: string;
  cobroCh: string | string[];
}

export interface ICreateSellerReceipt {
  clientId?: number;
  userId?: number; //del vendedor
  montoEfect: number;
  montoTransf: number;
  bancoTransf: string;
  numOperación: string;
  comments: string;
  chequeData: ICheQueType[];
  movIds: number[];
}

export interface ISellerReceiptState {
  loading: boolean;
  list: any[];
  error: string;
}

const initialState: ISellerReceiptState = {
  loading: false,
  list: [],
  error: "",
};

export const AddPay = createAsyncThunk<string, ICreateSellerReceipt>(
  "CREATE_RECEIPT",
  async (sendData: ICreateSellerReceipt) => {
    try {
      const response: string = await sellerRequest.CreateSellerReceipt(sendData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const SellerReceiptSlice = createSlice({
  name: "SellerReceipt",
  initialState: initialState,
  reducers: {}, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(AddPay.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddPay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        AddPay.fulfilled,
        (state) => {
          state.loading = false;
          state.error = "";
        }
      );
  },
});

export default SellerReceiptSlice.reducer;
