import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import PlacesComponent from "./Components/PlacesComponent";
import SimpleMap from "./Components/SimpleMap";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <PlacesComponent />
      {/* <SimpleMap /> */}
    </>
  );
}

export default App;
