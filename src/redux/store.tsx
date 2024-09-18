import { configureStore } from "@reduxjs/toolkit";
// import logger from "redux-logger";
import catalogoReducer from "./reducers/catalogoReducer";
import brandsReducer from "./reducers/brandListReducers";
import searchInputReducer from "./reducers/searchInputReducer";
import cartInputReducer from "./reducers/cartListReducer";
import discountsReducer from "./reducers/discountsReducer";
import rentabReducer from "./reducers/rentabReducer";
import ordersReducer from "./reducers/ordersReducer";
import acountsReducer from "./reducers/acountReducer";
import userReducer from "./reducers/userReducer";
import sellerReducer from "./reducers/sellerReducer";
import orderItemsReducer from "./reducers/orderItemsReducer";

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(/*logger*/),
  reducer: {
    user: userReducer,
    searchInput: searchInputReducer,
    catalogo: catalogoReducer,
    brands: brandsReducer,
    cartList: cartInputReducer,
    discounts: discountsReducer,
    rentabilidad: rentabReducer,
    orders: ordersReducer,
    acount: acountsReducer,
    clientsBySeller: sellerReducer,
    orderItems: orderItemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
