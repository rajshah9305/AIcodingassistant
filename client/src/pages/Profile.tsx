import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";
import { ArrowLeft, Save, Mail, User, Code, Bell, Lock, Palette } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    preferredLanguage: "javascript",
    theme: "light",
    notifications: true,
  });

  const handleSave = () => {
    // TODO: Implement save functionality with tRPC
    alert("Settings saved! (Feature coming soon)");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt={user?.name || "User"}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === "general"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                General
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === "preferences"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <Code className="h-4 w-4" />
                Preferences
              </button>
              <button
                onClick={() => setActiveTab("appearance")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === "appearance"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <Palette className="h-4 w-4" />
                Appearance
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === "notifications"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <Bell className="h-4 w-4" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === "security"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <Lock className="h-4 w-4" />
                Security
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* General Settings */}
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      placeholder="Your email"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <Card>
                <CardHeader>
                  <CardTitle>Development Preferences</CardTitle>
                  <CardDescription>Configure your coding preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <select
                      id="language"
                      value={formData.preferredLanguage}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredLanguage: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                      <option value="typescript">TypeScript</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">AI Analysis Features</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-foreground">Enable real-time code analysis</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-foreground">Show performance suggestions</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-foreground">Enable security scanning</span>
                      </label>
                    </div>
                  </div>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Appearance */}
            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Theme</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={formData.theme === "light"}
                          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        />
                        <span className="text-sm text-foreground">Light</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={formData.theme === "dark"}
                          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        />
                        <span className="text-sm text-foreground">Dark</span>
                      </label>
                    </div>
                  </div>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Appearance
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications}
                        onChange={(e) =>
                          setFormData({ ...formData, notifications: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span className="text-sm text-foreground">Enable notifications</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-foreground">Code analysis completed</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-foreground">Security issues found</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-foreground">Performance recommendations</span>
                    </label>
                  </div>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Notifications
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <h4 className="font-medium text-foreground mb-2">Active Sessions</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        You are currently logged in on this device.
                      </p>
                      <Button variant="outline" size="sm">
                        Logout All Devices
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border p-4 bg-card">
                      <h4 className="font-medium text-foreground mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an extra layer of security to your account.
                      </p>
                      <Button variant="outline" size="sm">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
