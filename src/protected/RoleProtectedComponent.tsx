import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactNode;
  accessList: number[];
}

function RoleProtectedComponent(props: Props): React.ReactNode {
  const user = useSelector((state: RootState) => state.user);

  const verifyAccess = (): boolean => {
    if (user.data?.rolId && props.accessList.includes(user.data?.rolId))
      return true;
    return false;
  };

  return <>{verifyAccess() ? props.children : null}</>;
}

export default RoleProtectedComponent;
