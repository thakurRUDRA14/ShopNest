import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import MetaData from "../../layout/MetaData";
import {
  clearErrors,
  deleteProduct,
  getAdminProduct,
  resetOperationStatus,
} from "../../../slices/adminSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { error, operationSuccess, products, message, loading } = useSelector(
    (state) => state.adminData
  );

  useEffect(() => {
    if (operationSuccess) {
      toast.success(message);
      dispatch(resetOperationStatus());
    }
    dispatch(getAdminProduct());
  }, [dispatch, operationSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch])

  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      minWidth: 120,
      flex: 0.5,
      renderCell: (params) => (
        <Link
          to={`/product/${params.row.id}`}>
          <Avatar
            src={params.row.image}
            alt={params.row.name}
            sx={{ width: 45, height: 45 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-product.png";
            }}
          />
        </Link>
      ),
    },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1 },
    { field: "stock", headerName: "Stock", type: "number", minWidth: 100, flex: 0.3 },
    { field: "price", headerName: "Price", type: "number", minWidth: 150, flex: 0.5 },
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.8 },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 150,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => (
        <div className="flex justify-end">
          <IconButton
            component={Link}
            to={`/admin/product/${params.row.id}`}
            aria-label="Edit Product"
            className="text-blue-600 hover:text-blue-800"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => deleteProductHandler(params.row.id)}
            aria-label="Delete Product"
            className="text-red-600 hover:text-red-800"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = products?.map((item) => ({
    id: item._id,
    image: item.images[0]?.url || "/images/default-product.png",
    stock: item.stock,
    price: item.price,
    name: item.name,
  })) || [];

  return (
    <>
      <MetaData title="All Products - Admin" />
      <div className="flex flex-col items-center p-5 bg-gray-50 min-h-screen">
        <Typography
          variant="h4"
          className="mb-6 font-bold text-gray-700 text-center"
        >
          Manage Products
        </Typography>
        {rows.length > 0 ? (
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-4">
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 15, 20]}
              disableSelectionOnClick
              className="rounded-lg"
            />
          </div>
        ) : (
          <Typography
            variant="h6"
            className="mt-10 text-gray-500 text-center"
          >
            {loading ? "Fetching Products..." : " No Product Available"}
          </Typography>
        )}
      </div>
    </>
  );
};

export default ProductList;
