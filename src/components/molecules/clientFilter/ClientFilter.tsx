import { useEffect } from "react";
import Select from "../../atoms/select/Select";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllClientState,
  IClientsState,
} from "../../../redux/reducers/sellerReducer";
import { tabClientsBySelect } from "../../../aux/tabClientsBySelect";
import { IUserState, setClientId } from "../../../redux/reducers/userReducer";

interface Props {
  userId?: number;
}

function ClientFilter(props: Props): React.ReactNode {
  const { userId } = props;
  const dispatch: AppDispatch = useDispatch();

  const clients: IClientsState = useSelector(
    (state: RootState) => state.clientsBySeller
  );

  // console.log(clients);

  const user: IUserState = useSelector((state: RootState) => state.user);

  console.log(user);

  const handleSelect = (value: number): void => {
    const selectClient = clients.list.find((client) => client.id == value);
    dispatch(
      setClientId({ clientId: Number(value), cartId: selectClient!.cart.id })
    );
  };

  useEffect(() => {
    dispatch(GetAllClientState(userId || 0));
  }, []);

  return (
    <>
      <Select
        validate={false}
        placeholder="Seleccioná tu cliente"
        width="250px"
        height="31px"
        options={tabClientsBySelect(clients.list)}
        onSelect={handleSelect}
      />
    </>
  );
}

export default ClientFilter;
