/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as discountsRequest from "../../axios/request/discountsRequest";

export interface IResGetDiscounts {
  id: number;
  porcentaje: number;
  brandId: number;
}

export interface IState {
  loading: boolean;
  data: IResGetDiscounts[];
  error: string;
}

const initialState: IState = {
  loading: false,
  data: [],
  error: "",
};

export const GetAllDiscountState = createAsyncThunk<IResGetDiscounts[], number>(
  "DISCOUNTS_LIST",
  async (clientId: number) => {
    try {
      const response = await discountsRequest.GetAllCustomerDiscounts(clientId);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const discountsSlice = createSlice({
  name: "descuentos",
  initialState: initialState,
  reducers: {}, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(GetAllDiscountState.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllDiscountState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        GetAllDiscountState.fulfilled,
        (state, action: PayloadAction<IResGetDiscounts[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      );
  },
});

export default discountsSlice.reducer;
