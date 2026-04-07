import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    items: [
        {
            productId: { type: Number, required: true },
            name: { type: String },
            quantity: { type: Number, required: true },
            subtotal: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);


