import express from "express";
import { deleteProduct, editProduct, getAllProducts, getProductByCategory, newProduct } from "../controller/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/all-products", getAllProducts);
router.get("/products/:category", getProductByCategory);
router.post("/new-product", upload.single("product"), newProduct);
router.put("/edit-product/:id", upload.single("product"), editProduct);
router.delete("/delete-product/:id", deleteProduct);

export default router