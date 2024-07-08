import styled from "styled-components";
import View from "../../components/atoms/view/View";
import backgroundImage from "../../assets/background_login.jpg";
import logo from "../../assets/logo/logo_sin_fondo.png";
import { hexToRgba } from "../../aux/rgbaConverter";
import CustomInput from "../../components/molecules/input/CustomInput";
import Button from "../../components/atoms/button/Button";
import { useState } from "react";
import { cuitValid } from "../../aux/expRegular";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { LoginState } from "../../redux/reducers/userReducer";
import toast from "react-hot-toast";
import { breakpoints } from "../../resolutions";

interface Props {}

const LoginContainer = styled(View)`
  height: 100vh;
  background: linear-gradient(
      87deg,
      rgba(255, 251, 213, 0.152) 0%,
      rgba(79, 225, 135, 0.41) 88%
    ),
    url(${backgroundImage});
  background-size: cover;
  background-position: center;
  padding: 25px;
`;

const Logo = styled.img`
  width: 180px;
`;

const BodyCont = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.line};

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column;
  }
`;

const Text = styled.p`
  width: 630px;
  font-size: 15px;
`;

const Container = styled(View)`
  margin: 200px 0px 0px 50px;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    display: none;
  }
`;

const Form = styled.form`
  margin-top: 84px;
  margin-right: 50px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background-color: ${({ theme }) => hexToRgba(theme.colors.line, 0.87)};
  border-radius: 10px;
  width: 440px;
  height: 600px;
  color: ${({ theme }) => theme.colors.wideText};
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 17px -1px rgba(0, 0, 0, 0.28);
  -webkit-box-shadow: 0px 0px 17px -1px rgba(0, 0, 0, 0.28);
  -moz-box-shadow: 0px 0px 17px -1px rgba(0, 0, 0, 0.28);

  @media (max-width: ${breakpoints.mobileLarge}px) {
    width: 95%;
  }
`;

const Input = styled(CustomInput)`
  @media (max-width: ${breakpoints.mobileLarge}px) {
    width: 100%;
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.alert};
  font-size: 10px;
  padding-left: 5px;
  position: absolute;
`;

function Login(_props: Props): React.ReactNode {
  const [cuit, setCuit] = useState("");
  const [pass, setPass] = useState("");
  const [cuitError, setCuitError] = useState("");
  const [passError, setPassError] = useState("");

  const dispatch: AppDispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (cuit == "") {
      setCuitError("* Este campo es obligatorio");
      return;
    } else if (!cuitValid(cuit)) {
      setCuitError("* El cuit no tiene un formáto válido");
      return;
    } else {
      setCuitError("");
    }
    if (pass == "") {
      setPassError("* Este campo es obligatorio");
      return;
    } else {
      setPassError("");
    }
    dispatch(LoginState({ cuit: cuit, password: pass.toLowerCase() }))
      .then((res: any) => {
        if (res.error) {
          toast.error("Las credenciales no son válidas");
          return;
        }
        toast.success("Login OK!");
      })
      .catch((err: any) => {
        toast.error(err.message);
      });
  };

  return (
    <LoginContainer>
      <Logo alt="logo" src={logo} />
      <BodyCont>
        <Container>
          <h3>Bienvenido</h3>
          <Text>
            En Blase Distribuidora, nos enorgullece ser líderes en la
            distribución mayorista de repuestos para automóviles. Ofrecemos
            soluciones confiables y de calidad desde hace años, siendo un
            referente en la industria automotriz. Fundada con la visión de
            proporcionar un servicio excepcional y productos de primera calidad,
            Blase Distribuidora se ha convertido en un pilar fundamental para
            talleres mecánicos, concesionarios y comercios de repuestos. Nuestro
            catálogo abarca una amplia gama de marcas y modelos de vehículos,
            garantizando que nuestros clientes encuentren lo que necesitan.
            Nuestro equipo está compuesto por profesionales capacitados y
            apasionados por la industria automotriz. Nos mantenemos al tanto de
            las últimas innovaciones para ofrecer soluciones eficientes. La
            satisfacción del cliente es nuestra prioridad. Nos comprometemos a
            proporcionar un servicio personalizado y atención individualizada
            para asegurarnos de que cada cliente reciba la asistencia que
            necesita. Construimos relaciones sólidas y duraderas basadas en la
            confianza mutua. En Blase Distribuidora también nos preocupamos por
            el medio ambiente y la sostenibilidad. Buscamos constantemente
            maneras de reducir nuestro impacto ambiental y promover prácticas
            comerciales responsables. Confíe en nosotros para satisfacer todas
            sus necesidades de repuestos para automóviles y experimente la
            diferencia que marca la excelencia en el servicio.
          </Text>
        </Container>
        <Form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: "35px" }}>Iniciar sesión</h3>
          <div style={{ width: "100%" }}>
            <label>Número de CUIT</label>
            <Input
              onChange={(value) => setCuit(value)}
              background="background"
              type="text"
              width="380px"
              icon="badge"
              placeholder="99-99999999-9"
            />
          </div>
          <div style={{ position: "relative", width: "100%", display: "flex" }}>
            {cuitError != "" ? <ErrorMessage>{cuitError}</ErrorMessage> : null}
          </div>
          <div style={{ marginTop: "28px", width: "100%" }}>
            <label>Contraseña</label>
            <Input
              onChange={(value) => setPass(value)}
              background="background"
              type="password"
              width="380px"
              icon="visibility"
              placeholder="Ingresá tu contraseña"
            />
          </div>
          <div style={{ position: "relative", width: "100%", display: "flex" }}>
            {passError != "" ? <ErrorMessage>{passError}</ErrorMessage> : null}
          </div>
          <div style={{ marginTop: "310px", marginLeft: "250px" }}>
            <Button
              type="submit"
              color="primary"
              text="Ingresar"
              height="28px"
              width="120px"
              pending={userState.loading}
            />
          </div>
        </Form>
      </BodyCont>
    </LoginContainer>
  );
}

export default Login;
