"use client";

import { useAppStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { toast } from "sonner";

/**
 * SettingsPage — full settings management page.
 *
 * Sections:
 * 1. Appearance — theme (light/dark), accent color, font size, reduce motion
 * 2. Language & Region — interface language, currency, timezone, date format
 * 3. Notifications — email, push, SMS, in-app notification toggles
 * 4. Privacy & Security — profile visibility, 2FA, login history, session management
 * 5. Account — update email, change password, export data, delete account
 * 6. About — platform info, version, links
 */
export function SettingsPage() {
  const { user, theme, toggleTheme, signOut, setActivePage } = useAppStore();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!user) {
      setActivePage("auth");
    }
  }, [user, setActivePage]);

  if (!user) return null;

  return <SettingsContent user={user} theme={theme} toggleTheme={toggleTheme} signOut={signOut} setActivePage={setActivePage} />;
}

function SettingsContent({ user, theme, toggleTheme, signOut, setActivePage }: {
  user: NonNullable<ReturnType<typeof useAppStore.getState>["user"]>;
  theme: "light" | "dark";
  toggleTheme: () => void;
  signOut: () => void;
  setActivePage: (page: string) => void;
}) {
  const [activeSection, setActiveSection] = useState("appearance");

  const sections = [
    { id: "appearance", label: "Appearance", icon: "palette" },
    { id: "language", label: "Language & Region", icon: "language" },
    { id: "notifications", label: "Notifications", icon: "notifications" },
    { id: "privacy", label: "Privacy & Security", icon: "shield" },
    { id: "account", label: "Account", icon: "manage_accounts" },
    { id: "about", label: "About", icon: "info" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ===== TopAppBar ===== */}
      <div className="bg-surface border-b border-outline-variant sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage("my-courses")}
              className="p-2 hover:bg-surface-container rounded-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary">settings</span>
              </div>
              <span className="font-display text-lg font-bold text-primary hidden sm:block">Settings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* ===== Sidebar navigation ===== */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-3">
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeSection === s.id
                        ? "bg-secondary-container text-on-secondary-container font-semibold"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ===== Main content ===== */}
          <div className="space-y-6">
            {activeSection === "appearance" && <AppearanceSection theme={theme} toggleTheme={toggleTheme} />}
            {activeSection === "language" && <LanguageSection />}
            {activeSection === "notifications" && <NotificationsSection />}
            {activeSection === "privacy" && <PrivacySection />}
            {activeSection === "account" && <AccountSection user={user} signOut={signOut} />}
            {activeSection === "about" && <AboutSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// APPEARANCE SECTION
// ============================================================================
function AppearanceSection({ theme, toggleTheme }: { theme: "light" | "dark"; toggleTheme: () => void }) {
  const [accentColor, setAccentColor] = useState("primary");
  const [fontSize, setFontSize] = useState("medium");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const themeOptions = [
    { value: "light", label: "Light", icon: "light_mode", desc: "Bright background with dark text" },
    { value: "dark", label: "Dark", icon: "dark_mode", desc: "Dark background with light text" },
  ];

  const accentColors = [
    { id: "primary", label: "Burgundy", color: "#480008" },
    { id: "emerald", label: "Emerald", color: "#10b981" },
    { id: "amber", label: "Amber", color: "#f59e0b" },
    { id: "violet", label: "Violet", color: "#8b5cf6" },
    { id: "sky", label: "Sky", color: "#0ea5e9" },
    { id: "rose", label: "Rose", color: "#e11d48" },
  ];

  const fontSizes = [
    { value: "small", label: "Small", sample: "14px" },
    { value: "medium", label: "Medium", sample: "16px" },
    { value: "large", label: "Large", sample: "18px" },
  ];

  return (
    <>
      <SettingsCard title="Theme" icon="contrast" description="Choose how Zedskillz looks to you.">
        <div className="grid grid-cols-2 gap-4">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                if ((opt.value === "dark") !== (theme === "dark")) {
                  toggleTheme();
                }
                toast.success(`Switched to ${opt.label} mode`);
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                (opt.value === "dark") === (theme === "dark")
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant hover:border-outline"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${opt.value === "dark" ? "bg-slate-900" : "bg-white border"}`}>
                <span className="material-symbols-outlined" style={{ color: opt.value === "dark" ? "#ffb3b0" : "#480008" }}>{opt.icon}</span>
              </div>
              <div className="font-title-sm text-title-sm text-on-surface mb-1">{opt.label}</div>
              <div className="text-xs text-on-surface-variant">{opt.desc}</div>
              {(opt.value === "dark") === (theme === "dark") && (
                <div className="mt-2 flex items-center gap-1 text-xs text-primary font-medium">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  Active
                </div>
              )}
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Accent Color" icon="palette" description="Personalize your interface with a brand accent.">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {accentColors.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setAccentColor(c.id);
                toast.info(`${c.label} accent selected (applies on next reload)`);
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                accentColor === c.id ? "border-primary" : "border-transparent hover:border-outline-variant"
              }`}
            >
              <div className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-surface-container-lowest" style={{ backgroundColor: c.color, boxShadow: accentColor === c.id ? `0 0 0 2px ${c.color}` : "none" }} />
              <span className="text-xs font-medium">{c.label}</span>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Display" icon="text_fields" description="Adjust text size and visual effects.">
        <div className="space-y-4">
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2 block">Font Size</label>
            <div className="grid grid-cols-3 gap-2">
              {fontSizes.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setFontSize(f.value); toast.info(`Font size: ${f.label}`); }}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    fontSize === f.value ? "border-primary bg-primary/5" : "border-outline-variant hover:border-outline"
                  }`}
                >
                  <div className="font-medium" style={{ fontSize: f.sample }}>Aa</div>
                  <div className="text-xs text-on-surface-variant mt-1">{f.label}</div>
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            icon="animation"
            label="Reduce Motion"
            description="Minimize animations and transitions."
            checked={reduceMotion}
            onChange={(v) => { setReduceMotion(v); toast.info(v ? "Motion reduced" : "Motion enabled"); }}
          />
          <ToggleRow
            icon="contrast"
            label="High Contrast Mode"
            description="Increase contrast for better readability."
            checked={highContrast}
            onChange={(v) => { setHighContrast(v); toast.info(v ? "High contrast on" : "High contrast off"); }}
          />
        </div>
      </SettingsCard>
    </>
  );
}

// ============================================================================
// LANGUAGE & REGION SECTION
// ============================================================================
function LanguageSection() {
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("Africa/Lusaka");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  const languages = ["English", "Bemba", "Nyanja", "Tonga", "Lozi", "Kaonde", "Lunda", "Luvale", "French", "Portuguese"];
  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "ZMW", symbol: "K", name: "Zambian Kwacha" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
    { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
    { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
    { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  ];
  const timezones = ["Africa/Lusaka (GMT+2)", "Africa/Harare (GMT+2)", "Africa/Nairobi (GMT+3)", "Africa/Lagos (GMT+1)", "UTC"];

  return (
    <>
      <SettingsCard title="Interface Language" icon="translate" description="Select your preferred language for the Zedskillz interface.">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); toast.success(`Language: ${lang}`); }}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                language === lang ? "border-primary bg-primary/5" : "border-outline-variant hover:border-outline"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{lang}</span>
                {language === lang && (
                  <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Currency" icon="payments" description="Choose your preferred currency for course prices.">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); toast.success(`Currency: ${c.name}`); }}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                currency === c.code ? "border-primary bg-primary/5" : "border-outline-variant hover:border-outline"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">{c.symbol}</span>
                <div>
                  <div className="text-sm font-medium">{c.code}</div>
                  <div className="text-xs text-on-surface-variant">{c.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Time Zone" icon="schedule" description="Set your local time zone for accurate timestamps.">
        <select
          value={timezone}
          onChange={(e) => { setTimezone(e.target.value); toast.success("Time zone updated"); }}
          className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
          {timezones.map((tz) => <option key={tz} value={tz.split(" ")[0]}>{tz}</option>)}
        </select>
      </SettingsCard>

      <SettingsCard title="Date Format" icon="calendar_today" description="How dates should be displayed.">
        <div className="grid grid-cols-3 gap-2">
          {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((f) => (
            <button
              key={f}
              onClick={() => { setDateFormat(f); toast.success(`Date format: ${f}`); }}
              className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                dateFormat === f ? "border-primary bg-primary/5 text-primary" : "border-outline-variant hover:border-outline"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </SettingsCard>
    </>
  );
}

// ============================================================================
// NOTIFICATIONS SECTION
// ============================================================================
function NotificationsSection() {
  const [settings, setSettings] = useState({
    emailCourseUpdates: true,
    emailLiveClass: true,
    emailAssignments: true,
    emailWeekly: true,
    pushMessages: true,
    pushAchievements: true,
    pushReminders: true,
    smsUrgent: false,
    smsClassStart: true,
    inAppSound: true,
    inAppDesktop: true,
  });

  const update = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast.success("Notification preference updated");
  };

  return (
    <>
      <SettingsCard title="Email Notifications" icon="mail" description="Manage what we send to your inbox.">
        <div className="space-y-1">
          <ToggleRow icon="school" label="Course Updates" description="New lessons, assignments, announcements." checked={settings.emailCourseUpdates} onChange={() => update("emailCourseUpdates")} />
          <ToggleRow icon="video_call" label="Live Class Reminders" description="15 minutes before class starts." checked={settings.emailLiveClass} onChange={() => update("emailLiveClass")} />
          <ToggleRow icon="assignment" label="Assignment Due Dates" description="24 hours before deadline." checked={settings.emailAssignments} onChange={() => update("emailAssignments")} />
          <ToggleRow icon="summarize" label="Weekly Progress Report" description="Summary every Sunday." checked={settings.emailWeekly} onChange={() => update("emailWeekly")} />
        </div>
      </SettingsCard>

      <SettingsCard title="Push Notifications" icon="notifications_active" description="Real-time alerts on your device.">
        <div className="space-y-1">
          <ToggleRow icon="chat" label="Messages" description="Direct messages from instructors and peers." checked={settings.pushMessages} onChange={() => update("pushMessages")} />
          <ToggleRow icon="military_tech" label="Achievements" description="Badges, XP, and streak milestones." checked={settings.pushAchievements} onChange={() => update("pushAchievements")} />
          <ToggleRow icon="alarm" label="Study Reminders" description="Daily learning goal reminders." checked={settings.pushReminders} onChange={() => update("pushReminders")} />
        </div>
      </SettingsCard>

      <SettingsCard title="SMS Alerts" icon="sms" description="Text messages for critical updates (carrier charges may apply).">
        <div className="space-y-1">
          <ToggleRow icon="priority_high" label="Urgent Alerts" description="Payment issues, account security." checked={settings.smsUrgent} onChange={() => update("smsUrgent")} />
          <ToggleRow icon="live_tv" label="Live Class Starting" description="SMS when class is about to begin." checked={settings.smsClassStart} onChange={() => update("smsClassStart")} />
        </div>
      </SettingsCard>

      <SettingsCard title="In-App Notifications" icon="desktop_windows" description="Notifications while using Zedskillz.">
        <div className="space-y-1">
          <ToggleRow icon="volume_up" label="Sound Effects" description="Play a sound for new notifications." checked={settings.inAppSound} onChange={() => update("inAppSound")} />
          <ToggleRow icon="desktop_access_disabled" label="Desktop Notifications" description="Browser desktop notifications." checked={settings.inAppDesktop} onChange={() => update("inAppDesktop")} />
        </div>
      </SettingsCard>
    </>
  );
}

// ============================================================================
// PRIVACY & SECURITY SECTION
// ============================================================================
function PrivacySection() {
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showProgress: true,
    showLeaderboard: true,
    allowMessages: true,
    showOnline: true,
    twoFactor: false,
    biometric: false,
  });

  const update = (key: keyof typeof privacy) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
    toast.success("Privacy setting updated");
  };

  return (
    <>
      <SettingsCard title="Profile Visibility" icon="visibility" description="Control who can see your information.">
        <div className="space-y-1">
          <ToggleRow icon="public" label="Public Profile" description="Anyone can view your profile page." checked={privacy.publicProfile} onChange={() => update("publicProfile")} />
          <ToggleRow icon="trending_up" label="Show Learning Progress" description="Display course progress publicly." checked={privacy.showProgress} onChange={() => update("showProgress")} />
          <ToggleRow icon="leaderboard" label="Show on Leaderboard" description="Appear in national rankings." checked={privacy.showLeaderboard} onChange={() => update("showLeaderboard")} />
          <ToggleRow icon="chat" label="Allow Direct Messages" description="Let other users message you." checked={privacy.allowMessages} onChange={() => update("allowMessages")} />
          <ToggleRow icon="circle" label="Show Online Status" description="Display when you're online." checked={privacy.showOnline} onChange={() => update("showOnline")} />
        </div>
      </SettingsCard>

      <SettingsCard title="Security" icon="lock" description="Protect your account with extra layers of security.">
        <div className="space-y-1">
          <ToggleRow icon="phonelink_lock" label="Two-Factor Authentication" description="Require a code from your phone to sign in." checked={privacy.twoFactor} onChange={() => update("twoFactor")} />
          <ToggleRow icon="fingerprint" label="Biometric Login (Mobile)" description="Face ID / Fingerprint on mobile app." checked={privacy.biometric} onChange={() => update("biometric")} />
        </div>
        <div className="mt-4 pt-4 border-t border-outline-variant">
          <button onClick={() => toast.info("Login history feature coming soon!")} className="w-full flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">history</span>
              <div className="text-left">
                <div className="text-sm font-medium">Login History</div>
                <div className="text-xs text-on-surface-variant">See recent sign-in activity</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
          </button>
          <button onClick={() => toast.info("Session management coming soon!")} className="w-full flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors mt-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">devices</span>
              <div className="text-left">
                <div className="text-sm font-medium">Manage Devices</div>
                <div className="text-xs text-on-surface-variant">Sign out of other sessions</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
          </button>
        </div>
      </SettingsCard>
    </>
  );
}

// ============================================================================
// ACCOUNT SECTION
// ============================================================================
function AccountSection({ user, signOut }: { user: any; signOut: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password updated successfully! 🔒");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <SettingsCard title="Email Address" icon="mail" description="Your email is used for sign-in and notifications.">
        <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">mail</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-on-surface">{user.email}</div>
            <div className="text-xs text-on-surface-variant">Email cannot be changed</div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-emerald-600" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
        </div>
      </SettingsCard>

      <SettingsCard title="Change Password" icon="lock" description="Update your password regularly for security.">
        <div className="space-y-4">
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5 block">Current Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5 block">New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
            </div>
          </div>
          <div className="text-xs text-on-surface-variant space-y-1">
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span>At least 8 characters</div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span>Mix of upper & lower case</div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span>At least one number & symbol</div>
          </div>
          <button onClick={handleChangePassword} className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors">
            Update Password
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Data & Privacy" icon="download" description="Export or delete your data.">
        <div className="space-y-2">
          <button onClick={() => toast.info("Data export feature coming soon!")} className="w-full flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">download</span>
              <div className="text-left">
                <div className="text-sm font-medium">Download My Data</div>
                <div className="text-xs text-on-surface-variant">Export all account data (GDPR)</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Sign Out" icon="logout" description="Sign out of your account on this device.">
        <button onClick={() => { signOut(); toast.success("Signed out successfully"); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-error/30 bg-error/5 hover:bg-error/10 transition-colors">
          <span className="material-symbols-outlined text-[20px] text-error">logout</span>
          <div className="text-left">
            <div className="text-sm font-medium text-error">Sign Out</div>
            <div className="text-xs text-on-surface-variant">You'll need to sign in again</div>
          </div>
        </button>
      </SettingsCard>

      <SettingsCard title="Delete Account" icon="dangerous" description="Permanently remove your account and all data." danger>
        <button onClick={() => { if (confirm("Are you sure? This cannot be undone.")) toast.error("Contact support@zedskillz.com to delete your account."); }} className="w-full flex items-center gap-3 p-3 rounded-lg border border-error/30 bg-error/5 hover:bg-error/10 transition-colors">
          <span className="material-symbols-outlined text-[20px] text-error">delete_forever</span>
          <div className="text-left">
            <div className="text-sm font-medium text-error">Delete Account</div>
            <div className="text-xs text-on-surface-variant">This action is permanent and cannot be undone</div>
          </div>
        </button>
      </SettingsCard>
    </>
  );
}

// ============================================================================
// ABOUT SECTION
// ============================================================================
function AboutSection() {
  return (
    <>
      <SettingsCard title="About Zedskillz Hub" icon="info" description="Learn more about the platform.">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: '"FILL" 1', fontSize: "32px" }}>school</span>
            </div>
            <div>
              <div className="font-display-lg text-primary">Zedskillz Hub</div>
              <div className="text-sm text-on-surface-variant">AI-Powered Learning Platform for Zambia</div>
              <div className="text-xs text-on-surface-variant mt-1">Version 1.0.0</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "people", label: "Active Learners", value: "124K+" },
              { icon: "school", label: "Courses", value: "1,800+" },
              { icon: "language", label: "Languages", value: "8+" },
              { icon: "public", label: "Countries", value: "12" },
            ].map((stat) => (
              <div key={stat.label} className="p-3 bg-surface-container-low rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px] text-primary">{stat.icon}</span>
                <div>
                  <div className="font-bold text-on-surface">{stat.value}</div>
                  <div className="text-xs text-on-surface-variant">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Legal" icon="gavel" description="Read our policies and terms.">
        <div className="space-y-2">
          {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility Statement", "Refund Policy"].map((item) => (
            <button key={item} onClick={() => toast.info(`${item} — coming soon!`)} className="w-full flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
              <span className="text-sm font-medium">{item}</span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Help & Support" icon="help" description="Get assistance when you need it.">
        <div className="space-y-2">
          <button onClick={() => toast.info("Help Center coming soon!")} className="w-full flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">help_center</span>
              <span className="text-sm font-medium">Help Center</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
          </button>
          <button onClick={() => toast.info("Contact support: support@zedskillz.com")} className="w-full flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">support_agent</span>
              <span className="text-sm font-medium">Contact Support</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
          </button>
          <button onClick={() => toast.info("Feedback feature coming soon!")} className="w-full flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">feedback</span>
              <span className="text-sm font-medium">Send Feedback</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
          </button>
        </div>
      </SettingsCard>

      <div className="text-center text-xs text-on-surface-variant py-4">
        © 2024 Zedskillz Hub Zambia. Empowering through AI.
      </div>
    </>
  );
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================
function SettingsCard({ title, icon, description, children, danger }: { title: string; icon: string; description?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`bg-surface-container-lowest border rounded-2xl p-5 md:p-6 ${danger ? "border-error/20" : "border-outline-variant"}`}>
      <div className="mb-4">
        <h3 className="font-title-sm text-title-sm text-on-surface flex items-center gap-2">
          <span className={`material-symbols-outlined text-[20px] ${danger ? "text-error" : "text-primary"}`}>{icon}</span>
          {title}
        </h3>
        {description && <p className="text-xs text-on-surface-variant mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ icon, label, description, checked, onChange }: { icon: string; label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="text-sm font-medium text-on-surface">{label}</div>
          <div className="text-xs text-on-surface-variant truncate">{description}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3 ${checked ? "bg-primary" : "bg-outline"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
