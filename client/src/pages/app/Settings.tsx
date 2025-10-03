import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { PageWrapper } from '@/components/app/PageWrapper';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Users,
  CreditCard,
  Save,
  Upload,
  Trash2
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'data', name: 'Data & Storage', icon: Database },
  ];

  return (
    <PageWrapper
      title="Settings"
      description="Manage your account settings and preferences"
      actions={
        hasChanges ? (
          <Button icon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        ) : null
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary hover:text-light-text dark:hover:text-dark-text'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'profile' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details and profile settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-primary-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                      JD
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" icon={<Upload className="w-4 h-4" />}>
                        Upload Photo
                      </Button>
                      <Button variant="ghost" size="sm" className="text-error-600 hover:bg-error-50">
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      defaultValue="John"
                      onChange={() => setHasChanges(true)}
                    />
                    <Input
                      label="Last Name"
                      defaultValue="Doe"
                      onChange={() => setHasChanges(true)}
                    />
                    <Input
                      label="Email"
                      type="email"
                      defaultValue="john@example.com"
                      onChange={() => setHasChanges(true)}
                    />
                    <Input
                      label="Username"
                      defaultValue="johndoe"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Bio
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border app-border rounded-md bg-white dark:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-theme"
                      rows={4}
                      placeholder="Tell us about yourself..."
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-error-200 dark:border-error-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-light-text dark:text-dark-text">
                        Delete Account
                      </h4>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Permanently delete your account and all data.
                      </p>
                    </div>
                    <Button variant="outline" className="text-error-600 border-error-300 hover:bg-error-50">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-4">
                    Theme
                  </label>
                  <div className="flex items-center space-x-4">
                    <ThemeToggle variant="full" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-4">
                    Sidebar Style
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border app-border rounded-lg cursor-pointer hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary">
                      <div className="mb-2 text-sm font-medium">Expanded</div>
                      <div className="h-12 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded"></div>
                    </div>
                    <div className="p-4 border app-border rounded-lg cursor-pointer hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary">
                      <div className="mb-2 text-sm font-medium">Collapsed</div>
                      <div className="h-12 w-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-4">
                    Font Size
                  </label>
                  <select className="px-3 py-2 border app-border rounded-md bg-white dark:bg-dark-bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="sm">Small</option>
                    <option value="md" selected>Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { id: 'analysis', label: 'Analysis Complete', description: 'When code analysis finishes' },
                  { id: 'diagrams', label: 'Diagram Generated', description: 'When AI generates new diagrams' },
                  { id: 'comments', label: 'New Comments', description: 'When someone comments on your projects' },
                  { id: 'mentions', label: 'Mentions', description: 'When someone mentions you' },
                  { id: 'updates', label: 'Product Updates', description: 'New features and improvements' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-light-text dark:text-dark-text">
                        {item.label}
                      </div>
                      <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {item.description}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="text-primary-500" defaultChecked />
                        <span>Email</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="text-primary-500" />
                        <span>Push</span>
                      </label>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage your team members and their permissions.
                    </CardDescription>
                  </div>
                  <Button icon={<Users className="w-4 h-4" />}>
                    Invite Members
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', email: 'john@example.com', role: 'Owner', avatar: 'JD' },
                    { name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', avatar: 'JS' },
                    { name: 'Mike Johnson', email: 'mike@example.com', role: 'Member', avatar: 'MJ' },
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border app-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-semibold">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-light-text dark:text-dark-text">
                            {member.name}
                          </div>
                          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            {member.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="px-3 py-1 text-sm border app-border rounded-md bg-white dark:bg-dark-bg-secondary">
                          <option value="owner" selected={member.role === 'Owner'}>Owner</option>
                          <option value="admin" selected={member.role === 'Admin'}>Admin</option>
                          <option value="member" selected={member.role === 'Member'}>Member</option>
                        </select>
                        {member.role !== 'Owner' && (
                          <Button variant="ghost" size="sm" className="text-error-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
