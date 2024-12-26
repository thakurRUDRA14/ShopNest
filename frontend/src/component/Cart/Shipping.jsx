import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import {
  Home,
  LocationCity,
  PinDrop,
  Public,
  Phone,
  TransferWithinAStation,
} from "@mui/icons-material";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router";
import { saveShippingInfo } from "../../slices/cartSlice";
import { toast } from "react-toastify";
import CheckoutSteps from "./CheckoutSteps";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.userData)
  const { shippingInfo } = useSelector((state) => state.cartData);

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");

  const shippingSubmit = (e) => {
    e.preventDefault();
    if (phoneNo.length !== 10) {
      toast.error("Phone Number should be 10 digits long");
      return;
    } 0
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    );
    navigate("/order/confirm");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/order/shipping");
    }
  }, [isAuthenticated, navigate])
  return (
    <>
      <MetaData title="Shipping Details" />
      <CheckoutSteps activeStep={0} />

      <div className="flex justify-center items-center flex-col w-full h-screen bg-gray-100">
        <div className="bg-white w-full max-w-md p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-center mb-4 border-b pb-2">
            Shipping Details
          </h2>

          <form
            className="space-y-6"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div className="flex items-center space-x-3">
              <Home className="text-gray-500" />
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center space-x-3">
              <LocationCity className="text-gray-500" />
              <input
                type="text"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center space-x-3">
              <PinDrop className="text-gray-500" />
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="text-gray-500" />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Public className="text-gray-500" />
              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div className="flex items-center space-x-3">
                <TransferWithinAStation className="text-gray-500" />
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2 bg-red-500 text-white rounded-lg transition-all ${state ? "hover:bg-red-600" : "opacity-50 cursor-not-allowed"
                }`}
              onClick={shippingSubmit}
              disabled={!state}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;
