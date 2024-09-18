import styled from "styled-components";
import View from "../../atoms/view/View";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { breakpoints } from "../../../resolutions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetItemsState } from "../../../redux/reducers/orderItemsReducer";
import { AppDispatch, RootState } from "../../../redux/store";
import { roundToTwoDecimals } from "../../../aux/prices";

interface IProps {
  orderId: number;
  orderNumber: string;
  orderSubtotal: number;
  orderTotal: number;
}

const PagContainer = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const OrderGeneralInfoContainer = styled(View)<{
  margin?: string;
  height?: string;
  flexDirection?: string;
}>`
  margin: ${({ margin }) => margin || "0px"};
  height: ${({ height }) => height || "auto"};
  width: 100%;
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  justify-content: space-between;
  overflow-y: auto;
`;
const Stext = styled.span`
  display: flex;
  color: grey;
  font-weight: 600;
  font-size: 16px;
`;

function OrderDetail(props: IProps): React.ReactNode {
  const { orderId, orderNumber, orderSubtotal, orderTotal } = props;
  const [page, setPage] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const { list, totalPages } = useSelector(
    (state: RootState) => state.orderItems
  ).data;
  const handleChange = (_e: any, d: any) => {
    setPage(d.activePage);
  };
  useEffect(() => {
    dispatch(GetItemsState({ orderId: orderId, rows: 7, page: page }));
  }, [page]);
  return (
    <View width="100%">
      <OrderGeneralInfoContainer>
        <Stext>
          <span className="material-symbols-outlined">order_approve</span>
          {orderNumber}
        </Stext>
        <Stext>
          <span className="material-symbols-outlined">payments</span>
          {` Subtotal: $${orderSubtotal}`}
        </Stext>
        <Stext>
          <span className="material-symbols-outlined">assured_workload</span>
          {` Total: $${orderTotal}`}
        </Stext>
      </OrderGeneralInfoContainer>
      <OrderGeneralInfoContainer
        margin="10px 0px"
        height="500px"
        flexDirection="column"
      >
        <Table singleLine selectable padded>
          <TableHeader>
            <TableRow>
              <TableHeaderCell width={1}>Artículo</TableHeaderCell>
              <TableHeaderCell width={1}>Marca</TableHeaderCell>
              <TableHeaderCell width={5}>Descripción</TableHeaderCell>
              <TableHeaderCell width={1}>Catidad</TableHeaderCell>
              <TableHeaderCell width={1}>Precio</TableHeaderCell>
              <TableHeaderCell width={1}>Iva</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {list.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.product.article}</TableCell>
                <TableCell>{item.product.brand.name}</TableCell>
                <TableCell>
                  {item.product.description.substring(0, 60)}
                </TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>${roundToTwoDecimals(item.sellPrice)}</TableCell>
                <TableCell>
                  ${roundToTwoDecimals(item.sellPrice * 0.21)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PagContainer>
          <span>{`Se encontaron ${totalPages} páginas con resultados`}</span>
          <div>
            <Pagination
              boundaryRange={0}
              activePage={page}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              onPageChange={handleChange}
              totalPages={totalPages}
            />
          </div>
        </PagContainer>
      </OrderGeneralInfoContainer>
    </View>
  );
}

export default OrderDetail;
