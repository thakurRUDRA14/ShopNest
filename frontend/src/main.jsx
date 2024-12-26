import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux"
import { store } from './store.js'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Home from './component/Home/Home.jsx'
import ProductDetails from './component/Product/ProductDetails.jsx'
import Products from './component/Product/Products.jsx'
import Search from './component/Product/Search.jsx'
import LoginSignUp from './component/User/LoginSignUp.jsx'
import Profile from './component/User/Profile.jsx'
import UpdateProfile from './component/User/UpdateProfile.jsx'
import UpdatePassword from './component/User/UpdatePassword.jsx'
import ForgetPassword from './component/User/ForgetPassword.jsx'
import ResetPassword from './component/User/ResetPassword.jsx'
import Cart from './component/Cart/Cart.jsx'
import Shipping from './component/Cart/Shipping.jsx'
import ConfirmOrder from './component/Cart/ConfirmOrder.jsx'
import Payment from './component/Cart/Payment.jsx'
import OrderSuccess from './component/Cart/OrderSuccess.jsx'
import MyOrders from './component/Order/MyOrders.jsx'
import OrderDetails from './component/Order/OrderDetails.jsx'
import Dashboard from './component/Admin/component/Dashboard.jsx'
import ProductsList from './component/Admin/component/ProductsList.jsx'
import NewProduct from './component/Admin/component/NewProduct.jsx'
import UpdateProduct from './component/Admin/component/UpdateProduct.jsx'
import UsersList from './component/Admin/component/UsersList.jsx'
import UpdateUser from './component/Admin/component/UpdateUser.jsx'
import OrderList from './component/Admin/component/OrderList.jsx'
import AdminLayout from './component/Admin/AdminLayout.jsx'
import ProcessOrder from './component/Admin/component/ProcessOrder.jsx'
import ProductReviews from './component/Admin/component/ProductReviews.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    [
      <Route path='/' element={<App />}>
        <Route path='' element={<Home />} />
        <Route path='collections' element={<Products />} />
        <Route path='products' element={<Products />} />
        <Route path='product/:productId' element={<ProductDetails />} />
        <Route path='products/:keyword' element={<Products />} />
        <Route path='search' element={<Search />} />
        <Route path='login' element={<LoginSignUp />} />
        <Route path='me' element={<Profile />} />
        <Route path='me/update' element={<UpdateProfile />} />
        <Route path='password/update' element={<UpdatePassword />} />
        <Route path='password/forget' element={<ForgetPassword />} />
        <Route path='password/reset/:token' element={<ResetPassword />} />
        <Route path='cart' element={<Cart />} />
        <Route path='order/shipping' element={<Shipping />} />
        <Route path='order/confirm' element={<ConfirmOrder />} />
        <Route path='order/payment' element={<Payment />} />
        <Route path='success' element={<OrderSuccess />} />
        <Route path='orders' element={<MyOrders />} />
        <Route path='order/:id' element={<OrderDetails />} />
        <Route path='admin' element={<AdminLayout />}>
          <Route path='' element={<Dashboard />} />
          <Route path='product/all' element={<ProductsList />} />
          <Route path='product/new' element={<NewProduct />} />
          <Route path='product/:productId' element={<UpdateProduct />} />
          <Route path='users' element={<UsersList />} />
          <Route path='user/:userId' element={<UpdateUser />} />
          <Route path='orders' element={<OrderList />} />
          <Route path='order/:orderId' element={<ProcessOrder />} />
          <Route path='reviews' element={<ProductReviews />} />
        </Route>
      </Route>
    ]
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition:Flip
    />
  </Provider>,
)
