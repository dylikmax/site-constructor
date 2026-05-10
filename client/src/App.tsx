import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConstructorPage, MyProjectsPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<MyProjectsPage />} />
        <Route path="/:id" element={<ConstructorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
