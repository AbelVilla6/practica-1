import mongoose, { Schema, Types } from 'mongoose';

export interface Product {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  img?: string;
  price: number;
  color: string;
  operative_system: string;
  technology: string;
}

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  img: {
    type: String,
  },
  color: {
    type: String,
    required:true,
  },
  operative_system: {
    type: String,
    required:true,
  },
  technology: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);