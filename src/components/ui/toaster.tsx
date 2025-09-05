import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
    const { toasts } = useToast()

    const getVariantIcon = (variant?: string | null) => {
        switch (variant) {
            case 'success':
                return <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
            case 'destructive':
                return <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
            case 'warning':
                return <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0 mt-1"></div>
            case 'info':
                return <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
            default:
                return <div className="w-2 h-2 bg-gray-500 rounded-full flex-shrink-0 mt-1"></div>
        }
    }

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, variant, ...props }) {
                return (
                    <Toast key={id} variant={variant} {...props}>
                        <div className="flex items-start space-x-3 flex-1">
                            {getVariantIcon(variant)}
                            <div className="grid gap-1 flex-1 min-w-0">
                                {title && <ToastTitle className="text-sm font-semibold leading-tight">{title}</ToastTitle>}
                                {description && (
                                    <ToastDescription className="text-xs opacity-80 leading-relaxed">{description}</ToastDescription>
                                )}
                            </div>
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                )
            })}
            <ToastViewport />
        </ToastProvider>
    )
}