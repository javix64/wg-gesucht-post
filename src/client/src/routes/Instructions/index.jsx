import flatshare from "../../assets/flatshare.jpg";
import Navbar from "../../components/navbar";

function Instructions() {

  return (
    <div style={{backgroundImage:`url(${flatshare})`}} className="bg-no-repeat bg-right bg-cover min-h-screen w-screen flex ">
      <Navbar/>
      <h1>H1</h1>
    </div>
  );
}

export default Instructions;
