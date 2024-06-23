import styled from "styled-components";
import { hexToRgba } from "../../../aux/rgbaConverter";
import { useState } from "react";
import { Loader } from "semantic-ui-react";

interface Props {
  color: string;
  height?: string;
  type?: "submit" | "reset" | "button";
  width?: string;
  text?: string;
  invert?: boolean;
  icon?: string;
  pending?: boolean;
  onClick?: () => void;
}

const StyledButton = styled.button<{
  color: string;
  height?: string;
  width?: string;
}>`
  all: unset;
  padding: 3px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.5s ease;
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "auto"};
  background-color: ${({ color, theme }) => theme.colors[color]};
  color: ${({ theme }) => theme.colors.wideText};
  font-weight: 600;
  font-size: 15px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.success};
    color: ${({ theme }) => theme.colors.background};
    transition: all 0.5s ease;
  }
`;
const InvertStyledButton = styled.button<{
  color: string;
  height?: string;
}>`
  all: unset;
  height: ${({ height }) => height || "auto"};
  padding: 3px 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.5s ease;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background-color: ${({ theme }) => hexToRgba(theme.colors.secundary, 0.5)};
  }
`;

const StylesIcon = styled.span<{
  size?: string;
  active: boolean;
  color: string;
}>`
  cursor: pointer;
  margin: 0px 4px;
  display: flex;
  align-items: center;
  font-size: ${({ size }) => size || "20px"};
  color: ${({ theme, color, active }) =>
    active ? theme.colors.primary : theme.colors[color]};
  transition: all 0.5s ease;

  &:hover {
    color: ${({ theme, active }) => (!active ? theme.colors.text : "")};
  }
`;

function Button(props: Props): React.ReactNode {
  const { text, invert, icon, pending, type, ...rest } = props;
  const [color, setColor] = useState("wideText");
  return (
    <>
      {invert ? (
        <InvertStyledButton {...rest}>{text}</InvertStyledButton>
      ) : (
        <StyledButton
          {...rest}
          onMouseEnter={() => {
            setColor("background");
          }}
          onMouseLeave={() => {
            setColor("wideText");
          }}
          type={type || "button"}
        >
          <StylesIcon
            size="16px"
            active={false}
            color={color}
            className="material-symbols-outlined"
          >
            {icon}
          </StylesIcon>
          {pending ? <Loader active inline="centered" size="mini" /> : text}
        </StyledButton>
      )}
    </>
  );
}

export default Button;
