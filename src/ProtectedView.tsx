import { Loader } from "semantic-ui-react";
import { IUserState } from "./redux/reducers/userReducer";
import Login from "./views/login/Login";

interface Props {
  children: React.ReactNode;
  userState: IUserState;
}

function ProtectedView(props: Props): React.ReactNode {
  const { children, userState } = props;
  if (!userState.user) {
    if (!userState.pending) {
      return <Login />;
    } else {
      return <Loader />;
    }
  }
  return <>{children}</>;
}

export default ProtectedView;
