import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart } from "react-icons/fi"
import UserOptions from './UserOptions'
import Logo from "../../../assets/Logo.png";
import Search from '../../Product/Search'

function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.userData)
    const { cartItems } = useSelector((state) => state.cartData)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeLink, setActiveLink] = useState('')
    const [scroll, setScroll] = useState(false)


    const NavLinks = [
        { path: '/', name: 'Home' },
        { path: '/collections', name: 'Shop' },
        // { path: '/categories', name: 'Categories' },
        { path: '/about', name: 'About' },
        { path: '/contact', name: 'Contact' }
    ]

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 64) {
                setScroll(true)
            } else {
                setScroll(false)
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const handleLinkClick = (path) => {
        setActiveLink(path)
        setMobileMenuOpen(false)
    }

    return (
        <>
            <header className={`bg-white shadow-sm sticky top-0 z-50 transition-all duration-500 ${scroll ? "shadow-lg" : ""}`}>
                {/* Top Navigation Bar */}
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>

                        {/* Logo with 3D effect */}
                        <Link
                            to="/"
                            className="text-2xl font-bold text-primary hover:scale-105 transition-transform duration-300"
                            onClick={() => handleLinkClick('/')}
                        >
                            <div className="flex items-center">
                                <img
                                    src={Logo || "https://res.cloudinary.com/rudra-backend/image/upload/v1734908438/ShopNest/assets/Logo.png"}
                                    alt="ShopNest"
                                    className="h-10 transition-all duration-300 hover:drop-shadow-[0_5px_5px_rgba(79,70,229,0.3)]"
                                />
                            </div>
                        </Link>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 mx-6">
                            <Search />
                        </div>

                        {/* Navigation Icons */}
                        <div className="flex items-center space-x-4">
                            {/* <Link to="/wishlist" className="p-2 text-gray-700 hover:text-primary relative transition-colors">
                                <FiHeart size={20} />
                                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform hover:scale-110 transition-transform">
                                    3
                                </span>
                            </Link> */}
                            <Link
                                to="/cart"
                                className="p-2 text-gray-700 hover:text-indigo-600 relative transition-colors"
                            >
                                <FiShoppingCart size={20} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform hover:scale-110 transition-transform">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                            {isAuthenticated ? (
                                <UserOptions user={user} />
                            ) : (
                                <Link
                                    to="/login"
                                    className="p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    <FiUser size={20} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Search - Visible only on mobile */}
                    <div className="mt-3 md:hidden">
                        <Search />
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 py-2 animate-slideDown">
                        <div className="container mx-auto px-4">
                            <nav className="flex flex-col space-y-2">
                                {NavLinks.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`py-2 px-3 rounded-md transition-all duration-200 ${activeLink === item.path ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
                                        onClick={() => handleLinkClick(item.path)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Desktop Navigation */}
                <nav className={`hidden md:block bg-gradient-to-r from-indigo-600 to-indigo-700 text-white transition-all duration-500 ${scroll ? "fixed top-0 left-0 right-0 shadow-xl" : ""}`}>
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-6">
                                {NavLinks.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative px-3 py-1 rounded transition-all duration-200 hover:bg-indigo-700 hover:shadow-md ${activeLink === item.path ? 'font-medium' : ''}`}
                                        onClick={() => handleLinkClick(item.path)}
                                    >
                                        {item.name}
                                        {activeLink === item.path && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-white rounded-full"></div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                            {/* <div className="text-sm bg-white/10 px-3 py-1 rounded-full animate-pulse">
                                Summer Sale: 30% off sitewide! Use code <span className="font-bold">SUMMER30</span>
                            </div> */}
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Navbar