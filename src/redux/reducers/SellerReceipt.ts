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

export interface IPayPending{
  transferencia: number;
  cheque: number;
  efectivo: number;
  total: number;
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
  inTermPayDiscount: boolean;
}
export interface ISellerReceipt {
  id: number;
  clientId: number;
  montoCheque: number;
  bancoTransf?: string | null;
  numOperación?: string | null;
  montoTransf: number;
  montoEfect: number;
  total: number;
  pending: boolean;
  applyPending: number;
  comments?: string | null;
  movements: any[];
  bills: any[]; // Asegúrate de definir la interfaz Movement
  cheques: any[]; // Asegúrate de definir la interfaz Cheque
  createdAt: string; // DateTime se mapea como string (ISO 8601)
}

export interface IGetSellerReceipt {
  // clientId: number;
  page: number;
  pending: boolean;
}

export interface IData {
  totalPages: number;
  totalResults: number;
  list: ISellerReceipt[];
}

export interface ISellerReceiptState {
  loading: boolean;
  data: IData;
  error: string;
  totalPending: number;
}

const initialState: ISellerReceiptState = {
  loading: false,
  data: {
    list: [],
    totalPages: 1,
    totalResults: 0,
  },
  error: "",
  totalPending: 0,
};

export const AddPay = createAsyncThunk<string, ICreateSellerReceipt>(
  "CREATE_RECEIPT",
  async (sendData: ICreateSellerReceipt) => {
    try {
      const response: string = await sellerRequest.CreateSellerReceipt(
        sendData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const GetPays = createAsyncThunk<IData, IGetSellerReceipt>(
  "GET_RECEIPT",
  async (sendData: IGetSellerReceipt) => {
    try {
      const response: IData = await sellerRequest.GetSellerReceipt(
        sendData.pending,
        sendData.page
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const SellerReceiptSlice = createSlice({
  name: "SellerReceipt",
  initialState: initialState,
  reducers: {
    resetSellerReceipt: (state) => {
      state.loading = false;
      state.error = "";
      state.data = initialState.data;
      state.totalPending = initialState.totalPending;
    },
  }, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(AddPay.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddPay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(AddPay.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(GetPays.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetPays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(GetPays.fulfilled, (state, action) => {
        
        state.loading = false;
        state.error = "";
        state.data = action.payload;
      });
  },
});

export const { resetSellerReceipt } = SellerReceiptSlice.actions;

export default SellerReceiptSlice.reducer;
