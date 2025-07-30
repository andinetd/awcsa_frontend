import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const navItems = [
    { name: "Adoption", href: "/adoption/dashboard" },
    { name: "Social Affairs", href: "/social-affairs/socials/dashboard" },
    { name: "Women Affairs", href: "/womens/dashboard" },
    { name: "Super Admin", href: "/super-admin" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
      <div className="relative flex items-center justify-between max-w-7xl mx-auto border border-primary/30 backdrop-blur-lg bg-primary/5 rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/WCSA_logo.jpg"
            alt="Logo"
            width={200}
            height={50}
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation - Absolutely positioned and centered */}
        <div className="hidden xl:flex items-center space-x-6 lg:space-x-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-primary transition-colors duration-200 font-medium whitespace-nowrap text-sm lg:text-base font-lexend"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-1 sm:gap-2">
          <Link href={"/login"}>
            <Button className="text-xs sm:text-sm font-lexend">Sign In</Button>
          </Link>
        </div>

        {/* Tablet/Mobile Action Buttons */}
        <div className="hidden sm:flex lg:hidden items-center gap-2">
          <Link href={"/login"}>
            <Button size="sm" className="text-xs font-lexend">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:bg-white/30 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[400px] p-0 border-l-0"
            >
              <div className="flex flex-col h-full bg-gradient-to-br from-white via-gray-50 to-gray-100">
                {/* Header Section */}
                <div className="px-4 sm:px-6 py-6 sm:py-8 bg-white border-b border-gray-200">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/assets/WCSA_logo.jpg"
                      alt="Logo"
                      width={150}
                      height={50}
                      className="h-8 sm:h-10 w-auto"
                    />
                  </Link>
                </div>

                {/* Navigation Section */}
                <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4 font-lexend">
                      Navigation
                    </h3>
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:text-primary hover:bg-white/70 rounded-xl transition-all duration-200 font-medium group text-sm sm:text-base font-lexend"
                      >
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-t border-gray-200">
                  <div className="space-y-2 sm:space-y-3">
                    <Link href={"/login"}>
                      <Button className="w-full justify-center py-2.5 sm:py-3 h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all text-sm sm:text-base font-lexend">
                        Sign In
                      </Button>{" "}
                    </Link>
                  </div>

                  {/* Footer Text */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center font-lexend">
                      {`Addis Ababa City Administration Bureau of Women, Children & Social affairs`}
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
