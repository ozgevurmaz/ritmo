"use client"

import { useEffect, useState } from 'react';
import {
  Settings,
  Target,
  Users,
  Flame,
  Plus,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { CATEGORIES, CONNECTIONS } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { getInitials } from '@/lib/utils';
import { Badge } from '../../ui/badge';


export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('friends');
  
  // Handle window resize to auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside 
      className={`border-r min-h-screen bg-background transition-all duration-300 sticky pt-14 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border bg-background shadow-sm cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <div className="p-4">
        {/* Quick Actions */}
        <div className="mb-6 flex justify-center gap-2">
          {collapsed ? (
            <Button size="icon" className="h-10 w-10 rounded-full bg-primary text-primary-foreground cursor-pointer">
              <Plus className="h-5 w-5" />
            </Button>
          ) : (
            <Button className="w-full gap-2 bg-primary text-primary-foreground cursor-pointer">
              <Plus className="h-4 w-4" />
              Create New
            </Button>
          )}
        </div>

        {/* Section Tabs */}
        {!collapsed && (
          <div className="flex gap-1 mb-4 border-b pb-2">
            <Button 
              variant={activeSection === 'friends' ? 'secondary' : 'ghost'} 
              size="sm"
              className="flex-1 cursor-pointer"
              onClick={() => setActiveSection('friends')}
            >
              <Users className="h-4 w-4 mr-1" />
              Friends
            </Button>
            <Button 
              variant={activeSection === 'categories' ? 'secondary' : 'ghost'} 
              size="sm"
              className="flex-1 cursor-pointer"
              onClick={() => setActiveSection('categories')}
            >
              <Target className="h-4 w-4 mr-1" />
              Categories
            </Button>
          </div>
        )}

        {/* Friends Section */}
        {(activeSection === 'friends' || collapsed) && (
          <div className="space-y-2">
            {collapsed ? (
              <div className="text-center mb-2">
                <Users className="h-5 w-5 mx-auto text-muted-foreground" />
              </div>
            ) : (
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">Online Friends</h3>
            )}
            
            {CONNECTIONS.map((user) => (
              <Button 
                key={user.id}
                variant="ghost" 
                className={`w-full justify-start p-2 hover:bg-accent/20 hover:text-foreground cursor-pointer ${collapsed ? 'h-12 p-0 justify-center' : ''}`}
              >
                <div className={`flex items-center ${collapsed ? 'flex-col gap-0' : 'gap-2'}`}>
                  <div className="relative">
                    <Avatar className={collapsed ? 'h-8 w-8' : 'h-7 w-7'}>
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ${
                      user.online ? 'bg-green-500' : 'bg-muted'
                    } border-2 border-background`}>
                    </span>
                  </div>
                  
                  {!collapsed && (
                    <div className="flex-grow min-w-0 text-left">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Flame className="h-3 w-3 text-orange-500 mr-1" />
                        <span>{user.streak} day streak</span>
                      </div>
                    </div>
                  )}
                </div>
              </Button>
            ))}
            
            {!collapsed && (
              <Button variant="ghost" size="sm" className="w-full mt-2 cursor-pointer">
                <Users className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
            )}
          </div>
        )}

        {/* Categories Section */}
        {activeSection === 'categories' && !collapsed && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Your Categories</h3>
            
            {CATEGORIES.map((category) => (
              <Button 
                key={category.name}
                variant="ghost" 
                className="w-full justify-start p-2 hover:bg-accent/20 hover:text-foreground cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">{category.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              </Button>
            ))}
            
            <Button variant="ghost" size="sm" className="w-full mt-2 cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Follow More Category
            </Button>
          </div>
        )}

        {/* Help & Settings - Shown at Bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          {collapsed ? (
            <div className="flex flex-col items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}