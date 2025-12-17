import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        id_product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name_user: String,
        avatar_user: String,
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

reviewSchema.statics.addReview = async function (data) {
    return await this.create(data);
};

reviewSchema.statics.getReviewsByProduct = async function (id_product) {
    return await this.find({ id_product }).sort({ createdAt: -1 });
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
