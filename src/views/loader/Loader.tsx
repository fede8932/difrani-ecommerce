import DotLoader from "react-spinners/DotLoader";

function Loader(): React.ReactNode {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DotLoader color="#36d7b7" loading size={100} />
    </div>
  );
}

export default Loader;
