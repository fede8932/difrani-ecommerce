/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from "styled-components";
import {
  Button,
  Checkbox,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import styles from "./cierres.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import View from "../../atoms/view/View";
import { breakpoints } from "../../../resolutions";
import { AppDispatch, RootState } from "../../../redux/store";
import { GetAllClosing, resetSellerClosing } from "../../../redux/reducers/SellerClosing";
import { formatDate } from "../../../aux/formatDate";
import { formatNumbers } from "../../../aux/formatNumbers";
import ModalComponent from "../../molecules/modal/ModalComponent";
import Icon from "../../atoms/icon/Icon";
import CloseDetail from "../CloseDetail/CloseDetail";

interface Props {}

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

function CierresOrganism(_props: Props): React.ReactNode {
  // const userState = useSelector((state: RootState) => state.user);
  const [pending, setPending] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.sellerClosing);

  const handleChange = (_e: any, data: any) => {
    setPage(data.activePage);
  };

  useEffect(() => {
    dispatch(
      GetAllClosing({
        page: page,
        pending: pending,
      })
    );
    return () => {
      dispatch(resetSellerClosing());
    };
  }, [dispatch, page, pending]);
  return (
    <ContactDataContainer>
      <div
        style={{
          margin: "0px 15px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Checkbox
          toggle
          label="Pendiente"
          onChange={() => {
            setPending(!pending);
          }}
          checked={pending}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <Table selectable unstackable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>
                {window.innerWidth > breakpoints.mobileSmall
                  ? "Número de comprobante"
                  : "Compr."}
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
            {data.list.map((c, i) => (
              <TableRow
                key={i}
                className={
                  window.innerWidth > breakpoints.mobileSmall
                    ? ""
                    : `${styles.rowTable}`
                }
              >
                <TableCell>{c.id}</TableCell>
                <TableCell>{formatDate(c.createdAt)}</TableCell>
                <TableCell>${formatNumbers(c.totalCierre)}</TableCell>
                <TableCell>
                  <ModalComponent
                    button={<Icon children="info" active color={""} />}
                    title={"Detalle de orden"}
                    size="1500px"
                  >
                    <CloseDetail closeId={c.id}/>
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
  );
}

export default CierresOrganism;
