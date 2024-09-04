/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as userRequest from "../../axios/request/userRequest";

export interface ILogin {
  cuit: string;
  password: string;
}

export interface IDataUser {
  userId: number;
  rolId: number;
  cartId: number;
  clientId: number;
  name: string;
  lastName: string;
  razonSocial: string;
}

export interface IUserState {
  pending: boolean;
  loading: boolean;
  data: IDataUser | null;
  user: boolean;
  error: string;
}

const initialState: IUserState = {
  pending: true,
  loading: false,
  data: null,
  user: false,
  error: "",
};

export const LoginState = createAsyncThunk<IDataUser, ILogin>(
  "LOGIN",
  async (data: ILogin) => {
    try {
      const response: IDataUser = await userRequest.Login(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const MeState = createAsyncThunk<IDataUser>("ME", async () => {
  try {
    const response: IDataUser = await userRequest.Me();
    return response;
  } catch (error) {
    throw error;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setClientId: (
      state,
      action: PayloadAction<{ clientId: number; cartId: number }>
    ) => {
      const user = state.data;
      user!.clientId = action.payload.clientId;
      user!.cartId = action.payload.cartId;
      state.data = user;
    },
  }, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(LoginState.pending, (state) => {
        state.loading = true;
      })
      .addCase(LoginState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
        state.user = false;
      })
      .addCase(
        LoginState.fulfilled,
        (state, action: PayloadAction<IDataUser>) => {
          state.loading = false;
          state.error = "";
          state.data = action.payload;
          state.user = true;
        }
      )
      .addCase(MeState.pending, (state) => {
        state.loading = true;
      })
      .addCase(MeState.rejected, (state, action) => {
        state.pending = false;
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
        state.user = false;
      })
      .addCase(MeState.fulfilled, (state, action: PayloadAction<IDataUser>) => {
        state.loading = false;
        state.pending = false;
        state.error = "";
        state.data = action.payload;
        state.user = true;
      });
  },
});
export const { setClientId } = userSlice.actions;

export default userSlice.reducer;
