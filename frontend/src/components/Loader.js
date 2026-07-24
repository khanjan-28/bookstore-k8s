import { Oval } from "react-loader-spinner";

function Loader() {
  return (
    <div className="loader-container">
      <Oval
        height={60}
        width={60}
        strokeWidth={5}
        color="#2563eb"
        secondaryColor="#93c5fd"
        visible={true}
      />
    </div>
  );
}

export default Loader;
