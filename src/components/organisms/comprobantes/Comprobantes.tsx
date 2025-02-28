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
import styles from "./comprobantes.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import View from "../../atoms/view/View";
import { breakpoints } from "../../../resolutions";
import { AppDispatch, RootState } from "../../../redux/store";
import { GetTotalPayPending } from "../../../axios/request/sellerRequest";
import { CreateClosing } from "../../../redux/reducers/SellerClosing";
import {
  GetPays,
  resetSellerReceipt,
} from "../../../redux/reducers/SellerReceipt";
import { formatDate } from "../../../aux/formatDate";
import { formatNumbers } from "../../../aux/formatNumbers";
import ModalComponent from "../../molecules/modal/ModalComponent";
import Icon from "../../atoms/icon/Icon";
import CobroDetail from "../CobroDetail/CobroDetail";

interface Props {}

const ContactDataContainer = styled(View)`
  height: 580px;
  width: 77%;
  margin-top: 17px;
  margin-bottom: 10px;

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

function ComprobanteOrganism(_props: Props): React.ReactNode {
  // const userState = useSelector((state: RootState) => state.user);
  const [pending, setPending] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.sellerReceipt);

  const handleChange = (_e: any, data: any) => {
    setPage(data.activePage);
  };

  const handleNewClosing = () => {
    GetTotalPayPending().then((res) => {
      if(res.total <= 0){
        return toast.error("No hay pagos pendientes");
      }
      Swal.fire({
        title: "Confirmar cierre diario?",
        html: `
          <p>Vas a generar un <b>cierre diario</b> por <b>$${res.total}</b></p>
          <ul style="text-align: left; list-style-type: none; padding: 0 15px;">
            <li>💵 <b>Efectivo:</b> $${res.efectivo}</li>
            <li>🏦 <b>Transferencia:</b> $${res.transferencia}</li>
            <li>📝 <b>Cheque:</b> $${res.cheque}</li>
          </ul>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Generar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(CreateClosing())
            .then((res: any) => {
              if (res.error) {
                toast.error(`Error: ${res.error.message}`);
                return;
              }
              toast.success("Cierre generado con éxito");
              dispatch(
                GetPays({
                  page: page,
                  pending: pending,
                })
              );
            })
            .catch((error: any) => {
              toast.error(`Error: ${error.message}`);
              return;
            });
        }
      });
    });
  };

  useEffect(() => {
    dispatch(
      GetPays({
        page: page,
        pending: pending,
      })
    );
    return () => {
      dispatch(resetSellerReceipt());
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
        <Button onClick={handleNewClosing}>Nuevo cierre</Button>
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
                    title={"Detalle de cobro"}
                    size="1500px"
                  >
                    <CobroDetail sellerRec={sr}/>
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

export default ComprobanteOrganism;
