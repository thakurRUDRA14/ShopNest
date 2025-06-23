import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Button, IconButton, Typography } from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import MetaData from "../../layout/MetaData";
import {
  clearErrors,
  clearErrors as clearDeleteErrors,
  deleteReviews,
  getAllReviews,
  resetOperationStatus,
} from "../../../slices/reviewSlice";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const { error, loading, message, reviews, operationSuccess } = useSelector(
    (state) => state.reviewData
  );

  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (operationSuccess) {
      toast.success(message);
      dispatch(getAllReviews(productId));
      dispatch(resetOperationStatus());
    }
  }, [dispatch, operationSuccess, productId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch])

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    if (!productId.trim()) {
      toast.error("Please enter a valid Product ID.");
      return;
    }
    dispatch(getAllReviews(productId));
  };

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReviews({ reviewId, productId }));
  };

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    { field: "comment", headerName: "Comment", minWidth: 300, flex: 2 },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 100,
      flex: 0.5,
      cellClassName: (rowData) =>
        rowData.row.rating >= 3 ? "text-green-500" : "text-red-500",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (rowData) => (
        <IconButton
          color="error"
          onClick={() => deleteReviewHandler(rowData.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const rows = reviews?.map((item) => ({
    id: item._id,
    rating: item.rating,
    comment: item.comment,
    name: item.name,
  })) || [];

  return (
    <>
      <MetaData title="Product Reviews - Admin -- ShopNest" />

      <form
        className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto mt-9"
        onSubmit={productReviewsSubmitHandler}
      >
        <Typography
          variant="h5"
          align="center"
          className="text-gray-800 font-semibold mb-6"
        >
          Search Product Reviews
        </Typography>

        <div className="flex items-center relative mb-4">
          <StarIcon className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {reviews?.length > 0 ? (
        <div className="mt-10 max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-4">
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableSelectionOnClick
            autoHeight
            className="rounded-lg"
          />
        </div>
      ) : (
        <Typography
          variant="body1"
          align="center"
          className="text-gray-600 mt-8"
        >
          {loading ? "Fetching Reviews..." : "No Reviews Found"}
        </Typography>
      )}
    </>
  );
};

export default ProductReviews;
