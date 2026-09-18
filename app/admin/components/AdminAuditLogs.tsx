"use client"

import { useState } from "react"
import { ScrollText, Search } from "lucide-react"
import type { AuditLog, User } from "@/types"
import { Modal } from "@/components/ui/Modal"

interface AdminAuditLogsProps {
  currentUser: User
  initialLogs?: AuditLog[]
}

export const AdminAuditLogs = ({ initialLogs = [] }: AdminAuditLogsProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("ALL")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [logs] = useState<AuditLog[]>(() =>
    initialLogs.map((record) => ({
      ...record,
      id: String(record.id || ""),
      actorId: String(record.actorId || ""),
      actorUsername: String(record.actorUsername || ""),
      action: String(record.action || "") as AuditLog["action"],
      entity: String(record.entity || ""),
      entityId: String(record.entityId || ""),
      timestamp: String(record.timestamp || ""),
    }))
  )

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)))
  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== "ALL" && log.action !== actionFilter) return false
    if (!searchTerm.trim()) return true

    const query = searchTerm.toLowerCase()
    return [log.actorUsername, log.action, log.notes || "", log.entity].some(
      (value) => value.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <ScrollText className="h-6 w-6 text-amber-400" />
            System Audit Trail & Security Ledger
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Administrative approvals, ledger movements, and state transitions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:grid-cols-12">
        <div className="relative sm:col-span-8">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit logs by actor, action, notes, or entity..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pr-4 pl-9 text-xs font-medium text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(event) => setActionFilter(event.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-300 focus:border-amber-500 focus:outline-none sm:col-span-4"
        >
          <option value="ALL">All Actions ({logs.length})</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-sm">
        {filteredLogs.length === 0 ? (
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
                  <th className="py-3.5">Notes</th>
                  <th className="py-3.5">Timestamp</th>
                  <th className="py-3.5 pr-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLogs.map((log) => (
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
                      <span className="block max-w-30 truncate font-mono text-[10px] text-slate-500">
                        {log.entityId}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-200">
                      {log.notes || "-"}
                    </td>
                    <td className="py-4 font-mono text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button
                        type="button"
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

      {selectedLog && (
        <Modal
          isOpen
          onClose={() => setSelectedLog(null)}
          title={`Audit Record: ${selectedLog.action}`}
          description={`Logged by @${selectedLog.actorUsername}`}
          maxWidth="lg"
        >
          <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300">
            {JSON.stringify(selectedLog, null, 2)}
          </pre>
        </Modal>
      )}
    </div>
  )
}
