import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
  Menu,
  X,
  Clock,
  Smile
} from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: any;
  description?: string;
  rolesAllowed?: string[];
}

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const isLoggedIn = !!role;

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

const navigationItems: NavItem[] = [
  { name: "AI Support", path: "/chat", icon: MessageSquare, description: "Get immediate AI-guided mental health support" },
  { name: "Book Counselor", path: "/booking", icon: Calendar, description: "Schedule confidential sessions with professionals" },
  { name: "Resources", path: "/resources", icon: BookOpen, description: "Access wellness guides and meditation" },
  { name: "Community", path: "/community", icon: Users, description: "Connect with peer support network" },
  { name: "Weekly Report", path: "/weekly-report", icon: BarChart3, rolesAllowed: ["student", "admin"], description: "View your weekly mood analytics" },
  { name: "Analytics", path: "/admin", icon: BarChart3, rolesAllowed: ["admin"], description: "Admin dashboard and insights" },
  // ✅ Added Bubble Wrap Game
  { name: "EaseUp", path: "/bubble-wrap", icon: Smile, description: "Pop bubbles for fun and stress relief" }
];


  // Filter navigation based on role
  const filteredNavigation = navigationItems.filter(item => {
    if (!item.rolesAllowed) return true;
    return item.rolesAllowed.includes(role || "");
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background gradient-card border-b border-border shadow-soft">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="/favicon.png"
                alt="Saathi Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full shadow-md relative z-10"
              />
              <div className="absolute inset-0 bg-blue-500/40 rounded-full blur-lg scale-200 animate-soft-pulse"></div>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Saathi
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 ml-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth hover:bg-muted/50 group ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive(item.path) ? "text-primary" : "group-hover:text-primary"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}

            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                size="sm"
                className="gradient-secondary shadow-glow"
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm" className="gradient-primary shadow-glow">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 animate-in slide-in-from-top-2 space-y-2 px-4">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-smooth hover:bg-muted/50 ${
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive(item.path) ? "text-primary" : ""}`} />
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="px-4 pt-2">
            {isLoggedIn ? (
              <Button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                size="sm"
                className="w-full gradient-secondary shadow-glow"
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm" className="w-full gradient-primary shadow-glow">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
