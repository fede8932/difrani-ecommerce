/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";

interface Props {
  placeholder?: string;
  width?: string;
  height?: string;
  icon?: boolean;
  background?: string;
  value?: string;
  disabled?: boolean;
  type?: string;
  color?: string;
  onChange?: (value: string) => void;
}

const StyledInput = styled.input<{ icon?: boolean; background?: string }>`
  all: unset;
  border-radius: 20px;
  z-index: 50;
  height: ${({ height }) => height || "auto"};
  width: ${({ width }) => width || "100%"};
  border: 1px solid ${({ theme }) => theme.colors.medium};
  padding: ${({ icon }) => (icon ? "3px 8px 3px 28px" : "3px 8px")};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme, background }) =>
    background ? theme.colors[background] : ""};
`;

function Input(props: Props): React.ReactNode {
  const { onChange, ...rest } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange ? onChange(e.target.value) : console.log(e);
  };
  return <StyledInput {...rest} onChange={handleChange} />;
}

export default Input;
