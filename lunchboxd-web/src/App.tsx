import { Route, Routes } from "react-router";
import "./App.css";
import { HomePage } from "./pages/Home/Homepage";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
    </Routes>
  );
}

export default App;
