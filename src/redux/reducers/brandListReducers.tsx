/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as brandsRequest from "../../axios/request/brandsRequest";

export interface IBrand {
  id: number;
  name: string;
  code: string;
  rentabilidad: number;
}

export interface IGetBrandsInitialState {
  loading: boolean;
  list: IBrand[];
  select: IBrand | null;
  error: string;
}

const initialState: IGetBrandsInitialState = {
  loading: false,
  list: [],
  select: null,
  error: "",
};

export const GetAllBrandsState = createAsyncThunk<IBrand[]>(
  "BRAND_LIST",
  async () => {
    try {
      const response: IBrand[] = await brandsRequest.GetAllBrands();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState: initialState,
  reducers: {
    selectBrandById: (state, action: PayloadAction<number>) => {
      const selectedBrand =
        state.list.find((brand) => brand.id === action.payload) || null;
      state.select = selectedBrand;
    },
    resetBrandListState: () => initialState,
  }, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(GetAllBrandsState.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllBrandsState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        GetAllBrandsState.fulfilled,
        (state, action: PayloadAction<IBrand[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      );
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { selectBrandById, resetBrandListState } = brandSlice.actions;

export default brandSlice.reducer;
