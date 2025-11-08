import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  BookOpen, 
  Code, 
  Lightbulb, 
  Rocket,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';
import { useState } from 'react';

export const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const documentationSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Rocket,
      description: 'Quick start guides and tutorials',
      docs: [
        { title: 'Installation Guide', status: 'complete', time: '5 min' },
        { title: 'First Project Setup', status: 'complete', time: '10 min' },
        { title: 'Configuration Basics', status: 'in-progress', time: '8 min' },
      ]
    },
    {
      id: 'guides',
      title: 'Guides',
      icon: BookOpen,
      description: 'Step-by-step guides for common tasks',
      docs: [
        { title: 'Creating Diagrams', status: 'complete', time: '15 min' },
        { title: 'Team Collaboration', status: 'complete', time: '12 min' },
        { title: 'AI Analysis Features', status: 'complete', time: '20 min' },
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      description: 'Complete API documentation',
      docs: [
        { title: 'REST API Endpoints', status: 'complete', time: '25 min' },
        { title: 'Authentication', status: 'complete', time: '10 min' },
        { title: 'Webhooks', status: 'in-progress', time: '15 min' },
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: Lightbulb,
      description: 'Tips and recommendations',
      docs: [
        { title: 'Project Organization', status: 'complete', time: '8 min' },
        { title: 'Performance Optimization', status: 'complete', time: '12 min' },
        { title: 'Security Guidelines', status: 'complete', time: '10 min' },
      ]
    },
  ];

  const popularDocs = [
    { title: 'Getting Started with VisualDocs', views: 1234, rating: 4.8 },
    { title: 'Creating Your First Diagram', views: 987, rating: 4.9 },
    { title: 'AI-Powered Code Analysis', views: 856, rating: 4.7 },
    { title: 'Team Collaboration Features', views: 742, rating: 4.6 },
  ];

  return (
    <PremiumLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-brand-primary" />
              <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Everything you need to know about VisualDocs
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Docs</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Documentation Sections */}
              <div className="grid gap-6 md:grid-cols-2">
                {documentationSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Card key={section.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-bg rounded-lg">
                            <Icon className="h-5 w-5 text-brand-primary" />
                          </div>
                          <div>
                            <CardTitle>{section.title}</CardTitle>
                            <CardDescription>{section.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {section.docs.map((doc, idx) => (
                            <Button
                              key={idx}
                              variant="ghost"
                              className="w-full justify-start h-auto py-3"
                            >
                              <div className="flex items-center gap-3 w-full">
                                {doc.status === 'complete' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                ) : (
                                  <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                )}
                                <span className="flex-1 text-left">{doc.title}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {doc.time}
                                </Badge>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Documentation</CardTitle>
                  <CardDescription>Most viewed and highly rated guides</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {popularDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-gray-400">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span>{doc.views.toLocaleString()} views</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{doc.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Read
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Updated</CardTitle>
                  <CardDescription>Latest documentation changes and additions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Diagram Studio Features</h3>
                        <p className="text-sm text-gray-600 mt-1">Updated 2 hours ago</p>
                      </div>
                      <Badge>New</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">AI Analysis Guide</h3>
                        <p className="text-sm text-gray-600 mt-1">Updated 1 day ago</p>
                      </div>
                      <Badge variant="secondary">Updated</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Team Collaboration</h3>
                        <p className="text-sm text-gray-600 mt-1">Updated 3 days ago</p>
                      </div>
                      <Badge variant="secondary">Updated</Badge>
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
