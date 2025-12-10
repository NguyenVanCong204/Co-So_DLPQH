import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
        },
        userData: {
            type: Object,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
        lastSentAt: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;
