import React from "react";
import View from "../../atoms/view/View";
import styled from "styled-components";
import Img from "../../atoms/img/Img";
import faceboook from "../../../assets/redesIcon/facebook.svg";
import instagram from "../../../assets/redesIcon/instagram.png";
import whatsapp from "../../../assets/redesIcon/whatsapp.png";
import { breakpoints } from "../../../resolutions";

interface Props {}

const Container = styled(View)`
  width: 100%;
  padding: 35px;
  height: 130px;
  background-color: #373241;
  color: white;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: ${breakpoints.desktopSmall}px) {
    flex-direction: column;
    align-items: center;
    height: 450px;
  }
`;
const IconCont = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: center;
`;
const InfoCont = styled(View)`
  @media (max-width: ${breakpoints.desktopSmall}px) {
    width: 100%;
  }
`;

function Footer(_props: Props): React.ReactNode {
  return (
    <Container>
      <InfoCont width="33%">
        <span>Blase distribuidora</span>
        <a href="https://maps.app.goo.gl/NPSodGsCbev2stoHA" target="_blank">
          B1708FHL, Av. Don Bosco 2175, B1708FHB Morón, Provincia de Buenos
          Aires
        </a>
        <p>Tel.: (011) 4460-5972</p>
      </InfoCont>
      <div
        style={{
          width: "150px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <span style={{ marginBottom: "15px" }}>Redes sociales</span>
        <IconCont width="33%">
          <Img width="31px" src={faceboook} alt={"facebook"} margin="0px 5px" />
          <Img
            width="31px"
            src={instagram}
            alt={"instagram"}
            margin="0px 5px"
          />
          <Img width="31px" src={whatsapp} alt={"whatsapp"} margin="0px 5px" />
        </IconCont>
      </div>
      <InfoCont>
        <span>
          Whatsapp.:{" "}
          <a
            href="https://web.whatsapp.com/send/?phone=541164147716&text&type=phone_number&app_absent=0"
            target="_blank"
          >
            +54 1164147716
          </a>
        </span>
        <span>
          Website.:{" "}
          <a href="https://www.blasedistribuidora.com.ar/" target="_blank">
            https://www.blasedistribuidora.com.ar/
          </a>
        </span>
        <p>
          Email.:{" "}
          <a href="mailto:ventas@blasedistribuidora.com" target="_blank">
            ventas@blasedistribuidora.com
          </a>
        </p>
      </InfoCont>
    </Container>
  );
}

export default Footer;
