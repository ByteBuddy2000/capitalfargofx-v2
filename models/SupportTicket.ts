import mongoose, { type Model, type Schema, type Types } from "mongoose"

export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED"

export interface ISupportTicket extends mongoose.Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  userFullName: string
  userEmail: string
  subject: string
  category: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  message: string
  status: SupportTicketStatus
  createdAt: Date
  updatedAt: Date
}

const supportTicketSchema: Schema<ISupportTicket> = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userFullName: { type: String, required: true },
    userEmail: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "MEDIUM" },
    message: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "RESOLVED"], default: "OPEN" },
  },
  { timestamps: true }
)

export const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", supportTicketSchema)
