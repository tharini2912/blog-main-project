import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const pathsWithoutHeaderFooter = ["/login", "/signup", "/"];
  const hideHeaderFooter = pathsWithoutHeaderFooter.includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main>
        <Outlet />
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
