import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center m-auto h-[50vh] p-10">
      <CheckCircleIcon className="text-[7vmax] text-red-700" />
      <Typography className="text-[2vmax] my-4">
        Your Order has been Placed successfully
      </Typography>
      <Link
        to="/orders"
        className="bg-gray-800 text-white font-normal text-[1vmax] py-[1vmax] px-[3vmax] no-underline rounded-md my-[2vmax] hover:bg-gray-700"
      >
        View Orders
      </Link>
    </div>
  );
};

export default OrderSuccess;
