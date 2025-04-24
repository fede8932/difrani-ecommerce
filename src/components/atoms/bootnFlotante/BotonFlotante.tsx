import styled from "styled-components";
import { Icon } from "semantic-ui-react";

const FloatingButton = styled.button`
  position: fixed;
  bottom: 150px;
  right: 24px;
  width: 56px;
  height: 56px;
  background-color: #25d366;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #1ebe5d;
  }

  i.icon {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px; /* Ajustá esto según cómo lo veas mejor */
    margin: 0; /* Elimina posibles márgenes de Semantic UI */
    padding: 0; /* Elimina posibles márgenes de Semantic UI */
  }
`;

const BotonFlotante = () => {
  const handleClick = () => {
    window.open(
      "https://web.whatsapp.com/send/?phone=541132948959&text&type=phone_number&app_absent=0",
      "_blank"
    );
  };
  return (
    <FloatingButton onClick={handleClick}>
      <Icon name="whatsapp" />
    </FloatingButton>
  );
};

export default BotonFlotante;
