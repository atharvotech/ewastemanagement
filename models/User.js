import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  orderId: { type: String, required: true },
  wasteType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'scheduled', 'in-progress', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() }
});

const userSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  orders: [orderSchema],
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() }
});

export default model('User', userSchema);
