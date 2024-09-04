/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as sellerRequest from "../../axios/request/sellerRequest";

export interface IClient {
  id: number;
  razonSocial: string;
  cuit: string;
  cart: { id: number };
}

export interface IClientsState {
  loading: boolean;
  list: IClient[];
  error: string;
}

const initialState: IClientsState = {
  loading: false,
  list: [],
  error: "",
};

export const GetAllClientState = createAsyncThunk<IClient[], number>(
  "CLIENT_LIST",
  async (userId: number) => {
    try {
      const response: IClient[] = await sellerRequest.GetClientsBySeller(
        userId
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: initialState,
  reducers: {}, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(GetAllClientState.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllClientState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        GetAllClientState.fulfilled,
        (state, action: PayloadAction<IClient[]>) => {
          state.loading = false;
          state.error = "";
          state.list = action.payload;
        }
      );
  },
});

export default sellerSlice.reducer;
