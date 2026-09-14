import React, { useEffect, useState } from "react"
import { ScrollText, Search } from "lucide-react"
import { User, AuditLog } from "../../types"
import { authApi } from "../../lib/api"
import { Modal } from "../ui/Modal"

interface AdminAuditLogsProps {
  currentUser: User
}

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("ALL")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const [logs, setLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    void authApi.adminAuditLogs().then((records) => {
      setLogs(records.map((record) => ({
        ...record,
        id: String(record._id || record.id),
        actorId: String(record.actorId || ""),
        actorUsername: String(record.actorUsername || ""),
        action: String(record.action || "") as AuditLog["action"],
        entity: String(record.entity || ""),
        entityId: String(record.entityId || ""),
        timestamp: String(record.timestamp || ""),
      })))
    }).catch(() => undefined)
  }, [])

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)))

  const filtered = logs.filter((log) => {
    if (actionFilter !== "ALL" && log.action !== actionFilter) return false
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      const matchActor = log.actorUsername.toLowerCase().includes(q)
      const matchAction = log.action.toLowerCase().includes(q)
      const matchNotes = log.notes ? log.notes.toLowerCase().includes(q) : false
      const matchEntity = log.entity.toLowerCase().includes(q)
      if (!matchActor && !matchAction && !matchNotes && !matchEntity)
        return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <ScrollText className="h-6 w-6 text-amber-400" />
            System Audit Trail & Security Ledger
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Cryptographically sealed and immutable audit trail of administrative
            approvals, ledger movements, and state transitions.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:grid-cols-12">
        <div className="relative sm:col-span-8">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit logs by actor, action type, notes, or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pr-4 pl-9 text-xs font-medium text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">All Actions ({logs.length})</option>
            {uniqueActions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No audit records match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="py-3.5 pl-6">Action & Event</th>
                  <th className="py-3.5">Actor</th>
                  <th className="py-3.5">Entity & Target</th>
                  <th className="py-3.5">Audit Justification / Notes</th>
                  <th className="py-3.5">Timestamp</th>
                  <th className="py-3.5 pr-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-slate-800/50"
                  >
                    <td className="py-4 pl-6">
                      <span className="block font-mono text-xs font-black text-amber-400">
                        {log.action}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        Log #{log.id.substring(0, 12)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="block font-bold text-white">
                        @{log.actorUsername}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {log.actorId}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="font-semibold text-slate-300">
                        {log.entity}
                      </span>
                      <span className="block max-w-[120px] truncate font-mono text-[10px] text-slate-500">
                        {log.entityId}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-medium text-slate-200">
                        {log.notes || "—"}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-[11px] text-slate-400">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="cursor-pointer rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                      >
                        JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON State Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Record: ${selectedLog.action}`}
          description={`Logged by @${selectedLog.actorUsername} at ${new Date(selectedLog.timestamp).toISOString()}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="space-y-1 rounded-xl bg-slate-900 p-3 font-mono text-xs text-slate-300">
              <div>
                <strong className="text-amber-400">Action:</strong>{" "}
                {selectedLog.action}
              </div>
              <div>
                <strong className="text-amber-400">Actor ID:</strong>{" "}
                {selectedLog.actorId} (@{selectedLog.actorUsername})
              </div>
              <div>
                <strong className="text-amber-400">Entity:</strong>{" "}
                {selectedLog.entity} ({selectedLog.entityId})
              </div>
              <div>
                <strong className="text-amber-400">Notes:</strong>{" "}
                {selectedLog.notes}
              </div>
            </div>

            {selectedLog.previousState !== undefined && selectedLog.previousState !== null && (
              <div>
                <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">
                  Previous State
                </label>
                <pre className="max-h-40 overflow-x-auto rounded-xl bg-slate-100 p-3 font-mono text-[11px] text-slate-800">
                  {JSON.stringify(selectedLog.previousState, null, 2)}
                </pre>
              </div>
            )}

            {selectedLog.newState !== undefined && selectedLog.newState !== null && (
              <div>
                <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">
                  New State
                </label>
                <pre className="max-h-40 overflow-x-auto rounded-xl bg-slate-100 p-3 font-mono text-[11px] text-slate-800">
                  {JSON.stringify(selectedLog.newState, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
