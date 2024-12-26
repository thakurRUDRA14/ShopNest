import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Sidebar from './component/Sidebar';
import { useSelector } from 'react-redux';

function AdminLayout() {
    const navigate = useNavigate();

    const { isAuthenticated, user, error } = useSelector((state) => state.userData);
    const role = user?.role;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/admin');
        }
        if (isAuthenticated && role !== 'admin') {
            toast.error("You don't have permission to access this resource.");
            navigate('/');
        }
    }, [isAuthenticated, navigate, role]);

    return (
        <div className="flex flex-col lg:flex-row w-full overflow-hidden">
            <div className="lg:w-1/5 text-white border-r">
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto ">
                <div className="p-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
