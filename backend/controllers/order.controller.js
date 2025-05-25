import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiFeatures } from "../utils/ApiFeatures.js";

// New order
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

// Get single order
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

// Get loggedin user all orders
const myOrders = asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user._id) {
        return res.status(400).json({ message: "User not authenticated" });
    }

    const resultPerPage = 3;
    const ordersCount = await Order.countDocuments({ user: req.user._id });

    const apiFeatures = new ApiFeatures(Order.find({ user: req.user._id }), req.query).pagination(resultPerPage); //creating query

    const orders = await apiFeatures.query; // Execute the query

    res.status(200).json(
        new ApiResponse(200, { orders, ordersCount, resultPerPage }, "All orders fetched successfully")
    );
});

//   Get all orders --Admin
const getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json(new ApiResponse(200, { orders, totalAmount }, "All orders fetched successfully"))
})

// Update order status -- Admin
const updateOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params._id);
    if (!order) {
        return next(new ApiError(404, "Order not found with this Id"))
    }
    order.orderItems.forEach(async (item) => {
        if ((order.orderStatus === "PENDING" || order.orderStatus === "PROCESSING" || order.orderStatus === "CANCELLED") && (req.body.status === "SHIPPED" || req.body.status === "DELIVERED")) {
            await updateStock(item.productId, item.quantity, "decrease");
        }
        else if ((order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED") && (req.body.status === "PROCESSING" || req.body.status === "CANCELLED")) {
            await updateStock(item.productId, item.quantity, "increase");
        }
    })

    order.orderStatus = req.body.status;

    if (req.body.status === "DELIVERED") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false })
    res.status(200).json(new ApiResponse(200, order, "Status updated successfully"))
})
async function updateStock(_id, quantity, status) {
    const product = await Product.findById(_id);

    if (status === "decrease") {
        if (product.stock < quantity) {
            return next(new ApiError(`Insufficient stock for product: ${product.name}`));
        }
        product.stock -= quantity;
    }
    else if (status === "increase") {
        product.stock += quantity;
    }
    await product.save({ validateBeforeSave: false })
}

// Delete order -- Admin
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
