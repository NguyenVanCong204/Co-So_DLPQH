import Review from "../../models/Review.js";
import User from "../../models/User.js";

export const addReview = async (req, res) => {
    try {
        const id_product = req.params.id;
        const id_user = req.user.id || req.user._id;

        const { rating, comment } = req.body;

        if (!rating) {
            return res.status(400).json({ error: "Vui lòng chọn số sao đánh giá" });
        }
        if (!comment) {
            return res.status(400).json({ error: "Vui lòng nhập nội dung đánh giá" });
        }

        const existingReview = await Review.findOne({ id_product, id_user });
        if (existingReview) {
            return res.status(400).json({ error: "Bạn đã đánh giá sản phẩm này rồi" });
        }

        const user = await User.findById(id_user);
        if (!user) return res.status(401).json({ error: "Người dùng không tồn tại" });

        let avatar = "";
        try {
            const avatars = JSON.parse(user.avatar);
            if (Array.isArray(avatars) && avatars.length > 0) avatar = avatars[0];
            else if (typeof avatars === 'string') avatar = avatars;
        } catch (e) {
            avatar = user.avatar;
        }

        const data = {
            id_product,
            id_user,
            rating: parseInt(rating),
            comment,
            name_user: user.name,
            avatar_user: avatar
        };

        const newReview = await Review.create(data);
        return res.status(200).json({ message: "Đánh giá thành công", data: newReview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

export const getReviews = async (req, res) => {
    try {
        const id_product = req.params.id;
        const reviews = await Review.find({ id_product }).sort({ createdAt: -1 });
        return res.status(200).json({ data: reviews });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
