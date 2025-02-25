/* eslint-disable prefer-const */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as acountRequest from "../../axios/request/currentAcountRequest";
import { redondearCuatroDecimales } from "../../utils";

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
  saldoPend: number;
  numComprobante: number;
  apply: boolean;
  payDetail: { comprobanteVendedor: string };
  pending: boolean;
  marc?: boolean;
  payInProcess?: boolean
}

export interface ISelectMovements {
  movement: IMovements;
  saldo: number;
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
  selectMovements: ISelectMovements[];
  totalSelect: number;
}

const initialState: IAcountState = {
  loading: false,
  data: { pages: 0, client: null, moviments: [] },
  error: "",
  selectMovements: [],
  totalSelect: 0,
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
      const movement: IMovements = action.payload;
      const selectMoviments = [...state.selectMovements];
      let total = state.totalSelect;
      const index = selectMoviments.findIndex(
        (item) => item.movement.id == movement.id
      );
      if (index < 0) {
        //No está en la lista, lo agrego
        const newItem: ISelectMovements = {
          movement: movement,
          saldo: redondearCuatroDecimales(
            movement.type == 0
              ? movement.saldoPend
              : movement.type == 1 || movement.type == 3
              ? -movement.total
              : 0
          ),
        };
        selectMoviments.push(newItem);
        total += redondearCuatroDecimales(newItem.saldo);
      } else {
        //Está en la lista, lo saco
        total -= redondearCuatroDecimales(selectMoviments[index].saldo);
        selectMoviments.splice(index, 1);
      }
      state.totalSelect = redondearCuatroDecimales(total);
      state.selectMovements = selectMoviments;
    },
    resetAcountState: (state) => {
      state.loading = initialState.loading;
      state.data = initialState.data;
      state.error = initialState.error;
      state.selectMovements = initialState.selectMovements;
      state.totalSelect = initialState.totalSelect;
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
export const { toggleMarc, resetAcountState } = acountSlice.actions;

export default acountSlice.reducer;
