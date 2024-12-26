import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../slices/userSlice";
import ProfileImg from "../../../assets/Profile.png"

function UserOption({ user }) {
    const { cartItems } = useSelector((state) => state.cartData);

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ];

    if (user?.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard,
        });
    }

    function dashboard() {
        navigate("/admin");
    }

    function orders() {
        navigate("/orders");
    }
    function account() {
        navigate("/me");
    }
    function cart() {
        navigate("/cart");
    }
    function logoutUser() {
        dispatch(logout());
        toast.success("Logout Successfully");
    }

    return (
        <>
            <ul>
                {options && options.map((option, index) => {
                    <li key={index} onClick={option.func}><abbr title={option.name}>{option.icon}</abbr></li>
                })}
            </ul>
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                ariaLabel="tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: "11" }}
                open={open}
                direction="down"
                className="z-50 md:relative  w-12 md:ml-8 -top-3"
                icon={
                    <img
                        className="h-full rounded-2xl md:rounded-full"
                        src={user.avatar?.url ? user.avatar.url : ProfileImg}
                        alt="Profile"
                    />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
        </>
    );
};

export default UserOption;
