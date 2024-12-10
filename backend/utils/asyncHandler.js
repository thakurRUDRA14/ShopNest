const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
        Promise.resolve(requestHandler(req, res, next)).catch(next)
    }
}

export { asyncHandler }



// async method of above code

// const asyncHandler = () => { }
// const asyncHandler = (fn) => { () => { } }
// const asyncHandler = (fn) => async () => { }
// finally this above thing become  const asyncHandler = (fn) => async () => {}


// requestHandler is a function.
// const asyncHandler = (requestHandler) => async (req, res, next) => {
//     try {
//         await requestHandler(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

