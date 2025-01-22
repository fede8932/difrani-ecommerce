/* eslint-disable prefer-const */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as acountRequest from "../../axios/request/currentAcountRequest";

export interface ISend {
  rows: number;
  page: number;
  clientId: number;
  pending?: boolean;
}

export interface IMovements {
  id: number;
  type: number;
  fecha: string;
  billType: number;
  amount: number;
  iva: number;
  total: number;
  numComprobante: number;
  apply: boolean;
  payDetail: { comprobanteVendedor: string };
  pending: boolean;
  marc?: boolean;
}

interface ICurrentAcount {
  id: number;
  acountNumber: string;
  resume: number;
  status: boolean;
  movements: IMovements[];
}

export interface IClient {
  id: number;
  razonSocial: string;
  currentAcount: ICurrentAcount;
}

export interface IData {
  pages: number;
  client: IClient | null;
  moviments: IMovements[];
}

export interface IAcountState {
  loading: boolean;
  data: IData;
  error: string;
}

const initialState: IAcountState = {
  loading: false,
  data: { pages: 0, client: null, moviments: [] },
  error: "",
};

export const GetCurrentAcountState = createAsyncThunk<IData, ISend>(
  "MOVEMENTS_LIST",
  async (data: ISend) => {
    try {
      const response: IData = await acountRequest.GetCurrentAcount(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const acountSlice = createSlice({
  name: "current_acount",
  initialState: initialState,
  reducers: {
    toggleMarc: (state, action) => {
      let newList = [...state.data.moviments];
      const index = newList.findIndex((item) => item.id == action.payload);
      if (index > -1) {
        newList[index].marc = !newList[index].marc;
      }
      state.data.moviments = newList;
    },
  }, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(GetCurrentAcountState.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetCurrentAcountState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        GetCurrentAcountState.fulfilled,
        (state, action: PayloadAction<IData>) => {
          const newList = action.payload.moviments.map((item) => {
            item.marc = false;
            return item;
          });
          state.loading = false;
          state.data = action.payload;
          state.data.moviments = newList;
        }
      );
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { toggleMarc } = acountSlice.actions;

export default acountSlice.reducer;
