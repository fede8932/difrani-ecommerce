import "@mantine/core/styles.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { AppDispatch, RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { MeState } from "./redux/reducers/userReducer";
import AppIn from "./AppIn";
import ProtectedView from "./ProtectedView";

function App() {
  const dispatch: AppDispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(MeState());
  }, [dispatch]);
  return (
    <>
      <ProtectedView userState={userState}>
        <AppIn />
      </ProtectedView>
      <Toaster
        gutter={-100}
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {
            margin: "55px 5px",
          },
        }}
      />
    </>
  );
}

export default App;
