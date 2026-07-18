"use client";

import { useAppStore } from "@/lib/store";
import {
  User,
  Bell,
  Globe,
  Shield,
  CreditCard,
  Palette,
  Moon,
  Sun,
  Smartphone,
  Lock,
  Mail,
  Trash2,
  Download,
  LogOut,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { theme, toggleTheme, currentUser } = useAppStore();

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Settings"
        description="Manage your account, preferences, and privacy"
        icon={User}
      />

      <Tabs defaultValue="account">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="language">Language & Region</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        {/* ACCOUNT */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Button size="sm">Change Photo</Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue={currentUser.name.split(" ")[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue={currentUser.name.split(" ")[1]} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" defaultValue={currentUser.email} className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="phone" type="tel" defaultValue={currentUser.phone} className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  rows={3}
                  defaultValue={currentUser.bio}
                  className="w-full px-3 py-2 text-sm bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" placeholder="••••••••" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input id="confirm" type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-500/30">
            <CardHeader>
              <CardTitle className="text-base text-rose-500">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
                <div>
                  <div className="font-medium text-sm">Export my data</div>
                  <div className="text-xs text-muted-foreground">Download all your data (GDPR)</div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
                <div>
                  <div className="font-medium text-sm">Delete account</div>
                  <div className="text-xs text-muted-foreground">Permanently delete your account</div>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              {[
                { title: "Course updates", desc: "New lessons, assignments, announcements", channels: { email: true, push: true, sms: false } },
                { title: "Live class reminders", desc: "15 minutes before class starts", channels: { email: true, push: true, sms: true } },
                { title: "Assignment due dates", desc: "24 hours before deadline", channels: { email: true, push: true, sms: false } },
                { title: "Payment receipts", desc: "When you make a purchase", channels: { email: true, push: false, sms: false } },
                { title: "Social activity", desc: "Likes, comments, mentions", channels: { email: false, push: true, sms: false } },
                { title: "Achievements", desc: "When you earn badges or XP", channels: { email: false, push: true, sms: false } },
                { title: "Weekly progress report", desc: "Summary every Sunday", channels: { email: true, push: false, sms: false } },
                { title: "Promotions & offers", desc: "Discounts and new courses", channels: { email: true, push: false, sms: false } },
              ].map((n, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.desc}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 text-xs">
                      <Mail className="w-3 h-3" />
                      <Switch defaultChecked={n.channels.email} />
                    </label>
                    <label className="flex items-center gap-1 text-xs">
                      <Bell className="w-3 h-3" />
                      <Switch defaultChecked={n.channels.push} />
                    </label>
                    <label className="flex items-center gap-1 text-xs">
                      <Smartphone className="w-3 h-3" />
                      <Switch defaultChecked={n.channels.sms} />
                    </label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Theme</CardTitle>
              <CardDescription>Customize how Zedskillz looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => theme !== "light" && toggleTheme()}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-colors",
                    theme === "light" ? "border-primary" : "border-border"
                  )}
                >
                  <div className="bg-white border rounded p-3 mb-2 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="w-12 h-2 bg-slate-900 rounded" />
                      <div className="w-8 h-2 bg-slate-400 rounded" />
                    </div>
                    <Sun className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="font-medium text-sm flex items-center justify-between">
                    Light
                    {theme === "light" && <Check className="w-4 h-4 text-primary" />}
                  </div>
                </button>
                <button
                  onClick={() => theme !== "dark" && toggleTheme()}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-colors",
                    theme === "dark" ? "border-primary" : "border-border"
                  )}
                >
                  <div className="bg-slate-900 border border-slate-700 rounded p-3 mb-2 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="w-12 h-2 bg-slate-100 rounded" />
                      <div className="w-8 h-2 bg-slate-500 rounded" />
                    </div>
                    <Moon className="w-5 h-5 text-sky-300" />
                  </div>
                  <div className="font-medium text-sm flex items-center justify-between">
                    Dark
                    {theme === "dark" && <Check className="w-4 h-4 text-primary" />}
                  </div>
                </button>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-sm font-medium">Accent color</Label>
                <div className="flex gap-2 mt-2">
                  {["bg-emerald-500", "bg-amber-500", "bg-violet-500", "bg-rose-500", "bg-sky-500", "bg-lime-500"].map((c, i) => (
                    <button
                      key={c}
                      className={cn(
                        "w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-background",
                        c,
                        i === 0 ? "ring-foreground" : "ring-transparent"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-sm font-medium">Font size</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["Small", "Medium", "Large"].map((s, i) => (
                    <button
                      key={s}
                      className={cn(
                        "p-2 text-sm rounded-lg border",
                        i === 1 ? "border-primary bg-primary/5" : "hover:bg-muted"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Label className="text-sm font-medium">Accessibility</Label>
                {["High contrast mode", "Reduce motion", "Screen reader optimizations"].map((a, i) => (
                  <label key={a} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                    <span className="text-sm">{a}</span>
                    <Switch />
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRIVACY */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Authenticator app</div>
                    <div className="text-xs text-muted-foreground">Use Google Authenticator or similar</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">SMS verification</div>
                    <div className="text-xs text-muted-foreground">Receive codes via SMS</div>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Biometric login (mobile)</div>
                    <div className="text-xs text-muted-foreground">Face ID / Fingerprint</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Privacy Settings</CardTitle>
              <CardDescription>Control who sees your information</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              {[
                { title: "Public profile", desc: "Anyone can view your profile" },
                { title: "Show learning progress", desc: "Display your course progress publicly" },
                { title: "Show on leaderboard", desc: "Appear in global rankings" },
                { title: "Allow direct messages", desc: "Let other users message you" },
                { title: "Show real name", desc: "Use real name instead of username" },
                { title: "Activity status", desc: "Show when you're online" },
              ].map((p, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                  <Switch defaultChecked={i < 4} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Login History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { device: "Chrome on Windows", location: "Lusaka, Zambia", ip: "102.141.24.50", time: "Active now", current: true },
                { device: "Safari on iPhone", location: "Lusaka, Zambia", ip: "102.141.24.51", time: "2 hours ago", current: false },
                { device: "Firefox on Linux", location: "Kitwe, Zambia", ip: "102.141.20.10", time: "Yesterday", current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">
                        {s.device}
                        {s.current && <Badge className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-600">Current</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{s.location} · {s.ip} · {s.time}</div>
                    </div>
                  </div>
                  {!s.current && <Button size="sm" variant="ghost">Revoke</Button>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYMENTS */}
        <TabsContent value="payments" className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Wallet Balance</div><div className="text-2xl font-bold mt-1">$45.20</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total Spent</div><div className="text-2xl font-bold mt-1">$399.97</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Active Subscriptions</div><div className="text-2xl font-bold mt-1">2</div></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Payment Methods</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: "Visa", last4: "4242", exp: "12/27", default: true },
                { type: "MTN Mobile Money", last4: "4567", exp: "", default: false },
                { type: "PayPal", last4: "banda@example.com", exp: "", default: false },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">
                        {m.type} {m.last4 && `•••• ${m.last4}`}
                        {m.default && <Badge className="ml-2 text-[10px]">Default</Badge>}
                      </div>
                      {m.exp && <div className="text-xs text-muted-foreground">Expires {m.exp}</div>}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">+ Add Payment Method</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Billing History</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { desc: "Python for Data Science", amount: 199.99, date: "Jul 15, 2026", invoice: "INV-2026-0156" },
                  { desc: "Pro Subscription (Monthly)", amount: 29.99, date: "Jul 1, 2026", invoice: "INV-2026-0142" },
                  { desc: "Web Dev Bootcamp", amount: 149.99, date: "Jan 20, 2026", invoice: "INV-2026-0042" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="text-sm font-medium">{p.desc}</div>
                      <div className="text-xs text-muted-foreground">{p.date} · {p.invoice}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-medium">${p.amount}</div>
                      <Button size="sm" variant="ghost"><Download className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LANGUAGE */}
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Language & Region</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Interface Language</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["English", "Bemba", "Nyanja", "Tonga", "Lozi", "French", "Portuguese", "Swahili", "Arabic"].map((l, i) => (
                    <button
                      key={l}
                      className={cn(
                        "p-3 text-sm rounded-lg border text-left",
                        i === 0 ? "border-primary bg-primary/5" : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{l}</span>
                        {i === 0 && <Check className="w-4 h-4 text-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { code: "USD", symbol: "$", name: "US Dollar" },
                    { code: "ZMW", symbol: "K", name: "Zambian Kwacha" },
                    { code: "ZAR", symbol: "R", name: "South African Rand" },
                    { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
                    { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
                    { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
                  ].map((c, i) => (
                    <button
                      key={c.code}
                      className={cn(
                        "p-3 text-sm rounded-lg border text-left",
                        i === 0 ? "border-primary bg-primary/5" : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{c.symbol} {c.code}</span>
                        {i === 0 && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{c.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Time Zone</Label>
                <select className="w-full p-2 bg-muted rounded-lg text-sm">
                  <option>Africa/Lusaka (GMT+2)</option>
                  <option>Africa/Harare (GMT+2)</option>
                  <option>Africa/Nairobi (GMT+3)</option>
                  <option>Africa/Lagos (GMT+1)</option>
                  <option>UTC</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Date Format</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"].map((f, i) => (
                    <button
                      key={f}
                      className={cn(
                        "p-2 text-sm rounded-lg border",
                        i === 1 ? "border-primary bg-primary/5" : "hover:bg-muted"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEVICES */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Connected Devices</CardTitle>
              <CardDescription>Manage devices logged into your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Chrome · Windows 11", location: "Lusaka, Zambia", lastSeen: "Active now", current: true },
                { name: "Safari · iPhone 15 Pro", location: "Lusaka, Zambia", lastSeen: "2 hours ago", current: false },
                { name: "Firefox · Ubuntu 22.04", location: "Kitwe, Zambia", lastSeen: "Yesterday at 4:15 PM", current: false },
                { name: "Zedskillz Android App", location: "Lusaka, Zambia", lastSeen: "3 days ago", current: false },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {d.name}
                        {d.current && <Badge className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-600">This device</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{d.location} · {d.lastSeen}</div>
                    </div>
                  </div>
                  {!d.current && <Button size="sm" variant="ghost" className="text-rose-500">Sign out</Button>}
                </div>
              ))}
              <Button variant="outline" className="w-full text-rose-500">
                <LogOut className="w-4 h-4 mr-1" />
                Sign out of all devices
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
