import styled from "styled-components";
import View from "./components/atoms/view/View";
import Navbar from "./components/organisms/navbar/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Catalogo from "./views/catalogo/Catalogo";
import { Toaster } from "react-hot-toast";
import { useEffect, useMemo } from "react";
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
// import BloquedModal from "./components/organisms/bloquedModal/BloquedModal";
// import ChangePass from "./components/organisms/changePassForm/ChangePass";
import Comprobantes from "./views/comprobantes/Comprobantes";
import BotonFlotante from "./components/atoms/bootnFlotante/BotonFlotante";

const AppContainer = styled(View)`
  justify-content: space-between;
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%, /* Blanco */
    rgba(0, 0, 0, 1) 100% /* Negro */
  );
`;

const FilterView = styled(View)<{
  justifyContent?: string;
  top?: string;
  displayNone?: boolean;
}>`
  display: ${({ displayNone }) => (displayNone ? "none" : "flex")};
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
  const { pathname } = useLocation();

  const userState = useSelector((state: RootState) => state.user);

  const clientSelectView: boolean = useMemo(
    () => pathname == "/comprobantes",
    [pathname]
  );

  useEffect(() => {
    if (userState.data) {
      dispatch(GetAllCartItemsState(userState.data.cartId));
      dispatch(GetAllDiscountState(userState.data.clientId));
      dispatch(GetAllRentaPercentState(userState.data.clientId));
    }
    dispatch(GetAllBrandsState());
  }, [dispatch, userState.data]);
  return (
    <AppContainer>
      {
        /*<BloquedModal title="Cambiar contraseña">
          <ChangePass />
        </BloquedModal>*/
      }
      <Navbar />
      <View position="relative" margin="75px 0px">
        <RoleProtectedComponent accessList={[3]}>
          <FilterView displayNone={clientSelectView}>
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
            path="/comprobantes"
            element={
              <RoleProtectedView accessList={[3, 4]}>
                <Comprobantes />
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
      <BotonFlotante />
    </AppContainer>
  );
}

export default AppIn;
