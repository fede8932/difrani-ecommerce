/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as rentabRequest from "../../axios/request/rentabRequest";

export interface IAddRentab {
  brandId: number;
  clientId: number;
  percentage: number;
}

export interface IResGetRentab {
  id: number;
  brandId: number | null;
  brand: {
    id: number;
    name: string;
  } | null;
  surchargePercentage: number;
}

export interface IAddGeneralRentab {
  id: number; // id del registro en tabla rentabilidad
  percentage: number;
}

export interface IRentaState {
  loading: boolean;
  byBrand: IResGetRentab[];
  general: IResGetRentab;
  error: string;
}

const initialState: IRentaState = {
  loading: false,
  byBrand: [],
  general: { brandId: null, id: 0, surchargePercentage: 0.35, brand: null },
  error: "",
};

export const GetAllRentaPercentState = createAsyncThunk<
  IResGetRentab[],
  number
>("RENTAB_LIST", async (clientId: number) => {
  try {
    const response: IResGetRentab[] = await rentabRequest.GetAllCustomerRentab(
      clientId
    );
    return response;
  } catch (error) {
    throw error;
  }
});

export const UpdateGralPercentState = createAsyncThunk<
  IResGetRentab,
  IAddGeneralRentab
>("UPDATE_GRAL_RENTAB", async (data: IAddGeneralRentab) => {
  try {
    const response: IResGetRentab = await rentabRequest.UploadGeneralRentab(
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
});

export const DeleteBrandPercentState = createAsyncThunk<number, number>(
  "DELETE_RENTAB",
  async (id: number) => {
    try {
      const response: number = await rentabRequest.DeleteBrandRentab(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const AddBrandPercentState = createAsyncThunk<IResGetRentab, IAddRentab>(
  "ADD_RENTAB_BRAND",
  async (data: IAddRentab) => {
    try {
      const response: IResGetRentab = await rentabRequest.AddBrandRentab(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const rentabSlice = createSlice({
  name: "rentabilidad",
  initialState: initialState,
  reducers: {
    changeGralInput: (state, action: PayloadAction<string>) => {
      state.general.surchargePercentage = Number(action.payload) / 100;
    },
  }, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(GetAllRentaPercentState.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllRentaPercentState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        GetAllRentaPercentState.fulfilled,
        (state, action: PayloadAction<IResGetRentab[]>) => {
          const gral: IResGetRentab | undefined = action.payload.find(
            (item) => item.brandId == null
          );
          const gralIndex: number = gral ? action.payload.indexOf(gral) : -1;
          state.loading = false;
          state.general = gral ? gral : state.general;
          if (gralIndex !== -1) {
            action.payload.splice(gralIndex, 1); // Eliminar el elemento
          }
          state.byBrand = action.payload;
        }
      )
      .addCase(UpdateGralPercentState.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateGralPercentState.rejected, (state, action) => {
        state.error = action.error.message ?? "Error desconocido";
        state.loading = false;
      })
      .addCase(
        UpdateGralPercentState.fulfilled,
        (state, action: PayloadAction<IResGetRentab>) => {
          state.general = action.payload;
          state.loading = false;
        }
      )
      .addCase(DeleteBrandPercentState.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteBrandPercentState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        DeleteBrandPercentState.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.byBrand = state.byBrand.filter(
            (item) => item.id != action.payload
          );
          state.loading = false;
        }
      )
      .addCase(AddBrandPercentState.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddBrandPercentState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        AddBrandPercentState.fulfilled,
        (state, action: PayloadAction<IResGetRentab>) => {
          state.byBrand = [...state.byBrand, action.payload];
          state.loading = false;
        }
      );
  },
});

export const { changeGralInput } = rentabSlice.actions;

export default rentabSlice.reducer;
