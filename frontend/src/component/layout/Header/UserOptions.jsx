import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { logout } from "../../../slices/userSlice"
import ProfileImg from "../../../assets/Profile.png"
import { FiUser, FiLogOut, FiList, FiGrid } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

function UserOptions({ user, mobile = false }) {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const options = [
        { icon: <FiList size={18} />, name: "Orders", func: orders },
        { icon: <FiUser size={18} />, name: "Profile", func: account },
        { icon: <FiLogOut size={18} />, name: "Logout", func: logoutUser },
    ]

    if (user?.role === "admin") {
        options.unshift({
            icon: <FiGrid size={18} />,
            name: "Dashboard",
            func: dashboard,
        })
    }

    function dashboard() {
        navigate("/admin")
        setOpen(false)
    }

    function orders() {
        navigate("/orders")
        setOpen(false)
    }
    
    function account() {
        navigate("/me")
        setOpen(false)
    }
    
    function logoutUser() {
        dispatch(logout())
        toast.success("Logout Successfully")
        setOpen(false)
    }

    // Animation variants
    const dropdownVariants = {
        hidden: { 
            opacity: 0, 
            y: -10,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15
            }
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 focus:outline-none group"
                aria-expanded={open}
                aria-haspopup="true"
            >
                <img
                    className="h-8 w-8 rounded-full object-cover border-2 border-white group-hover:border-indigo-400 transition-all duration-300"
                    src={user.avatar?.url ? user.avatar.url : ProfileImg}
                    alt="Profile"
                />
                {!mobile && (
                    <span className="text-gray-700 group-hover:text-indigo-600 transition-colors duration-300 hidden md:inline-block">
                        {user.name.split(" ")[0]}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        className={`absolute ${mobile ? 'relative mt-2' : 'right-0 mt-2'} w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100 overflow-hidden`}
                    >
                        {options.map((item) => (
                            <motion.button
                                key={item.name}
                                onClick={item.func}
                                whileHover={{ backgroundColor: "#f5f3ff" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-200 flex items-center"
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default UserOptions