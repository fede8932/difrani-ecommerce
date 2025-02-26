import styled from "styled-components";
import View from "../../atoms/view/View";
import { IUserState } from "../../../redux/reducers/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { hexToRgba } from "../../../aux/rgbaConverter";
import { LogOut } from "../../../axios/request/userRequest";
import { breakpoints } from "../../../resolutions";
import { useNavigate } from "react-router-dom";
import PricesProtected from "../../../protected/PricesProtected";
import RoleProtectedComponent from "../../../protected/RoleProtectedComponent";

interface Props {}

const ListContainer = styled(View)`
  width: 125px;
`;

const MyDivider = styled.div`
  margin-top: 2px;
  margin-bottom: 2px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.medium};
`;

const Title = styled.span`
  color: ${({ theme }) => theme.colors.wideText};
  width: 100&;
  display: flex;
  justify-content: center;
`;

const InvertStyledButton = styled.button`
  all: unset;
  padding: 3px 7px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.5s ease;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background-color: ${({ theme }) => hexToRgba(theme.colors.secundary, 0.18)};
  }
`;

const MobileButtonOnly = styled(InvertStyledButton)`
  @media (min-width: ${breakpoints.desktopSmall}px) {
    display: none;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ListMenu(_props: Props): React.ReactNode {
  const userState: IUserState = useSelector((state: RootState) => state.user);
  const logOut = async () => {
    // Remove cookies with path and domain
    await LogOut();

    // Reload the page to reflect changes
    window.location.reload();
  };
  const navigate = useNavigate();

  return (
    <ListContainer>
      <Title>{`${userState.data?.name.toUpperCase()}`}</Title>
      <MyDivider></MyDivider>
      <PricesProtected>
        <MobileButtonOnly
          onClick={() => {
            navigate("/catalogo");
          }}
        >
          Catálogo
        </MobileButtonOnly>
      </PricesProtected>
      <PricesProtected>
        <MobileButtonOnly
          onClick={() => {
            navigate("/carrito");
          }}
        >
          Carrito
        </MobileButtonOnly>
      </PricesProtected>
      <PricesProtected>
        <MobileButtonOnly
          onClick={() => {
            navigate("/pedidos");
          }}
        >
          Pedidos
        </MobileButtonOnly>
      </PricesProtected>
      <PricesProtected>
        <MobileButtonOnly
          onClick={() => {
            navigate("/resumen");
          }}
        >
          Cuenta
        </MobileButtonOnly>
      </PricesProtected>
      <PricesProtected>
        <MobileButtonOnly
          onClick={() => {
            navigate("/contacto");
          }}
        >
          Contacto
        </MobileButtonOnly>
      </PricesProtected>
      <RoleProtectedComponent accessList={[3]}>
        <MobileButtonOnly
          onClick={() => {
            navigate("/comprobantes");
          }}
        >
          Comprobantes
        </MobileButtonOnly>
      </RoleProtectedComponent>
      <InvertStyledButton onClick={logOut}>Cerrar sesión</InvertStyledButton>
    </ListContainer>
  );
}

export default ListMenu;
