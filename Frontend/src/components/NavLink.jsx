import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils.js";

/**
 * NavLink Component
 * A wrapper around react-router-dom's NavLink that allows for easier 
 * passing of active and pending class names.
 * * @param {Object} props
 * @param {string} [props.className] - Base classes for the link
 * @param {string} [props.activeClassName] - Classes applied when the route is active
 * @param {string} [props.pendingClassName] - Classes applied when the route is pending
 * @param {string|Object} props.to - Target destination
 */
const NavLink = forwardRef(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            className, 
            isActive && activeClassName, 
            isPending && pendingClassName
          )
        }
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };