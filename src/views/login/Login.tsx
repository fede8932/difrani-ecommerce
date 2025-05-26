/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
      90deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(255, 255, 255, 0.7) 100%
    ),
    url(${backgroundImage});
  background-size: cover;
  background-position: center;
  padding: 25px;
`;

const Logo = styled.img`
  width: 190px;
  height: 90px;
`;

const BodyCont = styled(View)`
  flex-direction: row;
  padding: 0px 150px;
  color: ${({ theme }) => theme.colors.line};

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column;
  padding: 0px 0px;
  }
`;

// const Text = styled.p`
//   width: 630px;
//   font-size: 15px;
// `;

// const Container = styled(View)`
//   margin: 200px 0px 0px 50px;

//   @media (max-width: ${breakpoints.mobileLarge}px) {
//     display: none;
//   }
// `;

const Form = styled.form`
  margin-top: 84px;
  margin-right: 50px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background-color: ${({ theme }) => hexToRgba(theme.colors.line, 0.37)};
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
  const [passView, setPassView] = useState<"password" | "text">("password");
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
        window.location.reload();
      })
      .catch((err: any) => {
        toast.error(err.message);
      });
  };

  return (
    <LoginContainer>
      <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <Logo alt="logo" src={logo} />
      </div>
      <BodyCont>
        <Form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: "35px" }}>Iniciar sesión</h3><Logo alt="logo" src={logo} />
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
              iconOnClick={() => {
                if (passView == "password") {
                  setPassView("text");
                  return;
                }
                setPassView("password");
              }}
              onChange={(value) => setPass(value)}
              background="background"
              type={passView}
              width="380px"
              icon={passView == "password" ? "visibility" : "visibility_off"}
              placeholder="Ingresá tu contraseña"
            />
          </div>
          <div style={{ position: "relative", width: "100%", display: "flex" }}>
            {passError != "" ? <ErrorMessage>{passError}</ErrorMessage> : null}
          </div>
          <div style={{ marginTop: "210px", width: "98%" }}>
            <Button
              type="submit"
              color="primary"
              text="Ingresar"
              height="28px"
              width="100%"
              pending={userState.loading}
            />
          </div>
        </Form>
      </BodyCont>
    </LoginContainer>
  );
}

export default Login;