import mongoose, { Schema, type Model, type Types } from "mongoose"

export interface IAuditLog extends mongoose.Document {
  _id: Types.ObjectId
  actorId: string
  actorUsername: string
  action: string
  entity: string
  entityId: string
  previousState?: unknown
  newState?: unknown
  ipAddress?: string
  timestamp: Date
  notes?: string
}

const auditLogSchema: Schema<IAuditLog> = new mongoose.Schema(
  {
    actorId: { type: String, required: true },
    actorUsername: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String, required: true },
    previousState: Schema.Types.Mixed,
    newState: Schema.Types.Mixed,
    ipAddress: String,
    timestamp: { type: Date, default: Date.now, index: true },
    notes: String,
  },
  { timestamps: false }
)

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", auditLogSchema)
