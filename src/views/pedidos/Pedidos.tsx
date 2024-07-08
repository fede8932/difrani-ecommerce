import styled from "styled-components";
import View from "../../components/atoms/view/View";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetOrderState,
  IOrdersState,
} from "../../redux/reducers/ordersReducer";
import { AppDispatch, RootState } from "../../redux/store";
import { formatDate } from "../../aux/formatDate";
import { breakpoints } from "../../resolutions";

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

  @media (max-width: ${breakpoints.mobileLarge}px) {
    display: none;
  }
`;

const ContactDataContainer = styled(View)`
  height: 580px;
  width: 77%;
  margin-top: 17px;
  margin-bottom: 10px;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    height: auto;
  }
`;

const PagContainer = styled(View)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  flex-direction: column-reverse;
  align-items: center;
`;

function Pedidos(_props: Props): React.ReactNode {
  const userState = useSelector((state: RootState) => state.user);
  const [page, setPage] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const orderStatus: IOrdersState = useSelector(
    (state: RootState) => state.orders
  );

  const handleChange = (_e: any, data: any) => {
    setPage(data.activePage);
  };

  useEffect(() => {
    dispatch(
      GetOrderState({
        clientId: userState.data?.clientId || 0,
        rows: 10,
        page: page,
      })
    );
  }, [dispatch, page]);
  return (
    <ContactoContainer>
      <TitleStyled>
        Información de <TitleStyledSpan>Pedidos</TitleStyledSpan>
      </TitleStyled>
      <DescriptionStyled>
        En la sección de pedidos, puedes ver el detalle y el estado de tus
        compras de manera rápida y sencilla. Encuentra información detallada
        sobre cada pedido, su estado actual y opciones para gestionar tus
        compras. ¡Revisa tus pedidos y mantente informado!
      </DescriptionStyled>
      <ContactDataContainer>
        <div>
          <Table singleLine selectable padded>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Número de orden</TableHeaderCell>
                <TableHeaderCell>Fecha de pedido</TableHeaderCell>
                <TableHeaderCell>Total de la compra</TableHeaderCell>
                <TableHeaderCell>Estado de la orden</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderStatus.data.list.map((order, i) => (
                <TableRow key={i}>
                  <TableCell>{order.numero}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>
                    {order.status == "Sent"
                      ? "Enviado"
                      : order.status == "Confirm"
                      ? "Confirmado"
                      : "Abierta"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <PagContainer>
          <span>{`Se encontaron ${orderStatus.data.totalPages} páginas con resultados`}</span>
          <Pagination
            boundaryRange={0}
            activePage={page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            onPageChange={handleChange}
            totalPages={orderStatus.data.totalPages}
          />
        </PagContainer>
      </ContactDataContainer>
    </ContactoContainer>
  );
}

export default Pedidos;
