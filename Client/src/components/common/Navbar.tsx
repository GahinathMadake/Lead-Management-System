import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Lead.png";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/authContext";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Leads", path: "/leads", User: "USER" },
    { name: "Review", path: "/add-review", User: "USER" },
  ];

  const renderLinks = (isMobile: boolean = false) =>
    navLinks.map((link) => {
      if (!link.User || user?.role === link.User) {
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`block text-sm font-medium text-indigo-900 hover:text-indigo-600 ${isMobile ? "py-1" : ""
              }`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            {link.name}
          </Link>
        );
      }
      return null;
    });


  const renderUserButtons = (isMobile: boolean = false) => {
    if (!user) {
      return (
        <>
          <Button
            onClick={() => {
              navigate("/login");
              isMobile && setIsOpen(false);
            }}
            variant="outline"
            className={`rounded-full px-4 py-1 text-sm ${isMobile ? "w-full" : ""}`}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              navigate("/sign-up");
              isMobile && setIsOpen(false);
            }}
            variant="outline"
            className={`rounded-full px-4 py-1 text-sm ${isMobile ? "w-full" : ""}`}
          >
            Sign Up
          </Button>
        </>
      );
    } else {
      if (isMobile) {
        return (
          <>
            <Button
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
              variant="outline"
              className="w-full rounded-full py-1"
            >
              Profile Settings
            </Button>
            <Button
              onClick={async () => {
                await handleLogout();
                setIsOpen(false);
              }}
              variant="outline"
              className="w-full rounded-full py-1"
            >
              Logout
            </Button>
          </>
        );
      } else {
        return (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger>
              <div className="flex items-center cursor-pointer space-x-2 px-3 py-1 hover:bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                  {getInitials(user.name)}
                </div>
                <div className="flex flex-col text-left text-sm">
                  <span className="font-medium">{user.name || "User"}</span>
                  <span className="text-gray-500">{user.email}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  };

  return (
    <header className={`w-full shadow-sm sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex gap-2 items-center text-xl font-bold text-indigo-900">
              <img src={logo} alt="logo" className="h-10 w-10 rounded-sm" />
              <span>LeadFlow</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center flex-1 justify-between">
            <nav className="flex gap-6 mx-auto">
              {renderLinks()}
            </nav>

            <div className="flex items-center space-x-4">
              {renderUserButtons()}
            </div>
          </div>


          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden shadow-md px-4 pb-4 space-y-2">
          {renderLinks(true)}
          <Separator className="my-2" />
          {renderUserButtons(true)}
        </div>
      )}
    </header>
  );
};

export default Navbar;