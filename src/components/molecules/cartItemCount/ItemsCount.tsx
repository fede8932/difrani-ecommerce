/* eslint-disable no-constant-condition */
import styled from "styled-components";
import { hexToRgba } from "../../../aux/rgbaConverter";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ICartInitialState } from "../../../redux/reducers/cartListReducer";

interface Props {
  children: React.ReactNode;
}

const Count = styled.span`
  position: absolute;
  background-color: ${({ theme }) => hexToRgba(theme.colors.primary, 0.7)};
  color: ${({ theme }) => theme.colors.background};
  font-weight: 800;
  width: 13px;
  height: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  right: -3px;
  top: -5px;
  padding: 3px;
  box-shadow: 1px 0px 12px -1px rgba(0, 0, 0, 0.24);
  -webkit-box-shadow: 1px 0px 12px -1px rgba(0, 0, 0, 0.24);
  -moz-box-shadow: 1px 0px 12px -1px rgba(0, 0, 0, 0.24);
  font-size: 10px;
`;

function ItemsCount(props: Props): React.ReactElement {
  const { children } = props;
  const cartItemsState: ICartInitialState = useSelector(
    (state: RootState) => state.cartList
  );
  return (
    <div style={{ position: "relative" }}>
      {cartItemsState.itemsAmount > 0 ? (
        <Count>{cartItemsState.itemsAmount}</Count>
      ) : null}
      {children}
    </div>
  );
}

export default ItemsCount;
