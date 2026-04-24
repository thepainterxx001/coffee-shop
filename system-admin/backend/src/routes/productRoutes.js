import express from "express";
import { editProduct, getAllProducts, newProduct } from "../controller/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/all-products", getAllProducts);
router.post("/new-product", upload.single("product"), newProduct);
router.put("/edit-product/:id", upload.single("product"), editProduct);

export default router