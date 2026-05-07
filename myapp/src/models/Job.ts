import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  companyName: string;
  role: string;
  status: string;
  date: Date;
}

const JobSchema: Schema = new Schema({
  companyName: {
    type: String,
    required: [true, "Please add a company name"],
    trim: true,
  },
  role: {
    type: String,
    required: [true, "Please add a role"],
    enum: ["Frontend", "Fullstack", "Software Developer", "Software Engineer"],
  },
  status: {
    type: String,
    required: [true, "Please add a status"],
    enum: ["applied", "shortlisted", "interview", "selected", "rejected", "noreply"],
    default: "applied",
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
