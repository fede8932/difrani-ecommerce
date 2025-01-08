import styled from "styled-components";
import "./App.css";
import View from "./components/atoms/view/View";
import Navbar from "./components/organisms/navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Catalogo from "./views/catalogo/Catalogo";
import "@mantine/core/styles.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { AppDispatch, RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCartItemsState } from "./redux/reducers/cartListReducer";
import { GetAllDiscountState } from "./redux/reducers/discountsReducer";
import { GetAllRentaPercentState } from "./redux/reducers/rentabReducer";
import Footer from "./components/organisms/footer/Footer";
import Contacto from "./views/contacto/Contacto";
import Pedidos from "./views/pedidos/Pedidos";
import Resumen from "./views/resumen/Resumen";
import Carrito from "./views/carrito/Carrito";
import { GetAllBrandsState } from "./redux/reducers/brandListReducers";
import RoleProtectedView from "./protected/RoleProtectedView";
import RoleProtectedComponent from "./protected/RoleProtectedComponent";
import { breakpoints } from "./resolutions";
import ClientFilter from "./components/molecules/clientFilter/ClientFilter";
import BloquedModal from "./components/organisms/bloquedModal/BloquedModal";
import ChangePass from "./components/organisms/changePassForm/ChangePass";

const AppContainer = styled(View)`
  justify-content: space-between;
  min-height: 100vh;
  /* width: 100vw; */
  background: rgba(80, 255, 181, 0.28);
  background: -moz-linear-gradient(
    top,
    rgba(80, 255, 181, 0.28) 0%,
    #f8feff 100%
  );
  background: -webkit-linear-gradient(
    top,
    rgba(80, 255, 181, 0.28) 0%,
    #f8feff 100%
  );
  background: linear-gradient(
    to bottom,
    rgba(80, 255, 181, 0.28) 0%,
    #f8feff 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='rgba(80,255,181,0.28)', endColorstr='#f8feff',GradientType=0 );
`;

const FilterView = styled(View)<{ justifyContent?: string; top?: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent || "flex-start"};
  padding: 0px 15px 15px 15px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column;
    width: 100%;
  }
`;

function AppIn() {
  const dispatch: AppDispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userState.data) {
      dispatch(GetAllCartItemsState(userState.data.cartId));
      dispatch(GetAllDiscountState(userState.data.clientId));
      dispatch(GetAllRentaPercentState(userState.data.clientId));
    }
    dispatch(GetAllBrandsState());
  }, [userState.data]);
  return (
    <AppContainer>
      <BloquedModal title="Cambiar contraseña">
        <ChangePass />
      </BloquedModal>
      <Navbar />
      <View position="relative" margin="75px 0px">
        <RoleProtectedComponent accessList={[3]}>
          <FilterView>
            <ClientFilter userId={userState.data?.userId} />
          </FilterView>
        </RoleProtectedComponent>
        <Routes>
          <Route
            path="/"
            element={
              <RoleProtectedView accessList={[3, 4]}>
                <Catalogo />
              </RoleProtectedView>
            }
          />
          <Route
            path="/catalogo"
            element={
              <RoleProtectedView accessList={[3, 4]}>
                <Catalogo />
              </RoleProtectedView>
            }
          />
          <Route
            path="/pedidos"
            element={
              <RoleProtectedView accessList={[3, 4]}>
                <Pedidos />
              </RoleProtectedView>
            }
          />
          <Route
            path="/contacto"
            element={
              <RoleProtectedView accessList={[3, 4]}>
                <Contacto />
              </RoleProtectedView>
            }
          />
          <Route
            path="/resumen"
            element={
              <RoleProtectedView accessList={[3, 4]}>
                <Resumen />
              </RoleProtectedView>
            }
          />
          <Route
            path="/carrito"
            element={
              <RoleProtectedView accessList={[3, 4]}>
                <Carrito />
              </RoleProtectedView>
            }
          />
        </Routes>
      </View>
      <Footer />
      <Toaster
        gutter={-100}
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {
            margin: "55px 5px",
          },
        }}
      />
    </AppContainer>
  );
}

export default AppIn;
