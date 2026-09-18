// app/admin/components/AdminSettings.tsx
"use client"
import React, { useState } from "react"
import {
  Settings,
  Save,
  ShieldAlert,
  Globe,
  CheckCircle2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"
import { User, PlatformSettings } from "@/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"
import {
  updateAdminSettings
} from "../controllers/settings.action"
import { changeAdminPassword } from "../controllers/security.action"

interface AdminSettingsProps {
  currentUser: User
  initialSettings?: PlatformSettings | null
}

const defaultSettings: PlatformSettings = {
  platformName: "CapitalsFargoFX",
  siteName: "CapitalsFargoFX",
  supportEmail: "",
  telegramChannel: "",
  companyAddress: "",
  activeInvestorsDisplay: "",
  statsActiveInvestors: "",
  totalDepositsDisplay: "",
  statsTotalDeposited: "",
  totalWithdrawalsDisplay: "",
  statsTotalWithdrawn: "",
  supportedAssetsDisplay: "",
  statsCountriesSupported: "",
  maintenanceMode: false,
  isMaintenanceMode: false,
  updatedAt: "",
}

const normalizeSettings = (
  value: PlatformSettings | null | undefined
): PlatformSettings => ({
  ...defaultSettings,
  ...value,
  platformName: value?.platformName ?? defaultSettings.platformName,
  siteName: value?.siteName ?? defaultSettings.siteName,
  supportEmail: value?.supportEmail ?? "",
  telegramChannel: value?.telegramChannel ?? "",
  companyAddress: value?.companyAddress ?? "",
  statsActiveInvestors: value?.statsActiveInvestors ?? "",
  statsTotalDeposited: value?.statsTotalDeposited ?? "",
  statsTotalWithdrawn: value?.statsTotalWithdrawn ?? "",
  statsCountriesSupported: value?.statsCountriesSupported ?? "",
  isMaintenanceMode: value?.isMaintenanceMode ?? value?.maintenanceMode ?? false,
  updatedAt: value?.updatedAt ?? "",
})

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  initialSettings = null,
}) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const [settings, setSettings] = useState<PlatformSettings>(() =>
    normalizeSettings(initialSettings)
  )
  const [isSaving, setIsSaving] = useState(false)
  const { success, info } = useToast()

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !settings.platformName?.trim() ||
      !settings.supportEmail.trim() ||
      !settings.telegramChannel.trim() ||
      !settings.companyAddress?.trim() ||
      !settings.statsActiveInvestors?.trim() ||
      !settings.statsTotalDeposited?.trim() ||
      !settings.statsTotalWithdrawn?.trim() ||
      !settings.statsCountriesSupported?.trim()
    ) {
      info("Validation Error", "Complete all platform settings fields before saving.")
      return
    }

    setIsSaving(true)
    try {
      const saved = await updateAdminSettings(
        settings as unknown as Record<string, unknown>
      )

      if (!saved.success || !saved.settings) {
        info("Settings Error", saved.message || "Unable to save settings.")
        return
      }

      setSettings(
        normalizeSettings(saved.settings as unknown as PlatformSettings)
      )
      success(
        "Settings Saved",
        "Platform parameters and public display metrics updated."
      )
    } catch (error) {
      info(
        "Settings Error",
        error instanceof Error ? error.message : "Unable to save settings."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      info("Validation Error", "All password fields are required.")
      return
    }

    if (newPassword !== confirmPassword) {
      info("Validation Error", "New passwords do not match.")
      return
    }

    if (newPassword.length < 8) {
      info("Validation Error", "Password must be at least 8 characters long.")
      return
    }

    setIsUpdatingPassword(true)

    try {
      await changeAdminPassword({
        currentPassword,
        newPassword,
      })

      success(
        "Password Updated",
        "Your administrator password has been changed successfully."
      )

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      info(
        "Password Update Failed",
        error instanceof Error ? error.message : "Unable to update password."
      )
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <Settings className="h-6 w-6 text-amber-400" />
            Platform & Governance Settings
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Global public metrics, institutional communication channels, and
            environment parameters.
          </p>
        </div>
      </div>

      {/* Security & Password Management */}
      <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <KeyRound className="h-5 w-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">
            Security & Password Management
          </h3>
        </div>

        <form
          onSubmit={handleUpdatePassword}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
          <Input
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrentPassword((visible) => !visible)}
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
                aria-pressed={showCurrentPassword}
                className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            required
          />

          <Input
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword((visible) => !visible)}
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
                aria-pressed={showNewPassword}
                className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            required
          />

          <Input
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirmed password"
                    : "Show confirmed password"
                }
                aria-pressed={showConfirmPassword}
                className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            required
          />

          <div className="flex justify-end lg:col-span-3">
            <Button
              type="submit"
              variant="outline"
              isLoading={isUpdatingPassword}
              leftIcon={<ShieldAlert className="h-4 w-4" />}
              className="border-rose-700 bg-rose-950 text-rose-300 hover:bg-rose-900"
            >
              Update Password
            </Button>
          </div>
        </form>

        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4">
          <p className="text-xs text-amber-300">
            For security reasons, administrator password changes require your
            current password. After updating, you may be asked to sign in
            again on other active sessions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Public Identity & Contacts */}
        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Globe className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              Public Brand & Investor Contact Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Platform Name"
              value={settings.platformName ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, platformName: e.target.value })
              }
              required
            />

            <Input
              label="Support Desk Email"
              value={settings.supportEmail ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Telegram VIP Broadcast Channel"
              value={settings.telegramChannel ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, telegramChannel: e.target.value })
              }
              required
            />

            <Input
              label="Institutional Address"
              value={settings.companyAddress ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, companyAddress: e.target.value })
              }
              required
            />
          </div>
        </div>



        {/* Public Landing Metrics Customizer */}
        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Landing Page Showcase Metrics
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Active Investors Display"
              value={settings.statsActiveInvestors ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  statsActiveInvestors: e.target.value,
                })
              }
              required
            />

            <Input
              label="Total Deposits Display"
              value={settings.statsTotalDeposited ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  statsTotalDeposited: e.target.value,
                })
              }
              required
            />

            <Input
              label="Total Paid Out Display"
              value={settings.statsTotalWithdrawn ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  statsTotalWithdrawn: e.target.value,
                })
              }
              required
            />

            <Input
              label="Countries Display"
              value={settings.statsCountriesSupported ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  statsCountriesSupported: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        {/* Operational Guardrails */}
        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Operational Modes
            </h3>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs font-bold text-slate-300">
              <input
                type="checkbox"
                checked={settings.isMaintenanceMode ?? false}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    isMaintenanceMode: e.target.checked,
                  })
                }
                className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
              />
              <span>Platform Maintenance Mode (Suspend New User Deposits)</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
            className="bg-amber-500 font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-600"
          >
            Save All Platform Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
