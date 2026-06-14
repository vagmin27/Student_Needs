import { toast as hotToast } from "react-hot-toast"
import { toast as sonnerToast } from "sonner"

export const toast = {
  success: (message, options) => {
    try {
      return sonnerToast.success(message, options)
    } catch {
      return hotToast.success(message, options)
    }
  },
  error: (message, options) => {
    try {
      return sonnerToast.error(message, options)
    } catch {
      return hotToast.error(message, options)
    }
  },
  info: (message, options) => {
    try {
      return sonnerToast.info(message, options)
    } catch {
      return hotToast(message, { ...options, icon: "ℹ️" })
    }
  },
  warning: (message, options) => {
    try {
      return sonnerToast.warning(message, options)
    } catch {
      return hotToast(message, { ...options, icon: "⚠️" })
    }
  }
}

export default toast
