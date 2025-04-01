import React, { useState } from "react";
import Logo from "../../../assets/Logo.png";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  const handleHover = (isHovered) => setExpanded(isHovered);
  const handleAccordionToggle = () => setExpanded(!expanded);

  return (
    <div className="bg-white shadow-md h-full flex flex-col py-8">
      {/* Logo Section */}
      <Link to="/" className="flex justify-center p-4 mb-8">
        <img
          src={Logo || "https://res.cloudinary.com/rudra-backend/image/upload/v1734908438/ShopNest/assets/Logo.png"}
          alt="ShopNest"
          className="w-32 lg:w-full transition-all duration-300 hover:opacity-80"
        />
      </Link>

      {/* Sidebar Links */}
      <nav className="space-y-4 px-4">
        {/* Dashboard Link */}
        <Link
          to="/admin"
          className="flex items-center text-gray-700 hover:text-indigo-600 transition-transform duration-300 hover:scale-105"
        >
          <DashboardIcon className="mr-3" />
          <Typography variant="body1" className="font-medium">
            Dashboard
          </Typography>
        </Link>

        {/* Products Accordion */}
        <div
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
          className="-ml-4"
        >
          <Accordion
            expanded={expanded}
            onChange={handleAccordionToggle}
            sx={{
              '&.MuiAccordion-root': { boxShadow: 'none', border: 'none' },
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="flex items-center text-gray-700 hover:text-indigo-600 transition-transform duration-300 hover:scale-105"
            >
              <ImportExportIcon className="mr-3" />
              <Typography variant="body1" className="font-medium">
                Products
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="pl-10 space-y-2">
              <Link
                to="/admin/product/all"
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <PostAddIcon className="mx-3" />
                <Typography variant="body2">All Products</Typography>
              </Link>
              <Link
                to="/admin/product/new"
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <AddIcon className="mx-3" />
                <Typography variant="body2">Create Product</Typography>
              </Link>
            </AccordionDetails>
          </Accordion>
        </div>
        {/* Orders Link */}
        <Link
          to="/admin/orders"
          className="flex items-center text-gray-700 hover:text-indigo-600 transition-transform duration-300 hover:scale-105"
        >
          <ListAltIcon className="mr-3" />
          <Typography variant="body1" className="font-medium">
            Orders
          </Typography>
        </Link>

        {/* Users Link */}
        <Link
          to="/admin/users"
          className="flex items-center text-gray-700 hover:text-indigo-600 transition-transform duration-300 hover:scale-105"
        >
          <PeopleIcon className="mr-3" />
          <Typography variant="body1" className="font-medium">
            Users
          </Typography>
        </Link>

        {/* Reviews Link */}
        <Link
          to="/admin/reviews"
          className="flex items-center text-gray-700 hover:text-indigo-600 transition-transform duration-300 hover:scale-105"
        >
          <RateReviewIcon className="mr-3" />
          <Typography variant="body1" className="font-medium">
            Reviews
          </Typography>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
