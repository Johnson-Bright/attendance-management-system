import { Button } from './ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export function SocialMediaLinks() {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com', color: 'hover:text-sky-500' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com', color: 'hover:text-blue-700' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com', color: 'hover:text-red-600' },
  ];

  return (
    <div className="flex items-center gap-1">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <Button
            key={social.name}
            variant="ghost"
            size="icon"
            asChild
            className={social.color}
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <Icon className="h-4 w-4" />
            </a>
          </Button>
        );
      })}
    </div>
  );
}
