import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

function MainLayout() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
