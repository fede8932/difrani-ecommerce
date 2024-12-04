/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as cartRequest from "../../axios/request/cartRequest";
import * as calcDiscounts from "../../axios/request/calcDiscounts";

export interface ISendItemData {
  cartId: number;
  amount: number;
  productId: number;
  brandId: number;
}

export interface ISendItemChange {
  itemId: number;
  amount: number;
}

export interface IResAddItem {
  id: number;
  amount: number;
  cartId: number;
  productId: number;
  product: IProduct;
}

export interface IProduct {
  id: number;
  article: string;
  sales: any[];
  description: string;
  brand: { id: number; name: string; code: string; rentabilidad: number, sales: any[] };
  price: { price: number; endPrice: number };
  stock: { stock: number; minStock: number };
  images: string[];
}

export interface ICartInitialState {
  loading: boolean;
  data: IResAddItem[];
  itemsAmount: number;
  totalDiscounts: number;
  error: string;
}

const initialState: ICartInitialState = {
  loading: false,
  itemsAmount: 0,
  data: [],
  error: "",
  totalDiscounts: 0,
};

export const GetAllCartItemsState = createAsyncThunk<
  IResAddItem[],
  number /*primero es el tipo que devuelve y segundo el tipo que recibe*/
>("CART_ITEM_LIST", async (cartId: number) => {
  try {
    const response: IResAddItem[] = await cartRequest.GetAllCartItem(cartId);
    return response;
  } catch (error) {
    throw error;
  }
});

export const AddCartItemsState = createAsyncThunk<IResAddItem, ISendItemData>(
  "ADD_CART_ITEM",
  async (sendItem: ISendItemData) => {
    try {
      const response: IResAddItem = await cartRequest.AddCartItem(sendItem);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const ChangeAmountCartItemsState = createAsyncThunk<
  IResAddItem,
  ISendItemChange
>("UPDATE_CART_ITEM", async (send: ISendItemChange) => {
  try {
    const { itemId, amount } = send;
    const response: IResAddItem = await cartRequest.ChangeAmountCartItem({
      itemId: itemId,
      amount: amount,
    });
    return response;
  } catch (error) {
    throw error;
  }
});

export const DelCartItemsState = createAsyncThunk<number, number>(
  "DEL_CART_ITEM",
  async (itemId: number) => {
    try {
      const response: number = await cartRequest.DeleteCartItem(itemId);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const SendOrderState = createAsyncThunk<string, number>(
  "SEND_ORDER",
  async (cartId: number) => {
    try {
      const response: string = await cartRequest.SendOrder(cartId);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "carrito",
  initialState: initialState,
  reducers: {
    discounts: (state, action) => {
      const { data, discount } = action.payload;
      state.totalDiscounts = calcDiscounts.calcDiscounts(data, discount);
    }
  }, // Puedes definir acciones síncronas aquí si es necesario
  extraReducers: (builder) => {
    builder
      .addCase(GetAllCartItemsState.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllCartItemsState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        GetAllCartItemsState.fulfilled,
        (state, action: PayloadAction<IResAddItem[]>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = "";
          state.itemsAmount = action.payload.length;
        }
      )
      .addCase(AddCartItemsState.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddCartItemsState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        AddCartItemsState.fulfilled,
        (state, action: PayloadAction<IResAddItem>) => {
          // eslint-disable-next-line prefer-const
          let actualList = [...state.data];
          let actualAmount = state.itemsAmount;
          const index: number = actualList.findIndex(
            (item) => item.productId == action.payload.productId
          );
          if (index != -1) {
            actualList[index] = action.payload;
          } else {
            actualList.push(action.payload);
            actualAmount++;
          }
          state.itemsAmount = actualAmount;
          state.data = actualList;
          state.error = "";
          state.loading = false;
        }
      )
      .addCase(DelCartItemsState.pending, (state) => {
        state.loading = true;
      })
      .addCase(DelCartItemsState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(
        DelCartItemsState.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.error = "";
          state.data = state.data.filter((item) => item.id != action.payload);
          state.itemsAmount = state.itemsAmount - 1;
        }
      )
      .addCase(SendOrderState.pending, (state) => {
        state.loading = true;
      })
      .addCase(SendOrderState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(SendOrderState.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.data = [];
        state.itemsAmount = 0;
      })
      .addCase(ChangeAmountCartItemsState.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangeAmountCartItemsState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error desconocido";
      })
      .addCase(ChangeAmountCartItemsState.fulfilled, (state, action) => {
        const newData = state.data.map((item) => {
          if (item.id == action.payload.id) {
            return action.payload;
          }
          return item;
        });
        state.loading = false;
        state.error = "";
        state.data = newData;
      });
  },
});

export const { discounts } = cartSlice.actions;

export default cartSlice.reducer;
