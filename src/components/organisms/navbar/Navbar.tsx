import styled from "styled-components";
import View from "../../atoms/view/View";
import logo from "../../../assets/logo/logo_sin_fondo.png";
import Img from "../../atoms/img/Img";
import Button from "../../atoms/button/Button";
import CustomInput from "../../molecules/input/CustomInput";
import Menu from "../../molecules/menu/Menu";
import IconButton from "../../atoms/iconButton/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchInput } from "../../../redux/reducers/searchInputReducer";
import { RootState } from "../../../redux/store";
import { ISearchProductInitialState } from "../../../redux/reducers/catalogoReducer";
import ItemsCount from "../../molecules/cartItemCount/ItemsCount";
import Rentab from "../editRentab/Rentab";
import ListMenu from "../../molecules/listMenu/ListMenu";
import RoleProtectedComponent from "../../../protected/RoleProtectedComponent";

interface Props {}

const NavbarContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  position: fixed;
  width: 100vw;
  z-index: 20;
`;

const ButtonContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 50px;
  padding: 5px 15px;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(7, 197, 155, 0.1);
  -moz-box-shadow: 0px 0px 5px 0px rgba(7, 197, 155, 0.1);
  box-shadow: 0px 0px 5px 0px rgba(7, 197, 155, 0.1);
  background: rgba(255, 255, 255, 0.5); /* Fondo semitransparente */
  backdrop-filter: blur(10px); /* Desenfoque del fondo */
`;

const ButtonImgContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const ButtonSearchContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  width: 450px;
  justify-content: space-around;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Navbar(_props: Props): React.ReactNode {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const handleChange = (value: string) => {
    if (pathname != "/") {
      navigate("/");
    }
    dispatch(setSearchInput(value));
  };

  const catalogState: ISearchProductInitialState = useSelector(
    (state: RootState) => state.catalogo
  );

  return (
    <NavbarContainer height="54px">
      <ButtonContainer width="1500px" height="54px">
        <ButtonImgContainer>
          <Img
            src={logo}
            alt="logo"
            width="155px"
            onClick={() => {
              navigate("/");
            }}
          />
          <div
            style={{
              width: "375px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              invert
              color="primary"
              text="Catálogo"
              height="25px"
              onClick={() => {
                navigate("/catalogo");
              }}
            />
            <Button
              invert
              color="primary"
              text="Pedidos"
              height="25px"
              onClick={() => {
                navigate("/pedidos");
              }}
            />
            <Button
              invert
              color="primary"
              text="Estado de cuenta"
              height="25px"
              onClick={() => {
                navigate("/resumen");
              }}
            />
            <Button
              invert
              color="primary"
              text="Contacto"
              height="25px"
              onClick={() => {
                navigate("/contacto");
              }}
            />
          </div>
        </ButtonImgContainer>
        <ButtonSearchContainer>
          <CustomInput
            loading={catalogState.loading}
            placeholder="Buscar..."
            width="300px"
            icon="search"
            onChange={handleChange}
          />
          <RoleProtectedComponent accessList={[4]}>
            <Rentab>
              <IconButton icon="manufacturing" size="24px" />
            </Rentab>
          </RoleProtectedComponent>
          <RoleProtectedComponent accessList={[4]}>
            <ItemsCount>
              <IconButton
                icon="shopping_cart"
                size="24px"
                onClick={() => {
                  navigate("/carrito");
                }}
              />
            </ItemsCount>
          </RoleProtectedComponent>
          <Menu
            position="left"
            button={<IconButton icon="account_circle" size="24px" />}
          >
            <ListMenu />
          </Menu>
        </ButtonSearchContainer>
      </ButtonContainer>
    </NavbarContainer>
  );
}

export default Navbar;
