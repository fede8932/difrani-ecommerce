import { useSelector } from "react-redux";
import PermissionDenied from "../components/organisms/permissionDenied/PermissionDenied";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactNode;
  accessList: number[];
}

function RoleProtectedView(props: Props): React.ReactNode {
  const user = useSelector((state: RootState) => state.user);

  const verifyAccess = (): boolean => {
    if (user.data?.rolId && props.accessList.includes(user.data?.rolId))
      return true;
    return false;
  };

  return <>{verifyAccess() ? props.children : <PermissionDenied />}</>;
}

export default RoleProtectedView;
