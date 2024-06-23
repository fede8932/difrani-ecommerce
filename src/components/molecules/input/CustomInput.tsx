import styled from "styled-components";
import Input from "../../atoms/input/Input";
import { Loader } from "semantic-ui-react";

interface Props {
  icon?: string;
  placeholder?: string;
  background?: string;
  width?: string;
  height?: string;
  loading?: boolean;
  value?: string;
  type?: string;
  onChange?: (value: string) => void;
}

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.wideText};
`;
const StylesIcon = styled.span`
  position: absolute;
  margin-left: 8px;
  font-size: 20px;
  z-index: 80;
`;

const LoaderContainer = styled.div`
  position: absolute;
  margin-left: 8px;
`;

function CustomInput(props: Props): React.ReactNode {
  const { icon, loading, type, ...rest } = props;
  return (
    <InputContainer>
      {icon ? (
        !loading ? (
          <StylesIcon className="material-symbols-outlined">{icon}</StylesIcon>
        ) : (
          <LoaderContainer>
            <Loader active inline="centered" size="mini" />
          </LoaderContainer>
        )
      ) : null}
      <Input icon {...rest} height="28px" type={type ? type : "text"} />
    </InputContainer>
  );
}

export default CustomInput;
