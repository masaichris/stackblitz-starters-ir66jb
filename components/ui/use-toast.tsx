import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"

function toast({ title, description, variant = "default" }: { 
  title?: string
  description: string
  variant?: "default" | "destructive" 
}) {
  const toastList = document.createElement("div")
  toastList.setAttribute("class", "fixed top-0 right-0 p-4 space-y-4 w-full max-w-md z-50")
  document.body.appendChild(toastList)

  const toast = document.createElement("div")
  toast.setAttribute("class", `bg-white rounded-lg shadow-lg p-4 ${variant === "destructive" ? "border-red-500" : "border-gray-200"} border`)
  
  if (title) {
    const titleEl = document.createElement("div")
    titleEl.setAttribute("class", "font-medium")
    titleEl.textContent = title
    toast.appendChild(titleEl)
  }

  const descriptionEl = document.createElement("div")
  descriptionEl.setAttribute("class", "text-sm text-gray-500")
  descriptionEl.textContent = description
  toast.appendChild(descriptionEl)

  toastList.appendChild(toast)

  setTimeout(() => {
    toast.remove()
    if (toastList.childNodes.length === 0) {
      toastList.remove()
    }
  }, 3000)
}

export { toast }