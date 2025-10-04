import { motion } from 'framer-motion';
import {
  FolderGit2,
  FileCode2,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight,
  Clock,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useProjects } from '../hooks/useApi';
import type { Project } from '../lib/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const { projects, isLoading } = useProjects();

  const stats = [
    {
      label: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderGit2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: '+12%',
    },
    {
      label: 'Diagrams Generated',
      value: projects?.reduce((acc: number, p: Project) => acc + (p.diagramCount || 0), 0) || 0,
      icon: FileCode2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      trend: '+24%',
    },
    {
      label: 'Files Analyzed',
      value: projects?.reduce((acc: number, p: Project) => acc + (p.fileCount || 0), 0) || 0,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      trend: '+8%',
    },
    {
      label: 'Active This Week',
      value: projects?.filter((p: Project) => {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        return new Date(p.updatedAt) > lastWeek;
      }).length || 0,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      trend: '+16%',
    },
  ];

  const recentProjects = projects?.slice(0, 4) || [];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-foreground mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-app-muted">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} variants={item}>
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm text-green-500 font-medium">
                    {stat.trend}
                  </span>
                </div>
                <div className="text-3xl font-bold text-app-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-app-muted">{stat.label}</div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Projects */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-app-foreground">
            Recent Projects
          </h2>
          <Link to="/app/projects">
            <Button variant="ghost">
              View all
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-app-border rounded mb-4"></div>
                <div className="h-3 bg-app-border rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : recentProjects.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {recentProjects.map((project: Project) => (
              <motion.div key={project.id} variants={item}>
                <Link to={`/app/projects/${project.id}`}>
                  <Card className="p-6 hover:border-primary/50 transition-colors group cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <FolderGit2 className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-app-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-app-muted mb-4 line-clamp-2">
                      {project.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-app-muted">
                      <div className="flex items-center gap-1">
                        <FileCode2 className="w-3 h-3" />
                        {project.fileCount || 0} files
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-app-border rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderGit2 className="w-8 h-8 text-app-muted" />
            </div>
            <h3 className="text-lg font-semibold text-app-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-app-muted mb-6">
              Create your first project to start visualizing your code
            </p>
            <Link to="/app/projects/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-app-foreground mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/app/projects/new">
            <Card className="p-6 hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-app-foreground mb-2 group-hover:text-primary transition-colors">
                New Project
              </h3>
              <p className="text-sm text-app-muted">
                Upload your codebase and start generating diagrams
              </p>
            </Card>
          </Link>

          <Link to="/app/diagrams">
            <Card className="p-6 hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center mb-4 transition-colors">
                <FileCode2 className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-app-foreground mb-2 group-hover:text-primary transition-colors">
                View Diagrams
              </h3>
              <p className="text-sm text-app-muted">
                Browse all your generated architecture diagrams
              </p>
            </Card>
          </Link>

          <Link to="/app/settings">
            <Card className="p-6 hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center mb-4 transition-colors">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-app-foreground mb-2 group-hover:text-primary transition-colors">
                Team Settings
              </h3>
              <p className="text-sm text-app-muted">
                Invite team members and manage permissions
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
