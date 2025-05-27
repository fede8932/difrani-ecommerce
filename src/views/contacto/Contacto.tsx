import styled from "styled-components";
import View from "../../components/atoms/view/View";
import Map from "../../components/organisms/map/Map";
import { breakpoints } from "../../resolutions";

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
  flex-wrap: wrap;
  width: 77%;
  margin-top: 17px;
  flex-direction: row;
  justify-content: center;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    width: 100%;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Contacto(_props: Props): React.ReactNode {
  return (
    <ContactoContainer>
      <TitleStyled>
        Información de <TitleStyledSpan>Contacto</TitleStyledSpan>
      </TitleStyled>
      <ContactDataContainer>
        <Map width="90vw" />
      </ContactDataContainer>
    </ContactoContainer>
  );
}

export default Contacto;
