import styled from "styled-components";
import View from "../../components/atoms/view/View";
import Map from "../../components/organisms/map/Map";

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
  flex-wrap: wrap;
  width: 77%;
  margin-top: 17px;
  flex-direction: row;
  justify-content: center;
`;

function Contacto(_props: Props): React.ReactNode {
  return (
    <ContactoContainer>
      <TitleStyled>
        Información de <TitleStyledSpan>Contacto</TitleStyledSpan>
      </TitleStyled>
      <DescriptionStyled>
        En la sección de contacto, puedes comunicarte con nosotros de manera
        rápida y sencilla. Encuentra nuestra dirección de correo electrónico,
        número de teléfono y un mapa para ubicar nuestra tienda. ¡Contáctanos y
        con gusto te asistiremos!
      </DescriptionStyled>
      <ContactDataContainer>
        <Map />
      </ContactDataContainer>
    </ContactoContainer>
  );
}

export default Contacto;
