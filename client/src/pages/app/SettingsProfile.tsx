import { useState } from 'react';
import {
  User, Bell, Lock, CreditCard, Palette, Globe, Key, Shield,
  Mail, Smartphone, Monitor, Moon, Sun, Zap, Upload, Save,
  AlertCircle, CheckCircle2, Copy, Eye, EyeOff, Trash2, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export const SettingsProfile = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    mentions: true,
    comments: true,
    projectUpdates: false,
  });

  const apiKeys = [
    { id: '1', name: 'Production API', key: 'sk_prod_1234...5678', created: 'Jan 15, 2024', lastUsed: '2 hours ago' },
    { id: '2', name: 'Development API', key: 'sk_dev_abcd...efgh', created: 'Feb 20, 2024', lastUsed: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-[1200px] px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2.5 shadow-sm">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-6 bg-white border border-gray-200">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 ring-4 ring-gray-100">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-900">Profile Photo</Label>
                    <p className="text-xs text-gray-600 mt-1 mb-3">JPG, PNG or GIF. Max size 5MB.</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                        <Upload className="h-4 w-4" />
                        Upload New
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" className="mt-1.5" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" className="mt-1.5" />
                  <p className="text-xs text-gray-600 mt-1.5">This is your primary email for notifications</p>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    defaultValue="Full-stack developer passionate about creating beautiful user experiences"
                    className="mt-1.5 min-h-[100px]"
                  />
                  <p className="text-xs text-gray-600 mt-1.5">Brief description for your profile</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="Acme Inc." className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" className="mt-1.5" />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="hover:bg-gray-50">
                    Cancel
                  </Button>
                  <Button className="bg-gray-900 hover:bg-gray-800 gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: 'mentions', label: 'Mentions', description: 'Get notified when someone mentions you', icon: Mail },
                  { id: 'comments', label: 'Comments', description: 'Get notified about new comments on your projects', icon: Bell },
                  { id: 'projectUpdates', label: 'Project Updates', description: 'Get notified about project changes', icon: AlertCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-gray-100 p-2.5">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-gray-600 mt-0.5">{item.description}</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.id as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage push notifications on your devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <Monitor className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Desktop Notifications</div>
                      <div className="text-sm text-gray-600">Chrome on Windows</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Mobile Notifications</div>
                      <div className="text-sm text-gray-600">Not connected</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-gray-50">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className="mt-1.5" />
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-white p-2.5 border border-gray-200">
                      <Shield className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Currently disabled</div>
                    </div>
                  </div>
                  <Button className="bg-gray-900 hover:bg-gray-800">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">Danger Zone</CardTitle>
                <CardDescription className="text-red-700">Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-white">
                  <div>
                    <div className="font-medium text-gray-900">Delete Account</div>
                    <div className="text-sm text-gray-600">Permanently delete your account and all data</div>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage your API keys for programmatic access</CardDescription>
                  </div>
                  <Button className="bg-gray-900 hover:bg-gray-800 gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-medium text-gray-900">{key.name}</div>
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-mono text-gray-600">
                          <code className="bg-gray-100 px-2 py-1 rounded">{key.key}</code>
                          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100">
                            {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Created {key.created} • Last used {key.lastUsed}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Keep your API keys secure</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Never share your API keys publicly. If you believe a key has been compromised, delete it immediately and create a new one.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your preferred color scheme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright' },
                    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
                    { value: 'system', label: 'System', icon: Monitor, description: 'Match system' },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          theme === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`h-8 w-8 mb-3 ${theme === option.value ? 'text-blue-600' : 'text-gray-600'}`} />
                        <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Customize language and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select id="language" className="w-full mt-1.5 h-9 rounded-md border border-gray-200 px-3 text-sm">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select id="timezone" className="w-full mt-1.5 h-9 rounded-md border border-gray-200 px-3 text-sm">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 rounded-lg border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-blue-600 text-white text-sm px-3 py-1 gap-1.5">
                        <Zap className="h-4 w-4" />
                        Pro Plan
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$29<span className="text-lg text-gray-600">/month</span></div>
                    <div className="text-sm text-gray-600">Billed monthly • Next billing on Feb 15, 2024</div>
                  </div>
                  <Button variant="outline" className="hover:bg-white">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gray-100 p-3">
                      <CreditCard className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Visa ending in 4242</div>
                      <div className="text-sm text-gray-600">Expires 12/2025</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-gray-50">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>Download your past invoices</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {[
                      { date: 'Jan 15, 2024', amount: '$29.00', status: 'Paid' },
                      { date: 'Dec 15, 2023', amount: '$29.00', status: 'Paid' },
                      { date: 'Nov 15, 2023', amount: '$29.00', status: 'Paid' },
                      { date: 'Oct 15, 2023', amount: '$29.00', status: 'Paid' },
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div>
                          <div className="font-medium text-gray-900">{invoice.date}</div>
                          <div className="text-sm text-gray-600">{invoice.amount}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {invoice.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
