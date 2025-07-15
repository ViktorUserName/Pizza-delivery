import { createRoot } from "react-dom/client";
import Pizza from "./Pizza";
import Order from "./order";

const App = () => {
  return (
    <div>
      <h1 className="logo">Padre Gino's - Order Now</h1>
        <Order/>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
