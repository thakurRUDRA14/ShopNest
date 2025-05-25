import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import { clearErrors, createOrder } from "../../slices/orderSlice";
import { emptyCart } from '../../slices/cartSlice';

const banks = [
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'kotak', name: 'Kotak Mahindra Bank' },
];

const wallets = [
  { id: 'paytm', name: 'Paytm', icon: 'https://logo.clearbit.com/paytm.com' },
  { id: 'phonepe', name: 'PhonePe', icon: 'https://logo.clearbit.com/phonepe.com' },
  { id: 'amazonpay', name: 'Amazon Pay', icon: 'https://logo.clearbit.com/amazonpay.in' },
];

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const { totalPrice } = orderInfo;

  const { isAuthenticated } = useSelector((state) => state.userData);
  const { shippingInfo, cartItems } = useSelector((state) => state.cartData);
  // const { user } = useSelector((state) => state.userData);
  const { error } = useSelector((state) => state.orderData);

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
    paymentInfo: {
      id: "result.paymentIntent.id",
      status: "result.paymentIntent.status",
    }
  };


  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    try {
      // Payment processing logic would go here
      dispatch(createOrder(order));
      dispatch(emptyCart());
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("There's some issue while processing payment ");
    }
  };


  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (!isAuthenticated) {
      navigate("/login?redirect=/payment");
    }
    if (!cartItems.length) {
      navigate("/cart");
    }
  }, [dispatch, error, isAuthenticated, cartItems]);

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    isAuthenticated &&
    <>
      <MetaData title="Payment -- SHOPNEST" />
      <motion.div
        layoutId="checkout-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg overflow-hidden sm:my-8 mx-auto px-0.5 sm:px-4 max-w-5xl"
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Payment Method</h1>
          <p className="text-gray-600">Complete your purchase by selecting a payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Payment Options */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Choose Payment Method</h2>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'card' ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Card
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'upi' ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'netbanking' ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Net Banking
                </button>
                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'wallet' ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Wallets
                </button>
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'cod' ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  COD
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="pt-2">
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Pay via UPI
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Net Banking Form */}
              {paymentMethod === 'netbanking' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="">Select your bank</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>{bank.name}</option>
                      ))}
                    </select>
                  </div>
                  {selectedBank && (
                    <div className="pt-2">
                      <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Proceed to Net Banking
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Wallet Options */}
              {paymentMethod === 'wallet' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {wallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                      >
                        <img src={wallet.icon} alt={wallet.name} className="h-8 mr-2" />
                        <span className="font-medium">{wallet.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* COD Option */}
              {paymentMethod === 'cod' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <h3 className="font-medium text-yellow-800">Cash on Delivery</h3>
                  <p className="text-sm text-yellow-700">
                    Pay in cash when your order is delivered. An additional ₹50 charge may apply.
                  </p>
                  <div className="pt-2">
                    <button className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                      Place COD Order
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <motion.div layoutId="order-summary" className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{orderInfo.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{orderInfo.shippingCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax (18%):</p>
                  <span className="font-medium">₹{orderInfo.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>Total</span>
                    <span className="text-indigo-600">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping to</h3>
                <p className="text-sm text-gray-600">
                  {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pinCode}
                </p>
              </div>

              <button
                onClick={(e) => handlePaymentSubmit(e)}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
              >
                Complete Payment
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Your payment is secured with 256-bit SSL encryption
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Payment;