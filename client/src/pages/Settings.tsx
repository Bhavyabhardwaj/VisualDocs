import { Card } from '../components/ui/Card';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

export function Settings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-foreground mb-2">
          Settings
        </h1>
        <p className="text-app-muted">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: User, title: 'Profile', description: 'Manage your profile information' },
          { icon: Bell, title: 'Notifications', description: 'Configure notification preferences' },
          { icon: Shield, title: 'Privacy & Security', description: 'Manage your security settings' },
          { icon: Palette, title: 'Appearance', description: 'Customize the look and feel' },
          { icon: SettingsIcon, title: 'Preferences', description: 'Application preferences' },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-app-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-app-muted">{item.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
