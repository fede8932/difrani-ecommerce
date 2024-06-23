import styled from "styled-components";
import { hexToRgba } from "../../../aux/rgbaConverter";

interface Props {
  icon: string;
  size?: string;
  onClick?: () => void;
}

const StyledIconButton = styled.button`
  all: unset;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.medium};
  padding: 3px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border: 1px solid ${({ theme }) => hexToRgba(theme.colors.secundary, 0.5)};
    background-color: ${({ theme }) => hexToRgba(theme.colors.medium, 0.2)};
  }
`;
const StylesIcon = styled.span<{ size?: string }>`
  display: flex;
  align-items: center;
  font-size: ${({ size }) => size || "20px"};
  color: ${({ theme }) => theme.colors.secundary};
`;
function IconButton(props: Props): React.ReactNode {
  const { icon, size, onClick, ...rest } = props;
  return (
    <StyledIconButton {...rest} onClick={onClick}>
      <StylesIcon className="material-symbols-outlined" size={size}>
        {icon}
      </StylesIcon>
    </StyledIconButton>
  );
}
export default IconButton;
