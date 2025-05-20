/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";

interface TextAreaProps {
  placeholder?: string;
  width?: string;
  height?: string;
  background?: string;
  value?: string;
  disabled?: boolean;
  color?: string;
  onChange?: (value: string) => void;
}

const StyledTextArea = styled.textarea<{
  background?: string;
  width?: string;
  height?: string;
}>`
  all: unset;
  border-radius: 5px;
  z-index: 50;
  height: ${({ height }) => height || "auto"};
  width: ${({ width }) => width || "100%"};
  border: 1px solid ${({ theme }) => theme.colors.medium};
  padding: 8px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme, background }) =>
    background ? theme.colors[background] : ""};
  resize: vertical; /* Podés cambiar esto a none o both según lo que quieras */
`;

function TextArea(props: TextAreaProps): React.ReactNode {
  const { onChange, ...rest } = props;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange ? onChange(e.target.value) : console.log(e);
  };

  return <StyledTextArea {...rest} onChange={handleChange} />;
}

export default TextArea;
