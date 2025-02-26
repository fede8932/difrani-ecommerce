/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as sellerRequest from "../../axios/request/sellerRequest";

export interface IDailyClosingSeller {
  id: number;
  sellerId: number;
  totalCheque: number;
  totalTransferencia: number;
  totalEfectivo: number;
  totalCierre: number;
  comments?: string;
  movements: any[];
  sellerReceipts: any[];
  seller: any;
  createdAt: string;
}

export interface IDataClos {
  totalPages: number;
  totalResults: number;
  list: IDailyClosingSeller[];
}

export interface ISellerClosingState {
  loading: boolean;
  data: IDataClos;
  error: string;
}

const initialState: ISellerClosingState = {
  loading: false,
  data: {
    list: [],
    totalPages: 1,
    totalResults: 0,
  },
  error: "",
};

export const CreateClosing = createAsyncThunk<IDailyClosingSeller>(
  "ADD_CLOSING",
  async () => {
    try {
      const response: IDailyClosingSeller =
        await sellerRequest.ClosingGenerate();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const GetAllClosing = createAsyncThunk<
  IDataClos,
  { pending: boolean; page: number }
>("GET_CLOSING", async (sendData) => {
  try {
    const response: IDataClos = await sellerRequest.GetAllClosing(sendData);
    return response;
  } catch (error) {
    throw error;
  }
});

const SellerClosingSlice = createSlice({
  name: "SellerClosing",
  initialState: initialState,
  reducers: {
    resetSellerClosing: (state) => {
      state.loading = false;
      state.error = "";
      state.data = initialState.data;
    },
  }, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
    .addCase(CreateClosing.pending, (state) => {
      state.loading = true;
    })
    .addCase(CreateClosing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Error desconocido";
    })
    .addCase(CreateClosing.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.data.list.push(action.payload);
    })
    .addCase(GetAllClosing.pending, (state) => {
      state.loading = true;
    })
    .addCase(GetAllClosing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Error desconocido";
    })
    .addCase(GetAllClosing.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.data = action.payload;
    });
  },
});

export const { resetSellerClosing } = SellerClosingSlice.actions;

export default SellerClosingSlice.reducer;
