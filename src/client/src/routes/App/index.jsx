import { Container } from "@mui/material";
import Navbar from "../../components/navbar";
import WGgesucht from "../WGgesucht";

function App() {
  return (
    <Container maxWidth="xl">
      <Navbar />
      <WGgesucht />
    </Container>
  );
}

export default App;
