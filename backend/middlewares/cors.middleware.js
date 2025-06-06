const customCORS = (req, res, next) => {
    const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : [];

    // Add development origins if in development mode
    if (process.env.NODE_ENV === 'development') {
        allowedOrigins.push('http://localhost:5173');
        allowedOrigins.push('http://127.0.0.1:5173');
    }

    const origin = req.headers.origin;

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return next();

    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        return next();
    }

    console.warn(`CORS blocked for origin: ${origin}`);
    return res.status(403).json({
        success: false,
        message: 'Not allowed by CORS'
    });
};

export default customCORS;