import mongoose from 'mongoose';
import Product from './Product.js';
import User from './User.js';
import mongooseDelete from 'mongoose-delete';
const historySchema = new mongoose.Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        id_product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        price: { type: Number },
        quality: { type: Number },
        qualty: { type: Number }, // Support for legacy orders
        status: {
            type: Number,
            required: true,
            default: 0, // 0: Waiting for confirmation, 1: Waiting for delivery, 2: Delivered
        },
        orderCode: {
            type: String,
            index: true, // Index for faster queries, but not unique constraint to allow same orderCode for multiple items
        },
        paymentMethod: {
            type: String,
            default: 'cod', // cod or paypal
        },
        address: {
            type: String,
        },
        note: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);
historySchema.statics.createHistory = async function (data) {
    return await this.create(data);
};
historySchema.statics.checkUser = async function (id_user) {
    const user = await User.findById(id_user);
    const error = {};
    if (!user) {
        error.user = 'Người dùng không tồn tại trong hệ thống';
    }
    return error;
};
historySchema.statics.getOrdersByUser = async function (id_user) {
    return await this.find({ id_user }).populate('id_product').sort({ createdAt: -1 });
};
historySchema.statics.getOrderById = async function (id) {
    return await this.findById(id).populate('id_product').populate('id_user');
};
historySchema.statics.updateOrderStatus = async function (id, status) {
    return await this.findByIdAndUpdate(id, { status }, { new: true }).populate('id_product');
};
historySchema.statics.generateOrderCode = function () {
    // Generate a more unique order code with timestamp and random string
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const random2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD${timestamp}${random}${random2}`;
};
historySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
const History = mongoose.model('History', historySchema);

export default History;
