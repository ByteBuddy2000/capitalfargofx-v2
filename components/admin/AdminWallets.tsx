import React, { useEffect, useState } from "react"
import { Wallet, Edit2, Plus } from "lucide-react"
import { User, CryptoWalletConfig } from "../../types"
import { authApi } from "../../lib/api"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Badge } from "../ui/Badge"
import { CryptoQRCode } from "../ui/CryptoQRCode"
import { Modal } from "../ui/Modal"
import { useToast } from "../ui/Toast"

interface AdminWalletsProps {
  currentUser: User
}

export const AdminWallets: React.FC<AdminWalletsProps> = () => {
  const [wallets, setWallets] = useState<CryptoWalletConfig[]>([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingWallet, setEditingWallet] = useState<CryptoWalletConfig | null>(
    null
  )

  const { success } = useToast()

  useEffect(() => {
    void authApi.adminWallets().then((records) => {
      setWallets(records as CryptoWalletConfig[])
    }).catch(() => undefined)
  }, [])

  const handleOpenEdit = (w: CryptoWalletConfig) => {
    setEditingWallet({ ...w })
    setEditModalOpen(true)
  }

  const handleOpenCreate = () => {
    const newWallet: CryptoWalletConfig = {
      id: `wallet-${Date.now()}`,
      symbol: "USDT",
      name: "Tether USD (TRC-20)",
      network: "TRC-20 (TRON)",
      address: "TYDzsYUEWpYm...deposit_address",
      isActive: true,
      updatedAt: new Date().toISOString(),
    }
    setEditingWallet(newWallet)
    setEditModalOpen(true)
  }

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingWallet) return

    void authApi
      .saveAdminWallet(editingWallet as unknown as Record<string, unknown>)
      .then((savedWallet) => {
        setWallets((current) => {
          const exists = current.some((wallet) => wallet.id === savedWallet.id)
          return exists
            ? current.map((wallet) => (wallet.id === savedWallet.id ? savedWallet as CryptoWalletConfig : wallet))
            : [...current, savedWallet as CryptoWalletConfig]
        })
        success("Wallet Address Updated", `Deposit receiving address for ${editingWallet.name} saved.`)
        setEditModalOpen(false)
      })
      .catch(() => undefined)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <Wallet className="h-6 w-6 text-teal-400" />
            Receiving Cryptocurrency Wallets
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Configure system cold/hot receiving deposit addresses shown to
            investors during deposit requests.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="h-4 w-4" />}
          className="bg-teal-600 font-bold text-white hover:bg-teal-700"
        >
          Add Settlement Address
        </Button>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {wallets.map((w) => (
          <div
            key={w.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm"
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-teal-800 bg-teal-950 text-xs font-bold text-teal-300">
                    {w.symbol}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{w.name}</h3>
                    <p className="text-[11px] font-semibold text-teal-400">
                      {w.network}
                    </p>
                  </div>
                </div>
                <Badge variant={w.isActive ? "success" : "neutral"}>
                  {w.isActive ? "ACTIVE" : "DISABLED"}
                </Badge>
              </div>

              {/* QR Preview Box */}
              <div className="my-4 hidden flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="rounded-xl bg-white p-2 shadow-xs">
                  <CryptoQRCode address={w.address} asset={w.asset || "BTC"} />
                </div>
                <span className="mt-2 font-mono text-[10px] text-slate-400">
                  Live In-App QR Render
                </span>
              </div>

              <div className="mb-6 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Current Receiving Address
                </label>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs font-bold break-all text-white select-all">
                  {w.address}
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleOpenEdit(w)}
              leftIcon={<Edit2 className="h-4 w-4" />}
              className="w-full justify-center border-slate-700 bg-slate-800 font-bold text-slate-200 hover:bg-slate-700"
            >
              Update Address
            </Button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingWallet && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Receiving Address (${editingWallet.symbol})`}
          description="Update cryptocurrency receiving address and blockchain network parameter."
          maxWidth="md"
        >
          <form onSubmit={handleSaveWallet} className="space-y-4">
            <Input
              label="Asset Label / Name"
              value={editingWallet.name}
              onChange={(e) =>
                setEditingWallet({ ...editingWallet, name: e.target.value })
              }
              required
            />

            <Input
              label="Blockchain Network"
              value={editingWallet.network}
              onChange={(e) =>
                setEditingWallet({ ...editingWallet, network: e.target.value })
              }
              helperText="e.g. ERC-20, TRC-20, Native SegWit"
              required
            />

            <Input
              label="Destination Wallet Address"
              value={editingWallet.address}
              onChange={(e) =>
                setEditingWallet({ ...editingWallet, address: e.target.value })
              }
              helperText="Double-check the address carefully before saving."
              required
            />

            <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={editingWallet.isActive}
                onChange={(e) =>
                  setEditingWallet({
                    ...editingWallet,
                    isActive: e.target.checked,
                  })
                }
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>Enabled as Active Deposit Destination</span>
            </label>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="bg-teal-600 font-bold hover:bg-teal-700"
              >
                Save Receiving Address
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
