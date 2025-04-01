import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserOptions from './UserOptions';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Logo from "../../../assets/Logo.svg";

function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.userData)
    const { cartItems } = useSelector((state) => state.cartData);
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 64) {
                setScroll(true)
            }
            else {
                setScroll(false)
            }
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [])
    return (
        <>
            <nav className={`bg-red-500  shadow-md h-[68px] py-4 z-40 max-w-screen-2xl mx-auto md:px-20 px-2 sticky left-0 top-0 right-0 transition-all ease-in-out ${scroll ? "fixed top-5 w-11/12 rounded-md shadow-lg bg-opacity-90 duration-700" : "w-full"}`}>
                <div className="container mx-auto flex justify-between items-start">
                    <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white cursor-pointer">
                        <img
                            src={Logo || "https://res.cloudinary.com/rudra-backend/image/upload/v1734908438/ShopNest/assets/Logo.png"}
                            alt="ShopNest"
                            className="h-10 transition-all duration-200 "
                        />
                    </Link>

                    {/* Hamburger Menu Icon */}
                    <button
                        onClick={toggleMenu}
                        className="block md:hidden text-gray-700 dark:text-white focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                            ></path>
                        </svg>
                    </button>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6 items-center">
                        <li>
                            <Link to="/" className="text-gray-700 font-medium dark:text-white hover:border-b-2">Home</Link>
                        </li>
                        <li>
                            <Link to="/collections" className="text-gray-700 font-medium dark:text-white hover:border-b-2">Collections</Link>
                        </li>
                        <li>
                            <Link to="/about" className="text-gray-700 font-medium dark:text-white hover:border-b-2">About</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-gray-700 font-medium dark:text-white hover:border-b-2">Contact</Link>
                        </li>
                    </ul>
                    <div className='hidden h-8 md:flex items-start'>
                        <ul className="hidden md:flex space-x-4 items-center">
                            <li>
                                <Link to="/search" className="text-gray-700 dark:text-white hover:text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z" /><path strokeLinecap="round" d="M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485" /></g></svg>
                                </Link>
                            </li>

                            {isAuthenticated ? <></> :
                                <li>
                                    <Link to="/login" className="text-gray-700 dark:text-white hover:text-slate-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clipRule="evenodd" /></svg>
                                    </Link>
                                </li>
                            }
                            <li>
                                <Link to="/cart" className={`text-gray-700 dark:text-white hover:text-slate-300 `}>
                                    <ShoppingCartIcon />
                                    <p className={`h-4 w-4 text-center text-xs border-2 text-black font-semibold bg-white  rounded-full relative -top-2 right-3 ${cartItems.length > 0 ? "inline-block " : "hidden"}`}>{cartItems.length}</p>
                                </Link>
                            </li>
                        </ul>
                        {(isAuthenticated && <UserOptions user={user} />)}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <ul className="md:hidden space-y-2 mt-4">
                        <li>
                            <Link to="/" className="text-gray-700 dark:text-white hover:text-blue-600">Home</Link>
                        </li>
                        <li>
                            <Link to="/products" className="text-gray-700 dark:text-white hover:text-blue-600">Products</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-gray-700 dark:text-white hover:text-blue-600">Contact</Link>
                        </li>
                        <li>
                            <Link to="/about" className="text-gray-700 dark:text-white hover:text-blue-600">About</Link>
                        </li>
                        <li>
                            <Link to="/search" className="text-gray-700 dark:text-white hover:text-blue-600">Search</Link>
                        </li>
                        {isAuthenticated ? <li>
                            {isAuthenticated && <UserOptions user={user} />}
                        </li> : <li>
                            <Link to="/login" className="text-gray-700 dark:text-white hover:text-blue-600">Login</Link>
                        </li>}
                    </ul>
                )}
            </nav>
        </>
    )
}

export default Navbar
