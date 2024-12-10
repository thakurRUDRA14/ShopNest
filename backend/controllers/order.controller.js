import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

const newOrder = asyncHandler(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });
    res.status(201).json(new ApiResponse(201, order, "Order Placed successfully."))
})

// get single order
const getSingleOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ApiError("Order not found with this Id", 404))
    }

    res.status(200).json(new ApiResponse(200, order, "Order details fetched successfully"))
})

// get loggedin user all orders
const myOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"))
})
//   get all orders --Admin
const getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json(new ApiResponse(200, { orders, totalAmount }, "All orders fetched successfully"))
})

// update order Status -- Admin
const updateOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params._id);
    if (!order) {
        return next(new ApiError(404, "Order not found with this Id"))
    }
    if (order.orderStatus === "DELIVERED") {
        return next(new ApiError(400, order, "You have already delivered this order"))
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity)
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "DELIVERED") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false })
    res.status(200).json(new ApiResponse(200, order, "Status Updated"))

})

async function updateStock(_id, quantity) {
    const product = await Product.findById(_id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false })
}

// delete order
const deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params._id);
    if (!order) {
        return next(new ApiError(404, "Order not found with this Id"))
    }
    await order.deleteOne()
    res.status(200).json(new ApiResponse(200, order, "Order deleted successfully"))

})
export {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
}
