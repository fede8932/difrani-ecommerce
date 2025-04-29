/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import View from "../../components/atoms/view/View";
import styles from "./carrito.module.css";
import {
  Popup,
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
  discounts,
  GetAllCartItemsState,
  SendOrderState,
} from "../../redux/reducers/cartListReducer";
import toast from "react-hot-toast";
import {
  calcularBuyPrice,
  calcularBuyTotal,
  calcularItemSubTotal,
  formatNumberToString,
} from "../../aux/prices";
import Button from "../../components/atoms/button/Button";
import CartInput from "../../components/atoms/cartInput/CartInput";
import { breakpoints } from "../../resolutions";
import RoleProtectedComponent from "../../protected/RoleProtectedComponent";
import CustomIcon from "../../components/atoms/icon/Icon";
import { GetTemplate, UploadCartExcel } from "../../axios/request/cartRequest";
import { FileUploader } from "../../components/atoms/fileUploader/FileUploader";

interface Props {}

const ContactoContainer = styled(View)`
  width: 100%;
  align-items: center;
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

const ContactDataContainer = styled(View)`
  height: 580px;
  width: 77%;
  margin-top: 17px;
  margin-bottom: 10px;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    width: 100%;
  }
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

  const sendFile = async (files: FileList | null) => {
    if (files == null || files.length == 0) {
      toast.error("No hay archivo");
      return;
    }
    try {
      await UploadCartExcel(userState.data!.cartId, files[0]);
      toast.success("Pedido cargado correctamente");
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const sendOrder = () => {
    if (cartState.itemsAmount < 1) {
      toast.error("No hay productos en el carrito");
      return;
    }
    if (cartState.loading) {
      console.log("no se pued eenviar");
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
    dispatch(
      discounts({ data: cartState.data, discount: discountsState.data })
    );
  }, [cartState.data, discountsState.data, dispatch]);

  useEffect(() => {
    dispatch(GetAllCartItemsState(userState.data?.cartId || 0));
  }, [dispatch]);

  return (
    <ContactoContainer>
      <TitleStyled>
        Tu carrito de <TitleStyledSpan>Compras</TitleStyledSpan>
      </TitleStyled>
      <RoleProtectedComponent accessList={[4]}>
        <View flexDirection="row">
          <Popup
            content="Descargar plantilla de pedidos"
            trigger={
              <CustomIcon
                margin="0px 3px"
                color="wideText"
                size="25px"
                active={false}
                onClick={async () => {
                  await GetTemplate();
                }}
              >
                cloud_download
              </CustomIcon>
            }
          />
          <FileUploader onFileChange={sendFile}>
            <Popup
              content="Importar pedido en excel"
              trigger={
                <CustomIcon
                  margin="0px 3px"
                  color="wideText"
                  size="25px"
                  active={false}
                >
                  file_open
                </CustomIcon>
              }
            />
          </FileUploader>
        </View>
      </RoleProtectedComponent>
      <ContactDataContainer>
        <div
          style={{ height: "480px", overflowY: "auto" }}
          className={styles.tableContainer}
        >
          <Table selectable unstackable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Código</TableHeaderCell>
                <TableHeaderCell>Descripcion</TableHeaderCell>
                <TableHeaderCell>Precio s/IVA</TableHeaderCell>
                <TableHeaderCell>Cantidad</TableHeaderCell>
                {window.innerWidth > breakpoints.mobileSmall ? (
                  <TableHeaderCell>Subtotal</TableHeaderCell>
                ) : null}
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cartState.data.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.product?.article.toUpperCase()}</TableCell>
                  <TableCell>
                    {item.product?.description.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    $
                    {calcularBuyPrice(
                      item.product?.price?.price,
                      item.product?.brand.id,
                      item.product?.brand.rentabilidad,
                      discountsState.data
                    )}
                  </TableCell>
                  <TableCell>
                    <CartInput initialValue={item.amount} itemId={item.id} />
                  </TableCell>
                  {window.innerWidth > breakpoints.mobileSmall ? (
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
                  ) : null}
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
            width: "95%",
            justifyContent: "flex-end",
            borderBottom: "2px solid #d8d8d8",
            marginTop: "10px",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "600", color: "white" }}>
            Total:{" "}
            <span>
              $
              {formatNumberToString(
                calcularBuyTotal(cartState.data, discountsState.data)
                  .subTotalNumber - cartState.totalDiscounts
              )}{" "}
              + iva
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
