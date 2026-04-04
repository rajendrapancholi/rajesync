import mongoose, { Model, Schema, model, models } from "mongoose";

export interface IProvider {
  userId: mongoose.Types.ObjectId;
  category: string; 
  bio: string;
  rating: number;
  price: number;
  availableSlots: string[];
}

const providerSchema = new Schema<IProvider>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  bio: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  price: {type: Number, default: 30},
  availableSlots: [{ type: String }]
}, { timestamps: true });

providerSchema.virtual('id').get(function() { return this._id.toHexString(); });
providerSchema.set('toJSON', { virtuals: true });

const ProviderModel: Model<IProvider> =
  models.Provider || model<IProvider>("Provider", providerSchema);

export default ProviderModel;

