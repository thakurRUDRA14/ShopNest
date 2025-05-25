import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux"
import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store.js'
import App from './App.jsx'
import Home from './component/Home/Home.jsx'
import ProductDetails from './component/Product/ProductDetails.jsx'
import Products from './component/Product/Products.jsx'
import Profile from './component/User/Profile.jsx'
import Login from './component/User/Login.jsx'
import Register from './component/User/Register.jsx'
import UpdateProfile from './component/User/UpdateProfile.jsx'
import UpdatePassword from './component/User/UpdatePassword.jsx'
import ForgetPassword from './component/User/ForgetPassword.jsx'
import ResetPassword from './component/User/ResetPassword.jsx'
import Cart from './component/Cart/Cart.jsx'
import CheckoutLayout from './component/Cart/CheckoutLayout.jsx'
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
import Contact from './component/layout/Header/Contact.jsx'
import About from './component/layout/Header/About.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    [
      <Route path='/' element={<App />}>
        <Route path='' element={<Home />} />
        <Route path='collections' element={<Products />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        <Route path='products' element={<Products />} />
        <Route path='product/:productId' element={<ProductDetails />} />
        <Route path='products/:keyword' element={<Products />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='me' element={<Profile />} />
        <Route path='me/update' element={<UpdateProfile />} />
        <Route path='password/update' element={<UpdatePassword />} />
        <Route path='password/forget' element={<ForgetPassword />} />
        <Route path='password/reset/:token' element={<ResetPassword />} />
        <Route path='cart' element={<Cart />} />
        <Route element={<CheckoutLayout />}>
          <Route path='shipping' element={<Shipping />} />
          <Route path='confirmOrder' element={<ConfirmOrder />} />
          <Route path='payment' element={<Payment />} />
        </Route>
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
      position="top-center"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      draggable
      theme="light"
      transition={Flip}
    />
  </Provider>,
)
