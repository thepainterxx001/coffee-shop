import Product from "../../models/product.js";
import cloudinary from "../middleware/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const categories  = [ "Coffee", "Food", "Merch", "Gifts", "Equipment" ];

    const products = await Product.find({
      category: { $in: categories  }
    }).sort({createdAt: -1}).lean();

    const grouped = {};
    
    products.forEach(p => {
      if (!grouped[p.category]) {
        grouped[p.category] = [];
      }
      grouped[p.category].push(p);
    });


    res.status(200).json({
      message: "Products loaded successfully",
      allProducts: products,
      byCategory: grouped
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const newProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    if (!name)
      return res.status(400).json({ message: "A product name must be provided." });

    if (!price)
      return res.status(400).json({ message: "A product price must be provided." });

    if (!req.file)
      return res.status(400).json({ message: "A product image must be provided." });

    if (!category)
      return res.status(400).json({ message: "A product category must be provided." });

    const b64Img = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64Img}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "product"
    });

    await Product.create({
      name, price, description: description || "No descriptiopn provided.", category,
      img: result.secure_url
    });

    res.status(200).json({ message: "Product added successfully!" });

  } catch (err) {
    console.log("Error in newProduct controller", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
}

export const getProductByCategory = async (req, res) => {
  try { 
    const productCat = await Product.find({ category: req.category });
    if(!productCat)
      return res.status(404).json({ message: "Product not found." });

    res.status(200).json({
      productCat
    });
  } catch (err) {
    console.log("Error in getProductByCategory controller", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
}

export const editProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const updateData = { name, price, description, category };

    if (req.file){
      const b64Img = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64Img}`;

      const updateImg = await cloudinary.uploader.upload(dataURI, {
        folder: "product"
      });
      updateData.img = updateImg.secure_url;
    }

    await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { afterDocument: true }
    );

    res.status(200).json({ message: "Product updated successfully!" });
  } catch (err) {
    console.log("Error in editProduct controller", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) 
      return res.status(404).json({ message: "Product not found." });

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (err) {
    console.log("Error in deleteProduct controller", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
}
