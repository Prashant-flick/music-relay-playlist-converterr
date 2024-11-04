'use client'

import { ToastContext } from "@/context/toast"
import { X } from "lucide-react"
import React, { useMemo, useState } from "react"

interface ToastProps {
    message: string,
    close: () => void,
    status: boolean
}

export const Toast = ({
    message,
    status,
    close
}: ToastProps) => {

    return(
        <div className={`fixed left-0 bottom-12 flex justify-start items-center w-auto pl-6 gap-2 pr-4 py-3 ${status ? 'bg-green-400' : 'bg-red-500'} shadow-md shadow-gray-600`}>
            <h1 className={`text-2xl font-bold ${status? 'text-black' : 'text-white'}`}>{message}</h1>
            <button
                className={`${status ? 'text-red-500' : 'text-white'}`}
                onClick={close}
            >
                <X strokeWidth={3}/>
            </button>
        </div>
    )
}

interface ToastProviderProps {
    children: React.ReactNode
}

interface ToastsProps {
    message: string,
    status: boolean,
    id: number,
}

export const ToastProvider = ({
    children
}: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastsProps[]>([])

    const openToast = ({message, status}: {message: string, status: boolean}) => {
        const newToast = {
            message: message,
            status: status,
            id: Date.now()
        };
        setToasts((prev) => [...prev, newToast]);
    }

    const closeToast = (id: number) => {
        setToasts((prev) => {
            return prev.filter((elem) => elem.id!==id)
        })
    }

    const contextValue = useMemo(() => ({
        open: openToast,
        close: closeToast
    }), [])

    return (
        <>
            <ToastContext.Provider value={contextValue}>
                {children}
                {
                    toasts &&
                    toasts.map((elem) => {
                        return (
                            <Toast
                                key={elem.id}
                                message={elem.message}
                                status={elem.status}
                                close={() => closeToast(elem.id)}
                            />
                        )
                    })
                }
            </ToastContext.Provider>
        </>
    )
}