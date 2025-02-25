/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import styles from "./pagos.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { formatDate } from "../../aux/formatDate";
import { breakpoints } from "../../resolutions";
import Icon from "../../components/atoms/icon/Icon";
import ModalComponent from "../../components/molecules/modal/ModalComponent";
import { formatNumbers } from "../../aux/formatNumbers";
import { GetPays } from "../../redux/reducers/SellerReceipt";

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

  @media (max-width: ${breakpoints.mobileLarge - 1}px) {
    width: 100%;
  }
`;

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

function Pagos(_props: Props): React.ReactNode {
  const userState = useSelector((state: RootState) => state.user);
  const [page, setPage] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.sellerReceipt);

  const handleChange = (_e: any, data: any) => {
    setPage(data.activePage);
  };

  useEffect(() => {
    dispatch(
      GetPays({
        page: page,
        clientId: userState.data?.clientId ?? 0,
        pending: true,
      })
    );
  }, [dispatch, page, userState.data?.clientId]);
  return (
    <ContactoContainer>
      <TitleStyled>
        Comprobantes de <TitleStyledSpan>Pago</TitleStyledSpan>
      </TitleStyled>
      <DescriptionStyled>
        En la sección de comprobantes, puedes ver el detalle de todos los pagos
        recibidos por los vendedores!
      </DescriptionStyled>
      <ContactDataContainer>
        <div style={{ overflowX: "auto" }}>
          <Table selectable unstackable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>
                  {window.innerWidth > breakpoints.mobileSmall
                    ? "Número de comprobante"
                    : "Comprobante"}
                </TableHeaderCell>
                <TableHeaderCell>
                  {window.innerWidth > breakpoints.mobileSmall
                    ? "Fecha de comprobante"
                    : "Fecha"}
                </TableHeaderCell>
                <TableHeaderCell>
                  {window.innerWidth > breakpoints.mobileSmall
                    ? "Total del pago"
                    : "Total"}
                </TableHeaderCell>
                <TableHeaderCell>
                  {window.innerWidth > breakpoints.mobileSmall
                    ? "Acciones"
                    : "Acc"}
                </TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.list.map((sr, i) => (
                <TableRow
                  key={i}
                  className={
                    window.innerWidth > breakpoints.mobileSmall
                      ? ""
                      : `${styles.rowTable}`
                  }
                >
                  <TableCell>{sr.id}</TableCell>
                  <TableCell>{formatDate(sr.createdAt)}</TableCell>
                  <TableCell>${formatNumbers(sr.total)}</TableCell>
                  <TableCell>
                    <ModalComponent
                      button={<Icon children="info" active color={""} />}
                      title={"Detalle de orden"}
                      size="1500px"
                    >
                      detalles
                    </ModalComponent>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <PagContainer>
          <span>{`Se encontaron ${data.totalPages} páginas con resultados`}</span>
          <div>
            <Pagination
              boundaryRange={0}
              activePage={page}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              onPageChange={handleChange}
              totalPages={data.totalPages}
            />
          </div>
        </PagContainer>
      </ContactDataContainer>
    </ContactoContainer>
  );
}

export default Pagos;
