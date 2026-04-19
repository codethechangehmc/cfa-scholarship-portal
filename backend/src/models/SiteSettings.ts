import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  schoolYear: string;
  deadline: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  schoolYear: { type: String, required: true, default: "2025-2026" },
  deadline: { type: String, required: true, default: "June 1st, 2025" },
});

export default mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
