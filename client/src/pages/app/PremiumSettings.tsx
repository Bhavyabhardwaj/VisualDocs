import { useState } from 'react';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Building,
  Globe,
  Bell,
  Lock,
  CreditCard,
  Plug,
  Upload,
  Key,
  Shield,
  Trash2,
  LogOut,
  Check
} from 'lucide-react';

export const PremiumSettings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    projectAlerts: true,
    weeklyReports: false,
    securityAlerts: true,
  });

  // Debug: Log user data
  console.log('⚙️ PremiumSettings - Current user:', user);
  console.log('⚙️ PremiumSettings - Full user object:', JSON.stringify(user, null, 2));
  console.log('⚙️ PremiumSettings - User email:', user?.email);
  console.log('⚙️ PremiumSettings - User name:', user?.name);
  console.log('⚙️ PremiumSettings - User id:', user?.id);

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Split name into first and last name
  const [firstName, lastName] = (user?.name || '').split(' ');
  const userInitials = getInitials(user?.name || 'User');

  return (
    <PremiumLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto px-8 py-8">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Settings</h1>
            <p className="text-neutral-600 mt-2 text-[15px]">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="mx-auto px-8 py-8">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-neutral-100 p-1">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-white">
                <Building className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:bg-white">
                <Plug className="w-4 h-4 mr-2" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-white">
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription>Update your personal details and profile picture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="mb-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-neutral-600">
                        JPG, GIF or PNG. Max size of 800K
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        defaultValue={firstName || ''}
                        className="border-neutral-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        defaultValue={lastName || ''}
                        className="border-neutral-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      defaultValue={user?.email || ''}
                      className="border-neutral-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                      defaultValue=""
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Public Profile</CardTitle>
                  <CardDescription>Control what others can see about you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Show email address</p>
                      <p className="text-sm text-neutral-600">Allow others to see your email</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <Separator className="bg-neutral-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Show profile picture</p>
                      <p className="text-sm text-neutral-600">Display your avatar publicly</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="username"
                      defaultValue={user?.email?.split('@')[0] || ''}
                      className="border-neutral-200"
                    />
                    <p className="text-xs text-neutral-600">
                      Your unique identifier across the platform
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      className="w-full h-10 px-3 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="en"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      className="w-full h-10 px-3 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="utc"
                    >
                      <option value="utc">UTC (GMT+0)</option>
                      <option value="est">EST (GMT-5)</option>
                      <option value="pst">PST (GMT-8)</option>
                      <option value="cet">CET (GMT+1)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Security
                  </CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className="border-neutral-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="border-neutral-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="border-neutral-200"
                    />
                  </div>

                  <Button variant="outline" className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>

                  <Separator className="bg-neutral-200" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Two-factor authentication</p>
                      <p className="text-sm text-neutral-600">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Enable
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50/50 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg text-red-900">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-red-900">Delete Account</p>
                      <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                  <Separator className="bg-red-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-red-900">Sign Out Everywhere</p>
                      <p className="text-sm text-red-700">Sign out from all active sessions</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Email Notifications</CardTitle>
                  <CardDescription>Choose what updates you receive via email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Product Updates</p>
                      <p className="text-sm text-neutral-600">Get notified about new features and improvements</p>
                    </div>
                    <Switch
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailUpdates: checked })
                      }
                    />
                  </div>
                  <Separator className="bg-neutral-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Project Alerts</p>
                      <p className="text-sm text-neutral-600">Notifications about project analysis completion</p>
                    </div>
                    <Switch
                      checked={notifications.projectAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, projectAlerts: checked })
                      }
                    />
                  </div>
                  <Separator className="bg-neutral-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Weekly Reports</p>
                      <p className="text-sm text-neutral-600">Receive weekly summaries of your activity</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weeklyReports: checked })
                      }
                    />
                  </div>
                  <Separator className="bg-neutral-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Security Alerts</p>
                      <p className="text-sm text-neutral-600">Important security notifications</p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, securityAlerts: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Connected Services</CardTitle>
                  <CardDescription>Manage your third-party integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neutral-900 rounded flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-neutral-900">GitHub</p>
                        <p className="text-xs text-neutral-600">Connected • Last synced 2 hours ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-neutral-900">GitLab</p>
                        <p className="text-xs text-neutral-600">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Bitbucket</p>
                        <p className="text-xs text-neutral-600">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>Manage API access to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded">
                      <div>
                        <p className="font-mono text-sm text-neutral-900">vd_live_••••••••••••3a4f</p>
                        <p className="text-xs text-neutral-600">Created on Jan 15, 2025</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Revoke
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Key className="w-4 h-4 mr-2" />
                      Generate New API Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Current Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-neutral-900">Pro Plan</h3>
                        <p className="text-neutral-600 mt-1">Unlimited projects and team members</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-neutral-900">$49</p>
                        <p className="text-sm text-neutral-600">per month</p>
                      </div>
                    </div>
                    <Separator className="bg-blue-200 mb-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-neutral-700">Renews on February 15, 2025</span>
                      </div>
                      <Button variant="outline" size="sm">Manage Plan</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-neutral-900 mb-3">Plan Features</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-green-600" />
                        Unlimited projects
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-green-600" />
                        Unlimited team members
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-green-600" />
                        Advanced AI analysis
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-green-600" />
                        Priority support
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-green-600" />
                        Custom diagrams
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-green-600" />
                        API access
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                  <CardDescription>Manage your payment information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-neutral-900 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-neutral-900">•••• •••• •••• 4242</p>
                        <p className="text-xs text-neutral-600">Expires 12/2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Billing History</CardTitle>
                  <CardDescription>View your past invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded transition-colors">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">January 2025</p>
                        <p className="text-xs text-neutral-600">Paid on Jan 15, 2025</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">$49.00</span>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded transition-colors">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">December 2024</p>
                        <p className="text-xs text-neutral-600">Paid on Dec 15, 2024</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">$49.00</span>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PremiumLayout>
  );
};
