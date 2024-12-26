import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MetaData from "../../layout/MetaData";
import {
  clearErrors,
  getAdminProduct,
  getAllOrders,
  getAllUsers,
} from "../../../slices/adminSlice";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Cell,
  Legend,
} from "recharts";

const InfoCard = ({ to, label, value, bgColor, textColor }) => (
  <Link
    to={to}
    className={`flex flex-col justify-center items-center text-center text-lg rounded-full w-28 h-28 m-4 ${bgColor} ${textColor} hover:scale-105 transition-transform duration-300`}
    aria-label={`${label} details`}
  >
    <p>{label}</p>
    <p>{value}</p>
  </Link>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, users, orders, error } = useSelector((state) => state.adminData);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch, navigate, error]);

  const outOfStock = products?.filter((item) => item.stock === 0).length || 0;
  const totalAmount = orders?.reduce((acc, item) => acc + item.totalPrice, 0) || 0;

  const lineData = [
    { name: "Initial Amount", total: 0 },
    { name: "Amount Earned", total: totalAmount },
  ];

  const doughnutData = [
    { name: "Out of Stock", value: outOfStock },
    { name: "In Stock", value: (products?.length || 0) - outOfStock },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <>
      <MetaData title="Dashboard - Admin Panel" />

      <h1 className="text-2xl font-bold mt-4 text-center">Admin Dashboard</h1>

      <div className="my-8">
        <div className="flex bg-white justify-center">
          <p className="bg-blue-500 text-white font-semibold text-xl text-center p-4 w-full mx-4 rounded-sm">
            Total Amount <br /> ₹{totalAmount}
          </p>
        </div>

        <div className="flex flex-wrap justify-center mt-6">
          <InfoCard
            to="/admin/product/all"
            label="Products"
            value={products?.length || 0}
            bgColor="bg-yellow-300"
            textColor="text-black"
          />
          <InfoCard
            to="/admin/orders"
            label="Orders"
            value={orders?.length || 0}
            bgColor="bg-red-500"
            textColor="text-white"
          />
          <InfoCard
            to="/admin/users"
            label="Users"
            value={users?.length || 0}
            bgColor="bg-gray-800"
            textColor="text-white"
          />
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="w-[90%] sm:w-[80%] mx-auto mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Doughnut Chart Section */}
      <div className="w-[90%] sm:w-[40%] mx-auto mt-8">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={doughnutData}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="80%"
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              label
            >
              {doughnutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Dashboard;

