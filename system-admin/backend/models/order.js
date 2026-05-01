import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerName: { type: String, default: "Guest", required: true },
    address: { type: String, default: "Walk-in customer", required: true },
    paymentMethod: { type: String, required: true },
    items: [
        {
            name: { type: String },
            img: { type:String, required: true },
            quantity: { type: Number, required: true },
            subtotal: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    orderDate: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);


