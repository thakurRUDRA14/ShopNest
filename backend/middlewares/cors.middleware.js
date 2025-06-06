import cors from "cors";

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : [];

if (process.env.NODE_ENV === "development") {
    allowedOrigins.push("http://localhost:5173", "http://127.0.0.1:5173");
}

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl or mobile apps)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
};

export const useCors = cors(corsOptions);
