/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from "styled-components";
import View from "../../components/atoms/view/View";
import ComprobanteOrganism from "../../components/organisms/comprobantes/Comprobantes";
import { breakpoints } from "../../resolutions";
import { Tab, TabPane } from "semantic-ui-react";
import CierresOrganism from "../../components/organisms/cierres/Cierres";

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

const panes = [
  {
    menuItem: { key: "pays", icon: "payment", content: "Cobros" },
    render: () => (
      <TabPane style={{padding: "10px 2px"}}>
        <ComprobanteOrganism />
      </TabPane>
    ),
  },
  {
    menuItem: { key: "closing", icon: "balance scale", content: "Cierres" },
    render: () => (
      <TabPane style={{padding: "10px 2px"}}>
        <CierresOrganism />
      </TabPane>
    ),
  },
];

function Comprobantes(_props: Props): React.ReactNode {
  // const userState = useSelector((state: RootState) => state.user);

  return (
    <ContactoContainer>
      <TitleStyled>
        Comprobantes de <TitleStyledSpan>Pago</TitleStyledSpan>
      </TitleStyled>
      <DescriptionStyled>
        En la sección de comprobantes, puedes ver el detalle de todos los pagos
        recibidos por los vendedores!
      </DescriptionStyled>
      <Tab panes={panes} style={{ width: "100%" }} />
      {/* <ComprobanteOrganism /> */}
    </ContactoContainer>
  );
}

export default Comprobantes;
