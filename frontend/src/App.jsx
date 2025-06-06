import { useEffect } from 'react';
import Footer from "./component/layout/Footer/Footer.jsx";
import webFont from "webfontloader";
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './component/layout/Header/Navbar.jsx';
import { useHydrateUser } from "./hooks/useHydrateUser";

function App() {
  const location = useLocation();

  const excludePaths = ["/login", "/register", "/password/forget", "/password/reset"];
  const shouldHydrateUser = !excludePaths.some(path => location.pathname.startsWith(path));

  useHydrateUser(shouldHydrateUser);

  useEffect(() => {
    webFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    });
  }, []);


  return (
    <div className='h-screen'>
      <Navbar />
      <div className='flex justify-center'><Outlet /></div>
      <Footer />
    </div>
  );
}

export default App;
