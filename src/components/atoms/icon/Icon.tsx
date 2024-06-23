import styled from "styled-components";

interface Props {
  children: string;
  active: boolean;
  color: string;
  size?: string;
  onClick?: () => void;
}

const StylesIcon = styled.span<{
  size?: string;
  active: boolean;
  color: string;
}>`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: ${({ size }) => size || "20px"};
  color: ${({ theme, color, active }) =>
    active ? theme.colors.primary : theme.colors[color]};

  &:hover {
    color: ${({ theme, active }) => (!active ? theme.colors.text : "")};
  }
`;

function Icon(props: Props): React.ReactNode {
  const { children, onClick, ...rest } = props;
  return (
    <StylesIcon
      {...rest}
      className="material-symbols-outlined"
      onClick={onClick}
    >
      {children}
    </StylesIcon>
  );
}

export default Icon;
