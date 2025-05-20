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
import { breakpoints } from "../../../resolutions";
import { useCallback } from "react";
import { debounce } from "lodash";

interface Props {}

const NavbarContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
  position: fixed;
  width: 100vw;
  z-index: 20;
`;

const LinkContainer = styled(View)`
  width: 375px;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: ${breakpoints.desktopSmall - 1}px) {
    display: none;
  }
`;

const ButtonContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  padding: 5px 15px;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(7, 197, 155, 0.1);
  -moz-box-shadow: 0px 0px 5px 0px rgba(7, 197, 155, 0.1);
  box-shadow: 0px 0px 5px 0px rgba(7, 197, 155, 0.1);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);

  @media (max-width: ${breakpoints.desktopSmall}px) {
    width: 100%;
  }
`;

const Search = styled(CustomInput)`
  @media (max-width: ${breakpoints.mobileSmall}px) {
    width: 85%;
  }
`;

const ButtonImgContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Logo = styled(Img)`
  @media (max-width: ${breakpoints.mobileLarge}px) {
    width: 85px;
  }
`;

const ButtonSearchContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  width: 550px;
  justify-content: space-around;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Navbar(_props: Props): React.ReactNode {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data } = useSelector((state: RootState) => state.user);

  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedDispatch = useCallback(
    debounce((value) => {
      dispatch(setSearchInput(value));
    }, 600), // 600 ms de espera para el debounce
    [dispatch]
  );

  const handleChange = (value: string) => {
    if (pathname != "/") {
      navigate("/");
    }
    debouncedDispatch(value);
  };

  const catalogState: ISearchProductInitialState = useSelector(
    (state: RootState) => state.catalogo
  );

  const ActionsCont = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    width: 100px;
    min-width: 100px;
  `;

  return (
    <NavbarContainer height="54px">
      <ButtonContainer width="100%" height="54px">
        <ButtonImgContainer>
          <Logo
            src={logo}
            alt="logo"
            width="105px"
            height="60px"
            onClick={() => {
              navigate("/");
            }}
          />
          <Search
            loading={catalogState.loading}
            placeholder="Buscar..."
            width="300px"
            icon="search"
            onChange={handleChange}
          />
        </ButtonImgContainer>
        <ButtonSearchContainer>
          <LinkContainer>
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
              text="Transacciones"
              height="25px"
              onClick={() => {
                navigate("/resumen");
              }}
            />
            <Button
              invert
              color="primary"
              text="Sugerencias"
              height="25px"
              onClick={() => {
                navigate("/sugerencias");
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
          </LinkContainer>
          <ActionsCont>
            <RoleProtectedComponent accessList={[4]}>
              <Rentab>
                <IconButton icon="settings" size="24px" />
              </Rentab>
            </RoleProtectedComponent>
            <RoleProtectedComponent accessList={[3, 4]}>
              <ItemsCount>
                {data?.cartId ? (
                  <IconButton
                    icon="production_quantity_limits"
                    size="24px"
                    onClick={() => {
                      navigate("/carrito");
                    }}
                  />
                ) : null}
              </ItemsCount>
            </RoleProtectedComponent>
            <Menu
              position="left"
              button={<IconButton icon="person_3" size="24px" />}
            >
              <ListMenu />
            </Menu>
          </ActionsCont>
        </ButtonSearchContainer>
      </ButtonContainer>
    </NavbarContainer>
  );
}

export default Navbar;
