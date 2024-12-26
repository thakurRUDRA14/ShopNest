import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import MetaData from "../../layout/MetaData";
import Title from "@mui/icons-material/Title";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Description from "@mui/icons-material/Description";
import Category from "@mui/icons-material/Category";
import Inventory from "@mui/icons-material/Inventory";
import { clearErrors, createProduct, resetOperationStatus } from "../../../slices/adminSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, operationSuccess, message } = useSelector((state) => state.adminData);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
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
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (operationSuccess) {
      toast.success(message);
      navigate("/admin/product/all");
      dispatch(resetOperationStatus())
    }
  }, [dispatch, error, operationSuccess]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const newProductForm = new FormData();

    newProductForm.set("name", name);
    newProductForm.set("price", price);
    newProductForm.set("description", description);
    newProductForm.set("category", category);
    newProductForm.set("stock", stock);

    images.forEach((image) => {
      newProductForm.append("images", image);
    });
    dispatch(createProduct(newProductForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

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
      <MetaData title="Create Product" />
      <div className="flex justify-center items-center bg-gray-100 min-h-screen py-10 px-4">
        <form
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg space-y-6"
          encType="multipart/form-data"
          onSubmit={createProductSubmitHandler}
        >
          <h1 className="text-3xl font-semibold text-gray-700 text-center">
            Create New Product
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

          <div className="relative flex items-start">
            <Description className="absolute top-3 left-3 text-gray-500" />
            <textarea
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="relative flex items-center">
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

          <div>
            <label className="block text-gray-500 font-medium mb-2">
              Upload Images
            </label>
            <input
              type="file"
              name="productImage"
              accept="image/*"
              onChange={createProductImagesChange}
              multiple
              className="block w-full text-sm text-gray-600
              file:py-2 file:px-4 file:rounded-lg file:border
              file:border-gray-300 file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {imagesPreview.map((image, index) => (
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
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default NewProduct;
