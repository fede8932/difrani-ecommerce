/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as viewRequest from "../../axios/request/productsRequest";

const initialState: { id: number; mode: string } = { id: 1, mode: "NONE" };

export const GetModeState = createAsyncThunk<{ id: number; mode: string }>(
  "GET_VIEW",
  async () => {
    try {
      const response: { id: number; mode: string } =
        await viewRequest.getView();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const setViewSlice = createSlice({
  name: "set_mode",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      GetModeState.fulfilled,
      (state, action: PayloadAction<{ id: number; mode: string }>) => {
        state.id = action.payload.id;
        state.mode = action.payload.mode;
      }
    );
  },
});

export default setViewSlice.reducer;
