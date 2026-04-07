import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/product.js";

const sampleProducts = [
    { id: 1, name: 'Barako Brew 250g', price: 199.00, img: 'images/barako-brew.jpg', description: 'Rich barako roast with deep aroma.', category: 'Coffee' }, 
    { id: 2, name: 'Kape-Ling Ka Ceramic Mug', price: 299.00, img: 'images/ceramic-mug.jpg', description: 'Thick ceramic mug—perfect for barako.', category: 'Merch' },
    { id: 3, name: 'Snack Combo Box', price: 179.00, img: 'images/snack-combo-box.jpg', description: 'Local snacks pack, limited time.', category: 'Food' },
    { id: 4, name: 'Gift Card ₱500', price: 500.00, img: 'images/gift-card.jpg', description: 'Give the gift of taste.', category: 'Gifts' },
    { id: 5, name: 'Coffee Grinder', price: 899.00, img: 'images/coffee-grinder.jpg', description: 'Manual burr grinder for fresh brew.', category: 'Equipment' },
    { id: 6, name: 'Retro Pixel Poster', price: 129.00, img: 'images/retro-pixel-poster.jpg', description: 'Pixelated Kape-Ling Ka Coffee Shop art print.', category: 'Merch' }
];

const seedDatabase = async () => {
    try {
        const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kapelingka';
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Prevent duplicates
        await Product.deleteMany({});
        console.log("Cleared old products.");

        // Insert the new data
        await Product.insertMany(sampleProducts);
        console.log("Successfully seeded products!");

        // Disconnect when done
        mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();

