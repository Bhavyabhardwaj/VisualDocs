import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

const productLinks: FooterLink[] = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'API Docs', href: '/api-docs', external: true },
  { name: 'Integrations', href: '/integrations' },
];

const companyLinks: FooterLink[] = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

const supportLinks: FooterLink[] = [
  { name: 'Help Center', href: '/help' },
  { name: 'Community', href: '/community', external: true },
  { name: 'Status', href: '/status', external: true },
  { name: 'Bug Reports', href: '/bugs', external: true },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/bhavyabhardwaj/visualdocs', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com/visualdocs', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/visualdocs', icon: Linkedin },
  { name: 'Email', href: 'mailto:hello@visualdocs.com', icon: Mail },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white border-t-4 border-emerald-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white border-2 border-white flex items-center justify-center">
                <Code2 className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-black text-white">VisualDocs</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Transform your code into beautiful documentation with AI-powered analysis, 
              automated diagram generation, and seamless team collaboration.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-emerald-400 transition-colors p-2 border-2 border-gray-700 hover:border-emerald-500 bg-gray-800 hover:bg-gray-700"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b-2 border-emerald-500 pb-2">
              Product
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b-2 border-emerald-500 pb-2">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b-2 border-emerald-500 pb-2">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t-2 border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 VisualDocs. All rights reserved. Built with ❤️ for developers.
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
