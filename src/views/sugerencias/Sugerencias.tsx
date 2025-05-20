/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import View from "../../components/atoms/view/View";
import { breakpoints } from "../../resolutions";
import Input from "../../components/atoms/input/Input";
import TextArea from "../../components/atoms/textArea/TextArea";
import Button from "../../components/atoms/button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { SendClaim } from "../../axios/request/cartRequest";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const StyledForm = styled.form`
  width: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;

  div {
    width: 100%;
    margin-bottom: 15px;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Sugerencias(_props: Props): React.ReactNode {
  const userState = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();

  const handleInputChange =
    (field: keyof typeof formState) => (value: string) => {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const [formState, setFormState] = useState({
    fullName:
      `${userState.data?.name} ${userState.data?.lastName}`.toUpperCase(),
    phone: "",
    email: "",
    comments: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      formState.fullName == "" ||
      formState.phone == "" ||
      formState.comments == ""
    ) {
      toast.error("Hay campos que deben ser completados correctamente");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    SendClaim(userState.data?.clientId!, formState)
      .then((res: any) => {
        if (res.error) {
          toast.error(`Error: ${res.error.message}`);
          return;
        }
        toast.success("Enviado");
        setTimeout(() => navigate("/catalogo"), 500);
      })
      .catch((err) => toast.error(`Error: ${err.message}`));
  };

  return (
    <ContactoContainer>
      <TitleStyled>
        Dejanos tu <TitleStyledSpan>Sugerencia</TitleStyledSpan>
      </TitleStyled>

      <ContactDataContainer>
        <StyledForm onSubmit={handleSubmit}>
          <div>
            <label>Nombre y apellido</label>
            <Input
              height="30px"
              value={formState.fullName}
              onChange={handleInputChange("fullName")}
            />
          </div>
          <div>
            <label>Teléfono de contacto</label>
            <Input
              height="30px"
              value={formState.phone}
              onChange={handleInputChange("phone")}
            />
          </div>
          <div>
            <label>Email de contacto *OPCIONAL</label>
            <Input
              height="30px"
              value={formState.email}
              onChange={handleInputChange("email")}
            />
          </div>
          <div>
            <label>Comentarios</label>
            <TextArea
              height="250px"
              value={formState.comments}
              onChange={handleInputChange("comments")}
            />
          </div>
          <div>
            <Button height="30px" color="primary" text="Enviar" type="submit" />
          </div>
        </StyledForm>
      </ContactDataContainer>
    </ContactoContainer>
  );
}

export default Sugerencias;
