import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import MetaData from "../../layout/MetaData";
import Title from "@mui/icons-material/Title";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Description from "@mui/icons-material/Description";
import Category from "@mui/icons-material/Category";
import Inventory from "@mui/icons-material/Inventory";
import { useNavigate, useParams } from "react-router";
import { clearErrors, getProductDetails } from "../../../slices/productSlice";
import { updateProduct, clearErrors as clearUpdateErrors, resetOperationStatus } from "../../../slices/adminSlice";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const { error, productDetails: product } = useSelector((state) => state.productsData);

  const {
    loading,
    error: updateError,
    operationSuccess, message
  } = useSelector((state) => state.adminData);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  useEffect(() => {
    if (productId) {
      dispatch(getProductDetails(productId));
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      setOldImages(product.images);
      setImages(product.images)
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearUpdateErrors());
    }

    if (operationSuccess) {
      toast.success(message);
      navigate("/admin/product/all");
      dispatch(resetOperationStatus());
    }
  }, [
    dispatch,
    error,
    operationSuccess,
    productId,
    updateError,
  ]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const updateProductForm = new FormData();

    updateProductForm.set("name", name);
    updateProductForm.set("price", price);
    updateProductForm.set("description", description);
    updateProductForm.set("category", category);
    updateProductForm.set("stock", stock);

    images.forEach((image) => {
      updateProductForm.append("images", image);
    });
    dispatch(updateProduct({ productId, updateProductForm }));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const isFormValid = !loading && name && price >= 0 && description && category && stock >= 0 && images.length > 0;

  return (
    <>
      <MetaData title="Update Product" />
      <div className="flex justify-center items-center bg-gray-100 min-h-screen py-10 px-4">
        <form
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg space-y-6"
          encType="multipart/form-data"
          onSubmit={updateProductSubmitHandler}
        >
          <h1 className="text-3xl font-semibold text-gray-700 text-center">
            Update Product
          </h1>

          <div className="relative flex items-center">
            <Title className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Product Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative flex items-center">
            <CurrencyRupeeIcon className="absolute left-3 text-gray-500" />
            <input
              type="number"
              placeholder="Price"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value >= 0 ? e.target.value : 0)}
              className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <Description className="absolute top-3 left-3 text-gray-500" />
            <textarea
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="relative">
            <Category className="absolute left-3 text-gray-500" />
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Choose Category</option>
              {categories.map((cate) => (
                <option key={cate} value={cate}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex items-center">
            <Inventory className="absolute left-3 text-gray-500" />
            <input
              type="number"
              placeholder="Stock"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value >= 0 ? e.target.value : 0)}
              className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <label className="block text-gray-500 font-medium mb-2">
            Upload Images
          </label>
          <div className="flex flex-col items-start space-y-2">
            <input
              type="file"
              name="productImage"
              accept="image/*"
              onChange={updateProductImagesChange}
              multiple
              className="block w-full text-sm text-gray-600
            file:py-2 file:px-4 file:rounded-lg file:border
            file:border-gray-300 file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"            />
          </div>

          <div className="flex flex-wrap gap-2">
            {oldImages &&
              oldImages.map((image, index) => (
                <img key={index} src={image.url} alt="Old Product Preview" className="w-16 h-16 object-cover rounded-md shadow" />
              ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {imagesPreview && imagesPreview.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Product Preview"
                className="w-16 h-16 object-cover rounded-md shadow"
              />
            ))}
          </div>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isFormValid}
            className="w-full py-3 text-lg"
          >
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </div>

    </>
  );
};

export default UpdateProduct;
