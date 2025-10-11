import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Shield,
  Palette,
  Settings as SettingsIcon,
  Code2,
  ChevronRight,
  Search,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Settings = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const settingsSections = [
    {
      id: 'profile',
      name: 'Profile',
      description: 'Manage your account and personal information',
      icon: User,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Control how you receive updates and alerts',
      icon: Bell,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'security',
      name: 'Security',
      description: 'Password, authentication, and privacy settings',
      icon: Shield,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 'appearance',
      name: 'Appearance',
      description: 'Customize the look and feel of your workspace',
      icon: Palette,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: 'preferences',
      name: 'Preferences',
      description: 'App-specific settings and configurations',
      icon: SettingsIcon,
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const filteredSections = settingsSections.filter(section =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-xl">
        <div className="flex h-16 items-center px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 rounded-lg p-2 hover:bg-white/5 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center gap-3">
            <Code2 className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-semibold">VisualDocs</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 280 : 0,
            opacity: sidebarOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="border-r border-white/5 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Settings</h2>
            <p className="text-sm text-gray-400 mb-6">
              Manage your account and preferences
            </p>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-white/5 pl-10 pr-4 py-2 text-sm outline-none border border-white/10 focus:border-blue-500/50 transition-colors"
              />
            </div>

            <nav className="space-y-2">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => navigate(`/app/settings/${section.id}`)}
                  className="w-full flex items-center gap-3 rounded-lg p-3 text-left hover:bg-white/5 transition-colors group"
                >
                  <div className={cn(
                    "rounded-lg p-2 bg-gradient-to-br",
                    section.gradient
                  )}>
                    <section.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{section.name}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              ))}
            </nav>
          </div>
        </motion.aside>

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-gray-400 mb-8">
                Customize your VisualDocs experience
              </p>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                {filteredSections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => navigate(`/app/settings/${section.id}`)}
                    className="group relative overflow-hidden rounded-2xl bg-[#0F1419] p-6 text-left border border-white/5 hover:border-white/10 transition-all duration-300"
                  >
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                      section.gradient
                    )} />

                    <div className="relative">
                      <div className={cn(
                        "inline-flex rounded-xl p-3 bg-gradient-to-br mb-4",
                        section.gradient
                      )}>
                        <section.icon className="h-6 w-6 text-white" />
                      </div>

                      <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
                        {section.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {section.description}
                      </p>

                      <div className="flex items-center text-sm text-gray-400 group-hover:text-blue-400 transition-colors">
                        <span>Configure</span>
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 border border-blue-500/20"
              >
                <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Check out our documentation or contact support for assistance
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors">
                    View Docs
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
                    Contact Support
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};
