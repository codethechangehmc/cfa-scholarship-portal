import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: "student" | "admin";
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: Date;
  };
  emailVerified?: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student', required: true },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String },
      dateOfBirth: { type: Date },
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: {
      token: String,
      expiresAt: Date,
    },
    resetPasswordToken: {
      token: String,
      expiresAt: Date,
      used: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { password, __v, ...sanitized } = ret as unknown as Record<string, unknown>;
    return sanitized;
  },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;