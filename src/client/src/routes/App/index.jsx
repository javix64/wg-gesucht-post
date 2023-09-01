import flatshare from "../../assets/flatshare.jpg";
import Navbar from "../../components/navbar";
import WGgesucht from "../WGgesucht";

function App() {
  return (
    <div
      style={{ backgroundImage: `url(${flatshare})` }}
      className="bg-no-repeat bg-right bg-cover min-h-screen w-screen flex flex-col"
    >
      <div className="bg-lime-300 bg-opacity-10">
        <Navbar />
        <WGgesucht />
      </div>
    </div>
  );
}

export default App;
