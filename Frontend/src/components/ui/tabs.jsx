import * as React from "react"
import { cn } from "../../lib/utils"

const TabsContext = React.createContext(null)

const Tabs = ({ defaultValue, value, onValueChange, children, className, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue)

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value)
    }
  }, [value])

  const handleTabChange = React.useCallback((val) => {
    setActiveTab(val)
    if (onValueChange) {
      onValueChange(val)
    }
  }, [onValueChange])

  return (
    <TabsContext.Provider value={{ activeTab, handleTabChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-start rounded-[var(--radius-md)] bg-[var(--bg-secondary)] p-1 text-[var(--text-muted)] border border-[var(--border-color)] gap-1",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  if (!context) return null
  const { activeTab, handleTabChange } = context
  const isActive = activeTab === value

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => handleTabChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        isActive
          ? "bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm font-semibold border border-[var(--border-color)]"
          : "hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/30 text-[var(--text-muted)] border border-transparent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  if (!context) return null
  const { activeTab } = context
  const isActive = activeTab === value

  if (!isActive) return null

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        "mt-4 focus-visible:outline-none animate-in fade-in-50 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
