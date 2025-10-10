import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User, Bell, Shield, Palette, Database, Users, CreditCard,
  Save, Upload, Trash2, Code2, LogOut, Mail, Lock, Globe,
  Check, X, ChevronRight, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'data', name: 'Data', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-neutral-200 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neutral-900 rounded-md flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-neutral-900">VisualDocs</span>
          </Link>

          <div className="flex items-center gap-3">
            {hasChanges && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-3 py-1.5 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </motion.button>
            )}
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors">
              <LogOut className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-14">
        <div className="max-w-6xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Settings</h1>
            <p className="text-neutral-600">Manage your account settings and preferences</p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-56 shrink-0">
              <div className="bg-white rounded-lg border border-neutral-200 p-2">
                <nav className="space-y-0.5">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        activeTab === tab.id
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Profile Picture */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-base font-semibold text-neutral-900 mb-4">Profile Picture</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        JD
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-base font-semibold text-neutral-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          onChange={() => setHasChanges(true)}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          onChange={() => setHasChanges(true)}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                        <input
                          type="email"
                          defaultValue="john.doe@example.com"
                          onChange={() => setHasChanges(true)}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bio</label>
                        <textarea
                          rows={3}
                          defaultValue="Full-stack developer passionate about creating beautiful documentation."
                          onChange={() => setHasChanges(true)}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-white rounded-lg border border-red-200 p-6">
                    <h3 className="text-base font-semibold text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Theme */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-base font-semibold text-neutral-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['Light', 'Dark', 'System'].map((theme) => (
                        <button
                          key={theme}
                          className={cn(
                            "p-4 border-2 rounded-lg text-sm font-medium transition-all",
                            theme === 'Light'
                              ? "border-neutral-900 bg-neutral-50"
                              : "border-neutral-200 hover:border-neutral-300"
                          )}
                        >
                          <div className="mb-2 h-12 bg-neutral-100 rounded flex items-center justify-center">
                            {theme === 'Light' && <Check className="w-5 h-5 text-neutral-900" />}
                          </div>
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interface */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-base font-semibold text-neutral-900 mb-4">Interface</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Font Size</label>
                        <select className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900">
                          <option>Small</option>
                          <option selected>Medium</option>
                          <option>Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Language</label>
                        <select className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border border-neutral-200 p-6"
                >
                  <h3 className="text-base font-semibold text-neutral-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'analysis', label: 'Analysis Complete', desc: 'When code analysis finishes' },
                      { id: 'comments', label: 'New Comments', desc: 'When someone comments on your projects' },
                      { id: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                      { id: 'updates', label: 'Product Updates', desc: 'New features and improvements' },
                      { id: 'security', label: 'Security Alerts', desc: 'Important security notifications' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{item.label}</div>
                          <div className="text-sm text-neutral-600">{item.desc}</div>
                        </div>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-sm text-neutral-600">
                            <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                            Email
                          </label>
                          <label className="flex items-center gap-2 text-sm text-neutral-600">
                            <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                            Push
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Password */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-base font-semibold text-neutral-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                      <button className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900 mb-1">Two-Factor Authentication</h3>
                        <p className="text-sm text-neutral-600">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'team' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border border-neutral-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-neutral-900">Team Members</h3>
                    <button className="px-3 py-1.5 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Invite Member
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'John Doe', email: 'john@example.com', role: 'Owner', avatar: 'JD', color: 'from-blue-500 to-purple-600' },
                      { name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', avatar: 'JS', color: 'from-pink-500 to-rose-600' },
                      { name: 'Mike Johnson', email: 'mike@example.com', role: 'Member', avatar: 'MJ', color: 'from-green-500 to-teal-600' },
                    ].map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center text-white text-sm font-semibold", member.color)}>
                            {member.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-neutral-900">{member.name}</div>
                            <div className="text-xs text-neutral-600">{member.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded">{member.role}</span>
                          {member.role !== 'Owner' && (
                            <button className="text-neutral-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'billing' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Current Plan */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-base font-semibold text-neutral-900 mb-4">Current Plan</h3>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">Pro Plan</div>
                        <div className="text-sm text-neutral-600">$29/month • Billed monthly</div>
                      </div>
                      <button className="px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors">
                        Change Plan
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-base font-semibold text-neutral-900 mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-neutral-900 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-900">•••• •••• •••• 4242</div>
                          <div className="text-xs text-neutral-600">Expires 12/24</div>
                        </div>
                      </div>
                      <button className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
                        Update
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'data' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Storage */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-base font-semibold text-neutral-900 mb-4">Storage Usage</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">Used</span>
                        <span className="font-medium text-neutral-900">2.4 GB of 10 GB</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full w-[24%] bg-neutral-900 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Export Data */}
                  <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-base font-semibold text-neutral-900 mb-2">Export Data</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      Download all your data in a portable format
                    </p>
                    <button className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors">
                      Export All Data
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

