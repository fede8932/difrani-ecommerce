/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import styled from "styled-components";
import View from "../../components/atoms/view/View";
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { formatDate } from "../../aux/formatDate";
import {
  GetCurrentAcountState,
  IAcountState,
  resetAcountState,
  toggleMarc,
} from "../../redux/reducers/acountReducer";
import { formatNumberToString } from "../../aux/prices";
import { breakpoints } from "../../resolutions";
import { checkActive, getMarc } from "../../utils";
import ModalComponent from "../../components/molecules/modal/ModalComponent";
import NewSellerReceipt from "../../components/organisms/newSellerReceipt/NewSellerReceipt";

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
  height: 545px;
  width: 77%;
  margin-top: 17px;
  margin-bottom: 10px;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    height: auto;
    width: 99%;
  }
`;

const CurrentAcountInfoContainer = styled.div`
  width: 72%;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column;
  }
`;

const PagContainer = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 15px;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const TagInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  color: ${({ theme }) => theme.colors.wideText};
`;

function Resumen(_props: Props): React.ReactNode {
  const userState = useSelector((state: RootState) => state.user);

  const [page, setPage] = useState(1);
  const [check, setCheck] = useState(true);

  const dispatch: AppDispatch = useDispatch();
  const acountStatus: IAcountState = useSelector(
    (state: RootState) => state.acount
  );
  const { rolId }: any = useSelector((state: RootState) => state.user).data;
  // console.log(acountStatus.selectMovements, acountStatus.totalSelect);

  const handleChange = (_e: any, data: any) => {
    setPage(data.activePage);
  };
  const handleChangeToggle = (_e: any, d: any) => {
    setPage(1);
    setCheck(d.checked);
  };

  useEffect(() => {
    dispatch(
      GetCurrentAcountState({
        clientId: userState.data?.clientId || 0,
        rows: 10,
        page: page,
        pending: check,
      })
    );
  }, [dispatch, page, check, userState.data?.clientId]);

  useEffect(() => {
    return () => {
      dispatch(resetAcountState());
    };
  }, [dispatch]);
  return (
    <ContactoContainer>
      <TitleStyled>
        Informe de <TitleStyledSpan>Cuenta corriente</TitleStyledSpan>
      </TitleStyled>
      <DescriptionStyled>
        En la sección de transacciones, puedes revisar el detalle y el estado de
        tus movimientos de manera rápida y sencilla. Encuentra información
        detallada sobre cada transacción y su estado actual. ¡Revisa tus
        movimientos y mantente informado sobre tu cuenta corriente!
      </DescriptionStyled>
      <CurrentAcountInfoContainer>
        <TagInfo>
          <Icon className="material-symbols-outlined">corporate_fare</Icon>
          <span>
            Razón social:{" "}
            <span>{acountStatus.data?.client?.razonSocial.toUpperCase()}</span>
          </span>
        </TagInfo>
        <TagInfo>
          <Icon className="material-symbols-outlined">list_alt</Icon>
          <span>
            Cuenta corriente:{" "}
            <span>{acountStatus.data?.client?.currentAcount.acountNumber}</span>
          </span>
        </TagInfo>
        <TagInfo>
          <Icon className="material-symbols-outlined">monitoring</Icon>
          <span>
            Total:{" "}
            <span>
              $
              {formatNumberToString(
                acountStatus.data?.client?.currentAcount.resume
              )}
            </span>
          </span>
        </TagInfo>
      </CurrentAcountInfoContainer>
      <ContactDataContainer>
        <div style={{ marginBottom: "12px", marginLeft: "20px" }}>
          <Checkbox
            toggle
            label="Pendiente"
            onChange={handleChangeToggle}
            checked={check}
          />
          {acountStatus?.totalSelect >
          0 ? (
            <div style={{ marginLeft: "45px", display: "inline-block" }}>
              <ModalComponent
                button={<Button>Nuevo cobro</Button>}
                title="Nuevo cobro"
              >
                <NewSellerReceipt />
              </ModalComponent>
            </div>
          ) : null}
        </div>
        <div style={{ height: "490px" }}>
          <Table unstackable selectable>
            <TableHeader>
              <TableRow>
                {userState.data?.rolId == 3 ? (
                  <TableHeaderCell>Box</TableHeaderCell>
                ) : null}
                <TableHeaderCell>Fecha</TableHeaderCell>
                <TableHeaderCell>Concepto</TableHeaderCell>
                {rolId == 4 ? (
                  <TableHeaderCell>
                    {window.innerWidth > breakpoints.mobileSmall
                      ? "Comprobante Vdor"
                      : "Comprobante"}
                  </TableHeaderCell>
                ) : null}
                <TableHeaderCell>
                  {rolId == 4 ? "Total" : "Pendiente"}
                </TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {acountStatus.data.moviments.map((mov, i) => (
                <TableRow key={i}>
                  {userState.data?.rolId == 3 ? (
                    <TableCell>
                      <Checkbox
                        disabled={checkActive(mov)}
                        checked={getMarc(mov, acountStatus.selectMovements)}
                        onChange={() => {
                          dispatch(toggleMarc(mov));
                        }}
                      />
                    </TableCell>
                  ) : null}
                  <TableCell>{formatDate(mov.fecha, true)}</TableCell>
                  <TableCell>
                    {mov.type == 0 ? (
                      mov.billType == 0 ? (
                        "Factura"
                      ) : (
                        <span style={{ color: "green" }}>Factura</span>
                      )
                    ) : mov.type == 1 ? (
                      "Nota de crédito"
                    ) : mov.type == 2 ? (
                      "Pago"
                    ) : mov.type == 3 ? (
                      "Devolución"
                    ) : (
                      "Descuento"
                    )}
                    <span>{rolId != 4 ? ` N°${mov.numComprobante}` : ""}</span>
                  </TableCell>
                  {window.innerWidth > breakpoints.mobileSmall &&
                  userState.data?.rolId != 3 ? (
                    <TableCell>{mov.payDetail?.comprobanteVendedor}</TableCell>
                  ) : null}
                  <TableCell>
                    $
                    {formatNumberToString(
                      rolId == 4
                        ? mov.total
                        : mov.type == 0
                        ? mov.saldoPend
                        : mov.total
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <PagContainer>
          <span>{`Se encontaron ${acountStatus.data.pages} páginas con resultados`}</span>
          <div>
            <Pagination
              boundaryRange={0}
              activePage={page}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              onPageChange={handleChange}
              totalPages={acountStatus.data.pages}
            />
          </div>
        </PagContainer>
      </ContactDataContainer>
    </ContactoContainer>
  );
}

export default Resumen;
