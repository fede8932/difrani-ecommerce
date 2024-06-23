import styled from "styled-components";
import View from "../../components/atoms/view/View";
import styles from "./carrito.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { hexToRgba } from "../../aux/rgbaConverter";
import {
  DelCartItemsState,
  GetAllCartItemsState,
  SendOrderState,
} from "../../redux/reducers/cartListReducer";
import toast from "react-hot-toast";
import {
  calcularBuyPrice,
  calcularBuyTotal,
  calcularItemSubTotal,
} from "../../aux/prices";
import Button from "../../components/atoms/button/Button";

interface Props {}

const ContactoContainer = styled(View)`
  width: 100%;
  align-items: center;
  margin-top: 75px;
`;

const TitleStyled = styled.p`
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 48px;
  font-weight: 500;
  transform: scaleY(1.03);
  transform: scalex(0.95);
  color: ${({ theme }) => theme.colors.wideText};
`;

const TitleStyledSpan = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const DescriptionStyled = styled.p`
  font-size: 13px;
  text-align: center;
  margin: 0px;
  width: 600px;
  color: ${({ theme }) => theme.colors.text};
`;

const ContactDataContainer = styled(View)`
  height: 580px;
  width: 77%;
  margin-top: 17px;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const Icon = styled.span<{ active: boolean; size?: string; color?: string }>`
  font-size: ${({ size }) => size || "30px"};
  margin-left: 10px;
  cursor: ${({ active }) => (active ? "pointer" : "")};
  color: ${({ active, theme, color }) =>
    !active
      ? ""
      : color
      ? hexToRgba(theme.colors[color], 0.6)
      : theme.colors.secundary};

  &:hover {
    color: ${({ theme, active, color }) =>
      !active
        ? ""
        : color
        ? hexToRgba(theme.colors[color], 1)
        : theme.colors.primary};
  }
`;

function Carrito(_props: Props): React.ReactNode {
  const dispatch: AppDispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cartList);
  const discountsState = useSelector((state: RootState) => state.discounts);

  const userState = useSelector((state: RootState) => state.user);

  const sendOrder = () => {
    if (cartState.itemsAmount < 1) {
      toast.error("No hay productos en el carrito");
      return;
    }
    dispatch(SendOrderState(userState.data?.cartId || 0))
      .then((res: any) => {
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("Pedido enviado con exíto");
        }
      })
      .catch((err: any) => {
        toast.error(err.message);
      });
  };

  const handleDelete = (id: number) => {
    dispatch(DelCartItemsState(id))
      .then((res: any) => {
        if (res.error) {
          toast.error(res.error);
          return;
        } else {
          toast.success("Eliminado");
        }
      })
      .catch((err: any) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    dispatch(GetAllCartItemsState(userState.data?.cartId || 0));
  }, [dispatch]);

  return (
    <ContactoContainer>
      <TitleStyled>
        Tu carrito de <TitleStyledSpan>Compras</TitleStyledSpan>
      </TitleStyled>
      <DescriptionStyled>
        En la sección de carrito, puedes ver el detalle de los productos que has
        añadido para comprar de manera rápida y sencilla. Encuentra información
        detallada sobre cada artículo, su precio, cantidad y opciones para
        gestionar tu compra.
      </DescriptionStyled>
      <ContactDataContainer>
        <div
          style={{ height: "480px", overflowY: "auto" }}
          className={styles.tableContainer}
        >
          <Table selectable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Código</TableHeaderCell>
                <TableHeaderCell>Marca</TableHeaderCell>
                <TableHeaderCell>Precio sin IVA</TableHeaderCell>
                <TableHeaderCell>Catidad</TableHeaderCell>
                <TableHeaderCell>Subtotal</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cartState.data.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.product?.article.toUpperCase()}</TableCell>
                  <TableCell>
                    {item.product?.brand.name.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    $
                    {calcularBuyPrice(
                      item.product?.price.price,
                      item.product?.brand.id,
                      item.product?.brand.rentabilidad,
                      discountsState.data
                    )}
                  </TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    $
                    {calcularItemSubTotal(
                      item.product?.price.price,
                      item.product?.brand.id,
                      item.product?.brand.rentabilidad,
                      discountsState.data,
                      item.amount
                    )}
                  </TableCell>
                  <TableCell>
                    <Icon
                      active
                      className="material-symbols-outlined"
                      size="23px"
                      color="alert"
                      onClick={() => handleDelete(item.id)}
                    >
                      delete_forever
                    </Icon>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            borderBottom: "1px solid #373241",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "600" }}>
            Subtotal:{" "}
            <span>
              ${calcularBuyTotal(cartState.data, discountsState.data).subtotal}
            </span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            borderBottom: "2px solid #373241",
            marginTop: "10px",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "600" }}>
            Total:{" "}
            <span>
              ${calcularBuyTotal(cartState.data, discountsState.data).total}
            </span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "15px",
          }}
        >
          <Button
            pending={cartState.loading}
            color="primary"
            text="Enviar pedido"
            height="30px"
            width="190px"
            onClick={sendOrder}
          />
        </div>
      </ContactDataContainer>
    </ContactoContainer>
  );
}

export default Carrito;
