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
import { AppDispatch, RootState } from "../../redux/store";
import { formatDate } from "../../aux/formatDate";
import {
  GetCurrentAcountState,
  IAcountState,
} from "../../redux/reducers/acountReducer";
import { roundToTwoDecimals } from "../../aux/prices";

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
  height: 545px;
  width: 77%;
  margin-top: 17px;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const CurrentAcountInfoContainer = styled.div`
  margin-top: 15px;
  display: flex;
  width: 75%;
  justify-content: space-between;
`;

const TagInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  color: ${({ theme }) => theme.colors.wideText};
`;

function Resumen(props: Props): React.ReactNode {
  const userState = useSelector((state: RootState) => state.user);

  const [page, setPage] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const acountStatus: IAcountState = useSelector(
    (state: RootState) => state.acount
  );
  // console.log(acountStatus);

  const handleChange = (_e: any, data: any) => {
    setPage(data.activePage);
  };

  useEffect(() => {
    dispatch(
      GetCurrentAcountState({
        clientId: userState.data?.clientId || 0,
        rows: 10,
        page: page,
      })
    );
  }, [dispatch, page]);
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
              {roundToTwoDecimals(
                acountStatus.data?.client?.currentAcount.resume!
              )}
            </span>
          </span>
        </TagInfo>
      </CurrentAcountInfoContainer>
      <ContactDataContainer>
        <div>
          <Table singleLine selectable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Fecha</TableHeaderCell>
                <TableHeaderCell>Concepto</TableHeaderCell>
                <TableHeaderCell>Subtotal</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {acountStatus.data.moviments.map((mov, i) => (
                <TableRow key={i}>
                  <TableCell>{formatDate(mov.fecha)}</TableCell>
                  <TableCell>
                    {mov.type == 0
                      ? "Factura"
                      : mov.type == 1
                      ? "Nota de crédito"
                      : mov.type == 2
                      ? "Pago"
                      : mov.type == 3
                      ? "Devolución"
                      : "Descuento"}
                  </TableCell>
                  <TableCell>${roundToTwoDecimals(mov.amount)}</TableCell>
                  <TableCell>${roundToTwoDecimals(mov.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{`Se encontaron ${acountStatus.data.pages} páginas con resultados`}</span>
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
      </ContactDataContainer>
    </ContactoContainer>
  );
}

export default Resumen;
