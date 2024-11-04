import { createContext, useContext } from "react";

type ToastContextValue = {
    open: ({message, status}: {message: string, status: boolean}) => void,
    close: (id: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => useContext(ToastContext);
