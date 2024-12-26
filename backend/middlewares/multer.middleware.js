import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const filename = (uniqueSuffix + '-' + file.originalname).replace(/\s/g, '');
        cb(null, filename)
    }
})

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        // Accept only specific file types (images)
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"), false);
        }
        if (req.files && req.files.length > 0) {
            const totalSize = req.files.reduce((acc, curr) => acc + curr.size, 0);
            if (totalSize > 30 * 1024 * 1024) {
                return cb(new Error("Total file size exceeds 30MB."));
            }
        }
        cb(null, true);
    },
});