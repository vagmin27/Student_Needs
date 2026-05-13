import React from "react";
import { GraduationCap } from "lucide-react";
import { NavLink } from "./NavLink";

/**
 * Footer Component
 * A responsive, two-column footer featuring brand info, navigation links, 
 * and a newsletter subscription.
 */
const Footer = () => {
  return (
    <footer className="relative z-10 mt-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-10 md:py-12">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 min-h-auto md:min-h-[500px] shadow-sm shadow-glow/10">
        
        {/* Left Box - Branding & Value Proposition */}
        <div className="w-full md:w-[35%] bg-[#1a7861] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between rounded-lg border shadow-md shadow-gray-600/20">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-background flex items-center justify-center">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
              </div>
              <h2 className="font-bold text-background text-2xl sm:text-3xl md:text-4xl">
                NextRef.
              </h2>
            </div>
            <div className="space-y-1 mb-6 sm:mb-8">
              <p className="text-primary-foreground/90 text-base sm:text-lg font-medium">
                Trustworthy Referrals
              </p>
              <p className="text-accent-foreground text-sm sm:text-md leading-tight tracking-tight">
                Verified resumes referrals based on transparent credentials.
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-accent-foreground text-xs sm:text-sm uppercase tracking-wider">
              Built with trust on
            </p>
            <p className="text-background font-semibold text-xl sm:text-2xl">
              Next Gen Analysis Model 
            </p>
          </div>
        </div>

        {/* Right Box - Navigation, Contact, and Newsletter */}
        <div className="w-full md:w-[65%] bg-background border rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 shadow-md shadow-gray-600/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 h-full">
            
            {/* Top Left - Links and Contact */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-8 md:gap-12">
              <div className="w-full sm:w-auto">
                <h3 className="text-foreground font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Links</h3>
                <nav className="space-y-1.5 sm:space-y-2">
                  <NavLink
                    to="/"
                    className="block text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-md"
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/about"
                    className="block text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-md"
                  >
                    About
                  </NavLink>
                  <a
                    href="#features"
                    className="block text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-md"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="block text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-md"
                  >
                    How It Works
                  </a>
                </nav>
              </div>
              <div className="w-full sm:w-auto">
                <h3 className="text-foreground font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Info</h3>
                <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-md text-muted-foreground">
                  <p>Email: hello@nextref.io</p>
                  <p>Location: Kolkata, India</p>
                </div>
              </div>
            </div>

            {/* Top Right - Decorative Floating Logo (Hidden on mobile) */}
            <div className="hidden md:flex justify-end">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-secondary/10 border rotate-[30deg] flex items-center justify-center transform translate-x-4 -translate-y-4 shadow-md shadow-slate-200/20">
                <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-primary -rotate-[36deg]" />
              </div>
            </div>

            {/* Bottom Left - Newsletter Subscription */}
            <div className="flex items-end gap-4 order-last md:order-none">
              <div className="w-full">
                <h3 className="text-foreground font-semibold mb-2 sm:mb-3 text-sm sm:text-md">
                  Stay Updated
                </h3>
                <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-card border border-border rounded-lg text-sm sm:text-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  />
                  <button className="px-4 sm:px-6 py-2 bg-primary text-background rounded-lg text-sm sm:text-md font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Right - Credit/Copyright */}
            <div className="flex items-end justify-start md:justify-end order-last">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Built with 💚 by Team <b>CODE KINETICS</b>⚡
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;