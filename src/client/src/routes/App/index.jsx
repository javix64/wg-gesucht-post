import { Container } from "@mui/material";
import Navbar from "../../components/navbar";
import WGgesucht from "../WGgesucht";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Instructions from "../Instructions";
import Faq from "../Faq";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WGgesucht />,
  },
  {
    path: "/instructions",
    element: <Instructions />,
  },
  {
    path: "/faq",
    element: <Faq />,
  },
]);

function App() {
  return (
    <Container maxWidth="xl">
      <Navbar />
      <RouterProvider router={router} />
    </Container>
  );
}

export default App;
