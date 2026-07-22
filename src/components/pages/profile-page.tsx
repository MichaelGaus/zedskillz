"use client";

import { useAppStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

/**
 * ProfilePage — full profile management page.
 *
 * Users can edit:
 * - Profile picture (upload or generate from seed)
 * - Full name
 * - Email (read-only)
 * - Bio
 * - Date of birth
 * - Gender
 * - Phone
 * - Location (city)
 * - Province (Zambian provinces dropdown)
 * - Education level
 * - School
 * - Interests (tag input)
 * - Skills (tag input)
 * - Languages (tag input)
 * - Social links
 *
 * Changes are saved to the Zustand store and persist for the session.
 */
export function ProfilePage() {
  const { user, updateProfile, signOut, setActivePage } = useAppStore();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!user) {
      setActivePage("auth");
    }
  }, [user, setActivePage]);

  if (!user) return null;

  return <ProfileContent user={user} updateProfile={updateProfile} signOut={signOut} setActivePage={setActivePage} />;
}

function ProfileContent({ user, updateProfile, signOut, setActivePage }: {
  user: NonNullable<ReturnType<typeof useAppStore.getState>["user"]>;
  updateProfile: (updates: Partial<typeof user>) => void;
  signOut: () => void;
  setActivePage: (page: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [avatarSeed, setAvatarSeed] = useState(user.email);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form when user changes externally
  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Profile updated successfully! 🎉");
  };

  const handleCancel = () => {
    setForm(user);
    setEditing(false);
    toast.info("Changes discarded");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setForm({ ...form, avatar: dataUrl });
      toast.success("Profile picture updated");
    };
    reader.readAsDataURL(file);
  };

  const regenerateAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
    setForm({
      ...form,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newSeed)}&backgroundColor=ffdad8,f5dddd,e5dedf`,
    });
    toast.success("New avatar generated");
  };

  // Tag inputs (interests, skills, languages)
  const addTag = (field: "interests" | "skills" | "languages", value: string) => {
    if (!value.trim()) return;
    if (form[field].includes(value.trim())) return;
    setForm({ ...form, [field]: [...form[field], value.trim()] });
  };

  const removeTag = (field: "interests" | "skills" | "languages", value: string) => {
    setForm({ ...form, [field]: form[field].filter((v) => v !== value) });
  };

  const provinces = [
    "Lusaka Province", "Copperbelt Province", "Central Province", "Eastern Province",
    "Northern Province", "Luapula Province", "North-Western Province", "Southern Province",
    "Western Province", "Muchinga Province",
  ];

  const educationLevels = [
    "Primary School", "Junior Secondary", "Senior Secondary (Grade 12)",
    "Certificate", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other",
  ];

  const genders = ["Male", "Female", "Prefer not to say"];

  return (
    <div className="min-h-screen bg-background">
      {/* ===== TopAppBar ===== */}
      <div className="bg-surface border-b border-outline-variant sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage("landing")}
              className="p-2 hover:bg-surface-container rounded-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: '"FILL" 1' }}>school</span>
              </div>
              <span className="font-display text-lg font-bold text-primary hidden sm:block">Zedskillz Hub</span>
            </div>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary hidden md:block">My Profile</h1>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* ===== Main content ===== */}
          <div className="space-y-6">
            {/* Profile header card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
              {/* Cover banner */}
              <div className="h-32 bg-gradient-to-r from-primary via-primary-container to-tertiary-container relative">
                <button
                  onClick={() => toast.info("Cover photo upload coming soon!")}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-black/30 backdrop-blur text-white text-xs font-medium rounded-lg hover:bg-black/40 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  Change Cover
                </button>
              </div>
              {/* Avatar + name */}
              <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative">
                  <img
                    src={form.avatar}
                    alt={form.name}
                    className="w-28 h-28 rounded-full ring-4 ring-surface-container-lowest object-cover bg-surface-container"
                  />
                  {editing && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:bg-primary-container transition-colors"
                        title="Upload photo"
                      >
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      </button>
                      <button
                        onClick={regenerateAvatar}
                        className="absolute top-1 right-1 w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center shadow-md hover:bg-surface-container transition-colors"
                        title="Generate random avatar"
                      >
                        <span className="material-symbols-outlined text-[16px]">refresh</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                <div className="flex-1 pb-2">
                  {editing ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="font-display-lg text-display-lg-mobile text-primary bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none w-full"
                      placeholder="Your name"
                    />
                  ) : (
                    <h2 className="font-display-lg text-display-lg-mobile text-primary">{form.name}</h2>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">mail</span>
                    <span className="text-sm text-on-surface-variant">{form.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <Section title="Personal Information" icon="person">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" icon="badge">
                  {editing ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="John Doe"
                    />
                  ) : (
                    <p className="text-sm text-on-surface">{form.name || "Not set"}</p>
                  )}
                </Field>

                <Field label="Email Address" icon="mail">
                  <p className="text-sm text-on-surface-variant">{form.email}</p>
                  <p className="text-[10px] text-on-surface-variant/70 mt-1">Email cannot be changed</p>
                </Field>

                <Field label="Date of Birth" icon="cake">
                  {editing ? (
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  ) : (
                    <p className="text-sm text-on-surface">
                      {form.dateOfBirth
                        ? new Date(form.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                        : "Not set"}
                    </p>
                  )}
                </Field>

                <Field label="Gender" icon="wc">
                  {editing ? (
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    >
                      <option value="">Select gender</option>
                      {genders.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-on-surface">{form.gender || "Not set"}</p>
                  )}
                </Field>

                <Field label="Phone Number" icon="call">
                  {editing ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="+260 97 123 4567"
                    />
                  ) : (
                    <p className="text-sm text-on-surface">{form.phone || "Not set"}</p>
                  )}
                </Field>
              </div>
            </Section>

            {/* Location & Education */}
            <Section title="Location & Education" icon="location_on">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="City / Town" icon="location_city">
                  {editing ? (
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="Lusaka"
                    />
                  ) : (
                    <p className="text-sm text-on-surface">{form.location || "Not set"}</p>
                  )}
                </Field>

                <Field label="Province" icon="map">
                  {editing ? (
                    <select
                      value={form.province}
                      onChange={(e) => setForm({ ...form, province: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    >
                      <option value="">Select province</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-on-surface">{form.province || "Not set"}</p>
                  )}
                </Field>

                <Field label="Education Level" icon="school">
                  {editing ? (
                    <select
                      value={form.education}
                      onChange={(e) => setForm({ ...form, education: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    >
                      <option value="">Select level</option>
                      {educationLevels.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-on-surface">{form.education || "Not set"}</p>
                  )}
                </Field>

                <Field label="School / Institution" icon="account_balance">
                  {editing ? (
                    <input
                      type="text"
                      value={form.school}
                      onChange={(e) => setForm({ ...form, school: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="University of Zambia"
                    />
                  ) : (
                    <p className="text-sm text-on-surface">{form.school || "Not set"}</p>
                  )}
                </Field>
              </div>
            </Section>

            {/* About / Bio */}
            <Section title="About Me" icon="info">
              <Field label="Bio" icon="description">
                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={4}
                    maxLength={300}
                    className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-sm text-on-surface leading-relaxed">
                    {form.bio || "No bio added yet. Click Edit Profile to add one."}
                  </p>
                )}
                {editing && (
                  <p className="text-[10px] text-on-surface-variant mt-1 text-right">
                    {form.bio.length}/300 characters
                  </p>
                )}
              </Field>
            </Section>

            {/* Interests, Skills, Languages */}
            <Section title="Interests & Skills" icon="interests">
              <div className="space-y-4">
                <TagInput
                  label="Interests"
                  icon="favorite"
                  tags={form.interests}
                  onAdd={(v) => addTag("interests", v)}
                  onRemove={(v) => removeTag("interests", v)}
                  editing={editing}
                  placeholder="e.g. AI, Reading, Football"
                  suggestions={["AI", "Robotics", "Agriculture", "Music", "Football", "Reading", "Coding", "Entrepreneurship"]}
                />
                <TagInput
                  label="Skills"
                  icon="bolt"
                  tags={form.skills}
                  onAdd={(v) => addTag("skills", v)}
                  onRemove={(v) => removeTag("skills", v)}
                  editing={editing}
                  placeholder="e.g. Python, Public Speaking"
                  suggestions={["Python", "JavaScript", "React", "Public Speaking", "Data Analysis", "Leadership", "Writing", "Design"]}
                />
                <TagInput
                  label="Languages"
                  icon="translate"
                  tags={form.languages}
                  onAdd={(v) => addTag("languages", v)}
                  onRemove={(v) => removeTag("languages", v)}
                  editing={editing}
                  placeholder="e.g. Bemba, Nyanja"
                  suggestions={["English", "Bemba", "Nyanja", "Tonga", "Lozi", "Kaonde", "Lunda", "Luvale", "French", "Portuguese"]}
                />
              </div>
            </Section>

            {/* Social Links */}
            <Section title="Social Links" icon="link">
              <div className="space-y-3">
                {[
                  { platform: "twitter", icon: "share", label: "Twitter / X" },
                  { platform: "github", icon: "code", label: "GitHub" },
                  { platform: "linkedin", icon: "work", label: "LinkedIn" },
                  { platform: "facebook", icon: "public", label: "Facebook" },
                ].map(({ platform, icon, label }) => {
                  const existing = form.socialLinks.find((s) => s.platform === platform);
                  return (
                    <div key={platform} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-on-surface-variant mb-0.5">{label}</div>
                        {editing ? (
                          <input
                            type="url"
                            value={existing?.url || ""}
                            onChange={(e) => {
                              const others = form.socialLinks.filter((s) => s.platform !== platform);
                              if (e.target.value) {
                                setForm({ ...form, socialLinks: [...others, { platform, url: e.target.value }] });
                              } else {
                                setForm({ ...form, socialLinks: others });
                              }
                            }}
                            className="w-full px-3 py-1.5 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            placeholder={`https://${platform}.com/yourusername`}
                          />
                        ) : (
                          <p className="text-sm text-on-surface">
                            {existing?.url || "Not connected"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Account Actions */}
            <Section title="Account" icon="manage_accounts">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    toast.info("Export data feature coming soon!");
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">download</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-on-surface">Download my data</div>
                    <div className="text-xs text-on-surface-variant">Export all your account data (GDPR)</div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
                </button>
                <button
                  onClick={() => {
                    signOut();
                    toast.success("Signed out successfully");
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-error/30 bg-error/5 hover:bg-error/10 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[20px] text-error">logout</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-error">Sign Out</div>
                    <div className="text-xs text-on-surface-variant">Sign out of your account</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
                      toast.error("Account deletion requested — contact support@zedskillz.com");
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-error/30 bg-error/5 hover:bg-error/10 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[20px] text-error">delete_forever</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-error">Delete Account</div>
                    <div className="text-xs text-on-surface-variant">Permanently delete your account</div>
                  </div>
                </button>
              </div>
            </Section>
          </div>

          {/* ===== Right sidebar ===== */}
          <aside className="space-y-4">
            {/* Profile completion */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5">
              <h3 className="font-title-sm text-title-sm text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">checklist</span>
                Profile Completion
              </h3>
              {(() => {
                const fields = ["name", "bio", "dateOfBirth", "gender", "phone", "location", "province", "education", "school"];
                const filled = fields.filter((f) => (form as any)[f]).length;
                const tagsFilled = (form.interests.length > 0 ? 1 : 0) + (form.skills.length > 0 ? 1 : 0) + (form.languages.length > 0 ? 1 : 0);
                const total = fields.length + 3;
                const complete = filled + tagsFilled;
                const pct = Math.round((complete / total) * 100);
                return (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-primary">{pct}%</span>
                      <span className="text-xs text-on-surface-variant">{complete}/{total} fields</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {pct < 100 && (
                      <p className="text-xs text-on-surface-variant mt-3">
                        Complete your profile to improve visibility and connect with more learners.
                      </p>
                    )}
                    {pct === 100 && (
                      <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Profile complete!
                      </p>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Quick stats */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5">
              <h3 className="font-title-sm text-title-sm text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">insights</span>
                Quick Stats
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Member Since", value: "July 2026", icon: "event" },
                  { label: "Courses Enrolled", value: "3", icon: "school" },
                  { label: "Courses Completed", value: "1", icon: "workspace_premium" },
                  { label: "Learning Streak", value: "8 days 🔥", icon: "local_fire_department" },
                  { label: "Total XP", value: "4,500", icon: "bolt" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{stat.icon}</span>
                      <span className="text-sm text-on-surface-variant">{stat.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-on-surface">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy tip */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[24px] text-primary">shield</span>
                <div>
                  <h4 className="font-title-sm text-title-sm text-primary mb-1">Your Privacy</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Your personal information is private and only visible to you. Your name and bio
                    are visible to other community members.
                  </p>
                  <button
                    onClick={() => toast.info("Privacy settings coming soon!")}
                    className="mt-2 text-xs text-primary font-semibold hover:underline"
                  >
                    Manage privacy settings →
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ===== Helper components =====

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6">
      <h3 className="font-title-sm text-title-sm text-on-surface mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function TagInput({
  label,
  icon,
  tags,
  onAdd,
  onRemove,
  editing,
  placeholder,
  suggestions,
}: {
  label: string;
  icon: string;
  tags: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  editing: boolean;
  placeholder: string;
  suggestions: string[];
}) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input);
      setInput("");
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1.5">
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary-container text-on-secondary-container text-xs rounded-full font-medium"
          >
            {tag}
            {editing && (
              <button
                onClick={() => onRemove(tag)}
                className="hover:text-primary"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </span>
        ))}
        {tags.length === 0 && !editing && (
          <span className="text-sm text-on-surface-variant/70 italic">None added yet</span>
        )}
      </div>
      {editing && (
        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={() => setShowSuggestions(true)}
              className="flex-1 px-3 py-1.5 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder={placeholder}
            />
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors"
            >
              Add
            </button>
          </div>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {filteredSuggestions.slice(0, 6).map((s) => (
                <button
                  key={s}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onAdd(s);
                    setInput("");
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-surface-container transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
