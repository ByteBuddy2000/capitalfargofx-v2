import { AuditLog } from "@/models/AuditLog"

interface WriteAuditLogInput {
  actorId: string
  actorUsername: string
  action: string
  entity: string
  entityId: string
  previousState?: unknown
  newState?: unknown
  notes?: string
}

export async function writeAuditLog(input: WriteAuditLogInput): Promise<void> {
  await AuditLog.create(input)
}
