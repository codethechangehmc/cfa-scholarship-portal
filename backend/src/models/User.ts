import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: "student" | "admin";
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: Date;
  };
  createdAt: Date;
}

const schema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student', required: true },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.model<IUser>('User', schema);

export default User;