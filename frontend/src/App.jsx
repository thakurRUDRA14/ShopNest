import { useEffect } from 'react'
import Footer from "./component/layout/Footer/Footer.jsx"
import webFont from "webfontloader"
import { Outlet } from 'react-router-dom'
import Navbar from './component/layout/Header/Navbar.jsx'
import { store } from './store.js'
import { loadUser } from './slices/userSlice.js'

function App() {

  useEffect(() => {
    webFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    });
    store.dispatch(loadUser());
  }, []);

  return (
    <>
      <div className='h-screen'>
        <Navbar />
        <div className='flex justify-center'><Outlet /></div>
        <Footer />
      </div>
    </>
  )
}

export default App
