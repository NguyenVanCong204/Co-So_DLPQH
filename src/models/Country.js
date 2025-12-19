import mongoose from 'mongoose';
import User from './User.js';
import mongooseDelete from 'mongoose-delete';

const countrySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true },
);
countrySchema.statics.createCountry = async function (data) {
    return await this.create(data);
};
countrySchema.statics.getCountry = async function () {
    return await this.find();
};
countrySchema.statics.deleteCountry = async function (id) {
    const deletedCountry = await this.delete({ _id: id });
    if (!deletedCountry) return;
    const users = await User.find({ id_country: id });
    const userIds = users.map((u) => u._id);

    return await User.delete({ id_country: id });
};
countrySchema.statics.updateCountry = async function (id, data) {
    return await this.findByIdAndUpdate(id, data, { new: true });
};
countrySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
const Country = mongoose.model('Country', countrySchema);
export default Country;
