import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  ChangeAmountCartItemsState,
  ISendItemChange,
} from "../../../redux/reducers/cartListReducer";
import { AppDispatch } from "../../../redux/store";

interface Props {
  initialValue: number | string;
  itemId: number;
}

const Input = styled.input`
  width: 50px;
  padding: 3px;
  text-align: center;

  @media (max-width: 768px) {
    width: 60px;
    padding: 8px;
    font-size: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
  }
`;

function CartInput(props: Props): React.ReactNode {
  const { initialValue, itemId } = props;
  const [amount, setAmount] = useState(initialValue);
  const dispatch: AppDispatch = useDispatch();

  const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleBlur = () => {
    if (isNaN(Number(amount))) {
      setAmount(initialValue);
    } else if (amount == "" || amount == "0") {
      setAmount(initialValue);
    } else if (Number(amount) == initialValue) {
      return;
    } else {
      const sendInfo: ISendItemChange = {
        itemId: itemId,
        amount: Number(amount),
      };
      dispatch(ChangeAmountCartItemsState(sendInfo));
    }
  };

  return (
    <Input
      onChange={changeAmount}
      value={amount}
      onBlur={handleBlur} // Evento que se dispara al perder el foco
    />
  );
}

export default CartInput;
