import styled from "styled-components";
import View from "../../atoms/view/View";
import { IUserState } from "../../../redux/reducers/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { hexToRgba } from "../../../aux/rgbaConverter";
import { LogOut } from "../../../axios/request/userRequest";
import { breakpoints } from "../../../resolutions";

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

function ListMenu(_props: Props): React.ReactNode {
  const userState: IUserState = useSelector((state: RootState) => state.user);
  const logOut = async () => {
    // Remove cookies with path and domain
    await LogOut();

    // Reload the page to reflect changes
    window.location.reload();
  };

  return (
    <ListContainer>
      <Title>{`${userState.data?.name.toUpperCase()}`}</Title>
      <MyDivider></MyDivider>
      <MobileButtonOnly onClick={() => {}}>Catálogo</MobileButtonOnly>
      <MobileButtonOnly onClick={() => {}}>Pedidos</MobileButtonOnly>
      <MobileButtonOnly onClick={() => {}}>Cuenta</MobileButtonOnly>
      <MobileButtonOnly onClick={() => {}}>Contacto</MobileButtonOnly>
      <InvertStyledButton onClick={logOut}>Cerrar sesión</InvertStyledButton>
    </ListContainer>
  );
}

export default ListMenu;
