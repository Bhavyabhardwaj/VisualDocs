import { useState, useEffect } from 'react';
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
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
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
  Check,
  Palette,
  Code2,
  Sparkles,
  HardDrive,
  Keyboard,
  Eye,
  EyeOff,
  Monitor,
  Moon,
  Sun,
  Zap,
  RefreshCw,
  Download,
  FileText,
  FolderOpen,
  Settings,
  Brain,
  Activity,
  BarChart3,
  AlertTriangle,
  Info,
  Save,
  RotateCcw
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const PremiumSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    projectAlerts: true,
    weeklyReports: false,
    securityAlerts: true,
    analysisComplete: true,
    teamMentions: true,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'system',
    accentColor: 'blue',
    compactMode: false,
    animationsEnabled: true,
    reducedMotion: false,
  });

  // Editor settings
  const [editor, setEditor] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: true,
    lineNumbers: true,
    formatOnSave: true,
    autoSave: true,
    autoSaveDelay: 1000,
    highlightActiveLine: true,
    bracketMatching: true,
  });

  // AI Analysis settings
  const [aiSettings, setAiSettings] = useState({
    autoAnalyze: true,
    analysisDepth: 'standard',
    suggestFixes: true,
    showSeverityBadges: true,
    groupByCategory: true,
    autoApplyLowSeverity: false,
    maxIssuesPerFile: 50,
    includeCodeSnippets: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    shareAnalytics: true,
    crashReports: true,
    usageStatistics: false,
    improveAi: true,
  });

  // Data settings
  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    exportFormat: 'json',
  });

  // Keyboard shortcuts
  const [shortcuts, setShortcuts] = useState({
    runAnalysis: 'Ctrl+Shift+A',
    saveProject: 'Ctrl+S',
    openSearch: 'Ctrl+K',
    toggleSidebar: 'Ctrl+B',
    newProject: 'Ctrl+N',
    exportReport: 'Ctrl+E',
  });

  // Save settings handler
  const handleSaveSettings = () => {
    // Store settings in localStorage for persistence
    localStorage.setItem('visualdocs_settings', JSON.stringify({
      appearance,
      editor,
      aiSettings,
      privacy,
      dataSettings,
      shortcuts,
      notifications,
    }));
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  // Reset settings to defaults
  const handleResetSettings = () => {
    setAppearance({
      theme: 'system',
      accentColor: 'blue',
      compactMode: false,
      animationsEnabled: true,
      reducedMotion: false,
    });
    setEditor({
      fontSize: 14,
      tabSize: 2,
      wordWrap: true,
      minimap: true,
      lineNumbers: true,
      formatOnSave: true,
      autoSave: true,
      autoSaveDelay: 1000,
      highlightActiveLine: true,
      bracketMatching: true,
    });
    setAiSettings({
      autoAnalyze: true,
      analysisDepth: 'standard',
      suggestFixes: true,
      showSeverityBadges: true,
      groupByCategory: true,
      autoApplyLowSeverity: false,
      maxIssuesPerFile: 50,
      includeCodeSnippets: true,
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  // Load settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('visualdocs_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.appearance) setAppearance(parsed.appearance);
        if (parsed.editor) setEditor(parsed.editor);
        if (parsed.aiSettings) setAiSettings(parsed.aiSettings);
        if (parsed.privacy) setPrivacy(parsed.privacy);
        if (parsed.dataSettings) setDataSettings(parsed.dataSettings);
        if (parsed.shortcuts) setShortcuts(parsed.shortcuts);
        if (parsed.notifications) setNotifications(parsed.notifications);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Debug: Log user data
  console.log('⚙️ PremiumSettings - Current user:', user);

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
    <TooltipProvider>
    <PremiumLayout>
      <div className="min-h-screen bg-white">
        {/* Header - Responsive */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary p-2 sm:p-2.5 shadow-sm">
                    <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">Settings</h1>
                    <p className="text-neutral-600 mt-0.5 text-sm sm:text-[15px]">
                      Manage your account and application preferences
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleResetSettings}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset all settings to defaults</TooltipContent>
                </Tooltip>
                <Button size="sm" onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content - Responsive */}
        <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <Tabs defaultValue="appearance" className="space-y-6 sm:space-y-8">
            <TabsList className="!bg-neutral-50 !border !border-neutral-200 p-1 w-full overflow-x-auto flex-nowrap justify-start rounded-lg h-auto">
              <TabsTrigger 
                value="appearance" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="editor" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Editor</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">AI Analysis</span>
              </TabsTrigger>
              <TabsTrigger 
                value="shortcuts" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Shortcuts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Data</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <Plug className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="data-[state=active]:!bg-white data-[state=active]:!text-neutral-900 data-[state=active]:shadow-sm !text-neutral-600 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 rounded-md"
              >
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Billing</span>
              </TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-4 sm:space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="w-5 h-5 text-brand-primary" />
                    Theme & Colors
                  </CardTitle>
                  <CardDescription>Customize how VisualDocs looks for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', icon: Sun, label: 'Light' },
                        { value: 'dark', icon: Moon, label: 'Dark' },
                        { value: 'system', icon: Monitor, label: 'System' },
                      ].map(({ value, icon: Icon, label }) => (
                        <button
                          key={value}
                          onClick={() => setAppearance({ ...appearance, theme: value })}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                            appearance.theme === value
                              ? 'border-brand-primary bg-brand-bg'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${appearance.theme === value ? 'text-brand-primary' : 'text-neutral-600'}`} />
                          <span className={`text-sm font-medium ${appearance.theme === value ? 'text-brand-primary' : 'text-neutral-700'}`}>
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Accent Color */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Accent Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'blue', color: 'bg-blue-500' },
                        { value: 'purple', color: 'bg-purple-500' },
                        { value: 'green', color: 'bg-green-500' },
                        { value: 'orange', color: 'bg-orange-500' },
                        { value: 'pink', color: 'bg-pink-500' },
                        { value: 'brand', color: 'bg-[#37322F]' },
                      ].map(({ value, color }) => (
                        <button
                          key={value}
                          onClick={() => setAppearance({ ...appearance, accentColor: value })}
                          className={`w-8 h-8 rounded-full ${color} transition-all ${
                            appearance.accentColor === value
                              ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110'
                              : 'hover:scale-105'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* UI Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Compact Mode</p>
                        <p className="text-sm text-neutral-600">Use smaller spacing and fonts</p>
                      </div>
                      <Switch
                        checked={appearance.compactMode}
                        onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Enable Animations</p>
                        <p className="text-sm text-neutral-600">Smooth transitions and effects</p>
                      </div>
                      <Switch
                        checked={appearance.animationsEnabled}
                        onCheckedChange={(checked) => setAppearance({ ...appearance, animationsEnabled: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Reduced Motion</p>
                        <p className="text-sm text-neutral-600">Minimize animations for accessibility</p>
                      </div>
                      <Switch
                        checked={appearance.reducedMotion}
                        onCheckedChange={(checked) => setAppearance({ ...appearance, reducedMotion: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Editor Tab */}
            <TabsContent value="editor" className="space-y-4 sm:space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-brand-primary" />
                    Editor Preferences
                  </CardTitle>
                  <CardDescription>Configure your code editor experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Font Size</Label>
                      <span className="text-sm text-neutral-600 font-mono">{editor.fontSize}px</span>
                    </div>
                    <Slider
                      value={[editor.fontSize]}
                      onValueChange={([value]) => setEditor({ ...editor, fontSize: value })}
                      min={10}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Tab Size */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tab Size</Label>
                    <Select
                      value={String(editor.tabSize)}
                      onValueChange={(value) => setEditor({ ...editor, tabSize: Number(value) })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select tab size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 spaces</SelectItem>
                        <SelectItem value="4">4 spaces</SelectItem>
                        <SelectItem value="8">8 spaces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Editor Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Word Wrap</p>
                        <p className="text-sm text-neutral-600">Wrap long lines to fit the editor width</p>
                      </div>
                      <Switch
                        checked={editor.wordWrap}
                        onCheckedChange={(checked) => setEditor({ ...editor, wordWrap: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Minimap</p>
                        <p className="text-sm text-neutral-600">Show code minimap on the side</p>
                      </div>
                      <Switch
                        checked={editor.minimap}
                        onCheckedChange={(checked) => setEditor({ ...editor, minimap: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Line Numbers</p>
                        <p className="text-sm text-neutral-600">Show line numbers in the gutter</p>
                      </div>
                      <Switch
                        checked={editor.lineNumbers}
                        onCheckedChange={(checked) => setEditor({ ...editor, lineNumbers: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Highlight Active Line</p>
                        <p className="text-sm text-neutral-600">Highlight the current cursor line</p>
                      </div>
                      <Switch
                        checked={editor.highlightActiveLine}
                        onCheckedChange={(checked) => setEditor({ ...editor, highlightActiveLine: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Bracket Matching</p>
                        <p className="text-sm text-neutral-600">Highlight matching brackets</p>
                      </div>
                      <Switch
                        checked={editor.bracketMatching}
                        onCheckedChange={(checked) => setEditor({ ...editor, bracketMatching: checked })}
                      />
                    </div>
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Auto Save */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Auto Save</p>
                        <p className="text-sm text-neutral-600">Automatically save files after editing</p>
                      </div>
                      <Switch
                        checked={editor.autoSave}
                        onCheckedChange={(checked) => setEditor({ ...editor, autoSave: checked })}
                      />
                    </div>
                    {editor.autoSave && (
                      <div className="space-y-3 pl-4 border-l-2 border-neutral-200">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Auto Save Delay</Label>
                          <span className="text-sm text-neutral-600">{editor.autoSaveDelay}ms</span>
                        </div>
                        <Slider
                          value={[editor.autoSaveDelay]}
                          onValueChange={([value]) => setEditor({ ...editor, autoSaveDelay: value })}
                          min={500}
                          max={5000}
                          step={500}
                          className="w-full"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Format on Save</p>
                        <p className="text-sm text-neutral-600">Automatically format code when saving</p>
                      </div>
                      <Switch
                        checked={editor.formatOnSave}
                        onCheckedChange={(checked) => setEditor({ ...editor, formatOnSave: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Analysis Tab */}
            <TabsContent value="ai" className="space-y-4 sm:space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-brand-primary" />
                    AI Analysis Settings
                  </CardTitle>
                  <CardDescription>Configure how AI analyzes your code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Analysis Depth */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Analysis Depth</Label>
                    <Select
                      value={aiSettings.analysisDepth}
                      onValueChange={(value) => setAiSettings({ ...aiSettings, analysisDepth: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select analysis depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Quick (Faster, basic checks)</SelectItem>
                        <SelectItem value="standard">Standard (Balanced)</SelectItem>
                        <SelectItem value="deep">Deep (Comprehensive, slower)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-neutral-500">
                      {aiSettings.analysisDepth === 'quick' && 'Fast analysis focusing on critical issues only'}
                      {aiSettings.analysisDepth === 'standard' && 'Balanced analysis for most use cases'}
                      {aiSettings.analysisDepth === 'deep' && 'Thorough analysis including style and best practices'}
                    </p>
                  </div>

                  {/* Max Issues */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Max Issues Per File</Label>
                      <span className="text-sm text-neutral-600">{aiSettings.maxIssuesPerFile}</span>
                    </div>
                    <Slider
                      value={[aiSettings.maxIssuesPerFile]}
                      onValueChange={([value]) => setAiSettings({ ...aiSettings, maxIssuesPerFile: value })}
                      min={10}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Analysis Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Auto Analyze</p>
                        <p className="text-sm text-neutral-600">Automatically run analysis on file changes</p>
                      </div>
                      <Switch
                        checked={aiSettings.autoAnalyze}
                        onCheckedChange={(checked) => setAiSettings({ ...aiSettings, autoAnalyze: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">AI Fix Suggestions</p>
                        <p className="text-sm text-neutral-600">Show AI-generated fix suggestions for issues</p>
                      </div>
                      <Switch
                        checked={aiSettings.suggestFixes}
                        onCheckedChange={(checked) => setAiSettings({ ...aiSettings, suggestFixes: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Show Severity Badges</p>
                        <p className="text-sm text-neutral-600">Display colored severity indicators</p>
                      </div>
                      <Switch
                        checked={aiSettings.showSeverityBadges}
                        onCheckedChange={(checked) => setAiSettings({ ...aiSettings, showSeverityBadges: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Group by Category</p>
                        <p className="text-sm text-neutral-600">Group issues by their category</p>
                      </div>
                      <Switch
                        checked={aiSettings.groupByCategory}
                        onCheckedChange={(checked) => setAiSettings({ ...aiSettings, groupByCategory: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Include Code Snippets</p>
                        <p className="text-sm text-neutral-600">Show relevant code in issue details</p>
                      </div>
                      <Switch
                        checked={aiSettings.includeCodeSnippets}
                        onCheckedChange={(checked) => setAiSettings({ ...aiSettings, includeCodeSnippets: checked })}
                      />
                    </div>
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Auto Fix */}
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-amber-900">Auto-Apply Low Severity Fixes</p>
                            <p className="text-sm text-amber-700">Automatically apply fixes for low-priority issues</p>
                          </div>
                          <Switch
                            checked={aiSettings.autoApplyLowSeverity}
                            onCheckedChange={(checked) => setAiSettings({ ...aiSettings, autoApplyLowSeverity: checked })}
                          />
                        </div>
                        <p className="text-xs text-amber-600 mt-2">
                          ⚠️ This feature modifies your code automatically. Use with caution.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Keyboard Shortcuts Tab */}
            <TabsContent value="shortcuts" className="space-y-4 sm:space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-brand-primary" />
                    Keyboard Shortcuts
                  </CardTitle>
                  <CardDescription>Customize keyboard shortcuts for faster navigation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(shortcuts).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                      <div>
                        <p className="font-medium text-sm text-neutral-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={value}
                          onChange={(e) => setShortcuts({ ...shortcuts, [key]: e.target.value })}
                          className="w-40 text-center font-mono text-sm"
                          placeholder="Press keys..."
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" onClick={() => setShortcuts({
                      runAnalysis: 'Ctrl+Shift+A',
                      saveProject: 'Ctrl+S',
                      openSearch: 'Ctrl+K',
                      toggleSidebar: 'Ctrl+B',
                      newProject: 'Ctrl+N',
                      exportReport: 'Ctrl+E',
                    })}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Reference</CardTitle>
                  <CardDescription>All available shortcuts at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { action: 'Search Files', keys: 'Ctrl+P' },
                      { action: 'Command Palette', keys: 'Ctrl+Shift+P' },
                      { action: 'Go to Line', keys: 'Ctrl+G' },
                      { action: 'Find in File', keys: 'Ctrl+F' },
                      { action: 'Replace', keys: 'Ctrl+H' },
                      { action: 'Toggle Comment', keys: 'Ctrl+/' },
                      { action: 'Duplicate Line', keys: 'Ctrl+Shift+D' },
                      { action: 'Delete Line', keys: 'Ctrl+Shift+K' },
                    ].map(({ action, keys }) => (
                      <div key={action} className="flex items-center justify-between p-2 rounded bg-neutral-50">
                        <span className="text-sm text-neutral-700">{action}</span>
                        <kbd className="px-2 py-1 bg-white border border-neutral-200 rounded text-xs font-mono">{keys}</kbd>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-4 sm:space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-primary" />
                    Privacy & Data Usage
                  </CardTitle>
                  <CardDescription>Control how your data is used and shared</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Share Analytics</p>
                      <p className="text-sm text-neutral-600">Help us improve by sharing anonymous usage data</p>
                    </div>
                    <Switch
                      checked={privacy.shareAnalytics}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, shareAnalytics: checked })}
                    />
                  </div>
                  <Separator className="bg-neutral-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Crash Reports</p>
                      <p className="text-sm text-neutral-600">Automatically send crash reports to help fix bugs</p>
                    </div>
                    <Switch
                      checked={privacy.crashReports}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, crashReports: checked })}
                    />
                  </div>
                  <Separator className="bg-neutral-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Usage Statistics</p>
                      <p className="text-sm text-neutral-600">Share feature usage to help prioritize development</p>
                    </div>
                    <Switch
                      checked={privacy.usageStatistics}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, usageStatistics: checked })}
                    />
                  </div>
                  <Separator className="bg-neutral-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-900">Improve AI Models</p>
                      <p className="text-sm text-neutral-600">Allow your code snippets to improve our AI (anonymized)</p>
                    </div>
                    <Switch
                      checked={privacy.improveAi}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, improveAi: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Data Privacy Notice</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-2">Your privacy matters to us</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                          <li>Your code is never stored on our servers without encryption</li>
                          <li>AI analysis runs locally when possible</li>
                          <li>You can export and delete all your data at any time</li>
                          <li>We never sell your personal information</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Tab */}
            <TabsContent value="data" className="space-y-4 sm:space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-brand-primary" />
                    Data & Storage
                  </CardTitle>
                  <CardDescription>Manage your data and backup settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Storage Usage */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Storage Used</Label>
                      <span className="text-sm text-neutral-600">2.4 GB / 10 GB</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full w-[24%] bg-brand-primary rounded-full" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>Projects: 1.8 GB</span>
                      <span>Analysis: 0.4 GB</span>
                      <span>Cache: 0.2 GB</span>
                    </div>
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Backup Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-neutral-900">Auto Backup</p>
                        <p className="text-sm text-neutral-600">Automatically backup your projects</p>
                      </div>
                      <Switch
                        checked={dataSettings.autoBackup}
                        onCheckedChange={(checked) => setDataSettings({ ...dataSettings, autoBackup: checked })}
                      />
                    </div>
                    
                    {dataSettings.autoBackup && (
                      <div className="space-y-3 pl-4 border-l-2 border-neutral-200">
                        <div className="space-y-2">
                          <Label className="text-sm">Backup Frequency</Label>
                          <Select
                            value={dataSettings.backupFrequency}
                            onValueChange={(value) => setDataSettings({ ...dataSettings, backupFrequency: value })}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Every Hour</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Retention Period</Label>
                            <span className="text-sm text-neutral-600">{dataSettings.retentionDays} days</span>
                          </div>
                          <Slider
                            value={[dataSettings.retentionDays]}
                            onValueChange={([value]) => setDataSettings({ ...dataSettings, retentionDays: value })}
                            min={7}
                            max={90}
                            step={7}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Export Options */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Default Export Format</Label>
                      <Select
                        value={dataSettings.exportFormat}
                        onValueChange={(value) => setDataSettings({ ...dataSettings, exportFormat: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="markdown">Markdown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="bg-neutral-200" />

                  {/* Data Actions */}
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Create Backup Now
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4 sm:space-y-6">
              <Card className="border-neutral-200 shadow-none">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Update your personal details and profile picture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xl sm:text-2xl font-semibold">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </TooltipProvider>
  );
};
