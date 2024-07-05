import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactNode;
}

function PricesProtected(props: Props): React.ReactNode {
  const user = useSelector((state: RootState) => state.user);

  const verifyAccess = (): boolean => {
    if (user.data?.clientId) return true;
    return false;
  };

  return <>{verifyAccess() ? props.children : null}</>;
}

export default PricesProtected;
