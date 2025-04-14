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
        <span>Difrani</span>
        <a href="https://maps.app.goo.gl/jwm4h8DSsREvj1ch8" target="_blank">
          RP28 369, B1748 Gral. Rodríguez, Provincia de Buenos Aires
        </a>
        <p>Tel.: 1132948959</p>
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
          <a
            href="https://www.facebook.com/profile.php?id=61565347106755"
            target="_blank"
          >
            <Img
              width="31px"
              src={faceboook}
              alt={"facebook"}
              margin="0px 5px"
            />
          </a>
          <a
            href="https://www.instagram.com/difrani_autopartes/"
            target="_blank"
          >
            <Img
              width="31px"
              src={instagram}
              alt={"instagram"}
              margin="0px 5px"
            />
          </a>
          <a
            href="https://web.whatsapp.com/send/?phone=541132948959&text&type=phone_number&app_absent=0"
            target="_blank"
          >
            <Img
              width="31px"
              src={whatsapp}
              alt={"whatsapp"}
              margin="0px 5px"
            />
          </a>
        </IconCont>
      </div>
      <InfoCont>
        <span>
          Whatsapp.:{" "}
          <a
            href="https://web.whatsapp.com/send/?phone=541132948959&text&type=phone_number&app_absent=0"
            target="_blank"
          >
            +54 1132948959
          </a>
        </span>
        <span>
          Website.:{" "}
          <a href="https://difrani.com.ar/" target="_blank">
            https://difrani.com.ar/
          </a>
        </span>
        <p>
          Email.:{" "}
          <a href="mailto:ventas@difrani.com" target="_blank">
            ventas@difrani.com
          </a>
        </p>
      </InfoCont>
    </Container>
  );
}

export default Footer;
