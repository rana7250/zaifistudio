const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const ROOT = __dirname;
const IMAGES_DIR = path.join(ROOT, "Images");
const VIDEOS_DIR = path.join(ROOT, "Videos");
const PORT = process.env.PORT || 3000;

if (!fs.existsSync(IMAGES_DIR)) {
fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(VIDEOS_DIR)) {
fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
destination: function (req, file, cb) {
if (file.mimetype.startsWith("image/")) {
cb(null, IMAGES_DIR);
return;
}
if (file.mimetype.startsWith("video/")) {
cb(null, VIDEOS_DIR);
return;
}
cb(new Error("Only image and video uploads are allowed"));
},
filename: function (req, file, cb) {
const ext = path.extname(file.originalname || "").toLowerCase();
const safeExt = ext || (file.mimetype.startsWith("video/") ? ".mp4" : ".jpg");
const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
cb(null, `${unique}${safeExt}`);
}
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("media"), function (req, res) {
if (!req.file) {
res.status(400).json({ error: "No file uploaded" });
return;
}

const folder = req.file.mimetype.startsWith("video/") ? "Videos" : "Images";
res.json({
path: `${folder}/${req.file.filename}`,
mediaType: req.file.mimetype.startsWith("video/") ? "video" : "image"
});
});

app.use(express.static(ROOT));

app.listen(PORT, function () {
console.log(`Zaifi Studio server running on http://localhost:${PORT}`);
});
