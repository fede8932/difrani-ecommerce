import styled from "styled-components";
import IconButton from "../../atoms/iconButton/IconButton";
import Input from "../../atoms/input/Input";
import View from "../../atoms/view/View";

interface Props {
  add: () => void;
  minus: () => void;
  width?: string;
  height?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Conteiner = styled(View)`
  flex-direction: row;
  align-items: center;
`;

function AmountInput(props: Props): React.ReactNode {
  const { add, minus, ...rest } = props;
  return (
    <Conteiner>
      <div style={{ margin: "0px 6px" }}>
        <IconButton icon="remove" size="24px" onClick={minus} />
      </div>
      <Input {...rest} />
      <div style={{ margin: "0px 0px 0pc 6px" }}>
        <IconButton icon="add" size="24px" onClick={add} />
      </div>
    </Conteiner>
  );
}

export default AmountInput;
