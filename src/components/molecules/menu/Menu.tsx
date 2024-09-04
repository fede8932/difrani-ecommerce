import styled, { keyframes } from "styled-components";
import View from "../../atoms/view/View";
import { useEffect, useState } from "react";
import React from "react";

interface Props {
  button: React.ReactElement;
  children: React.ReactElement;
  position: "left" | "right"; // Nuevo prop para definir la posición
}

const MenuContainer = styled(View)`
  position: relative;
`;

const slideDown = keyframes`
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-10px);
    opacity: 0;
  }
`;

const BoxContainer = styled(View)<{
  position: "left" | "right";
  open: boolean;
}>`
  z-index: 100;
  position: absolute;
  margin-top: 35px;
  padding: 5px;
  width: auto;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background-color: ${({ theme }) => theme.colors.background};
  left: ${({ position }) => (position === "right" ? "0" : "auto")};
  right: ${({ position }) => (position === "left" ? "0" : "auto")};
  animation: ${({ open }) => (open ? slideDown : slideUp)} 0.4s ease forwards;
  box-shadow: 0px 0px 16px -7px rgba(79, 225, 135, 0.54);
  -webkit-box-shadow: 0px 0px 16px -7px rgba(79, 225, 135, 0.54);
  -moz-box-shadow: 0px 0px 16px -7px rgba(79, 225, 135, 0.54);
`;

function Menu(props: Props): React.ReactNode {
  const { children, position, button } = props;
  const [open, setOpen] = useState(false);
  const extendButton: React.ReactNode = React.cloneElement(button, {
    onClick: () => {
      setOpen(!open);
    },
  });

  const handleClickOutside = () => {
    setTimeout(() => {
      setOpen(false);
    }, 2500);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <MenuContainer>
      {extendButton}
      {open || open === false ? (
        <BoxContainer position={position} open={open}>
          {open ? children : null}
        </BoxContainer>
      ) : null}
    </MenuContainer>
  );
}

export default Menu;
