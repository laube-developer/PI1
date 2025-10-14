import { MouseEventHandler, ReactNode } from "react"
import { IconType } from "react-icons";

type ButtonProps = {
    handleClick?: MouseEventHandler<HTMLButtonElement>,
    children?: ReactNode;
    className?: string | (() => string);
    disable?: boolean,
    color?:  "primary" | "secondary" | "success" | "warn" | "error",
    icon?: IconType
    iconPos?: "right" | "left",
    iconSize?: number
}

const COLOR_CLASSES = {
    primary: "bg-slate-400 text-white hover:bg-gray-500 focus:ring-offset-1 focus:ring-gray-700",
    secondary: "bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300 focus:ring-offset-1 focus:ring-gray-400",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-offset-1 focus:ring-green-400",
    warn: "bg-yellow-500 text-gray-900 hover:bg-yellow-600 focus:ring-offset-1 focus:ring-yellow-400",
    error: "bg-red-600 text-white hover:bg-red-700 focus:ring-offset-1 focus:ring-red-500",
};

const DISABLED_CLASSES = "opacity-50 cursor-not-allowed bg-gray-300 text-gray-600 shadow-none";

export default function Button({
    handleClick,
    children,
    className = '',
    disable = false,
    color = 'primary',
    icon : Icon,
    iconPos = "left",
    iconSize = 12
}: ButtonProps){
    const baseClasses = "w-full bg-gray-200 text-gray-900 py-2 rounded-lg text-xs flex items-center justify-center gap-1";

    const colorClasses = COLOR_CLASSES[color] || COLOR_CLASSES.primary;

    const interactionClasses = disable
        ? DISABLED_CLASSES
        : `cursor-pointer active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-opacity-50`;

    const finalClasses = `${baseClasses} ${interactionClasses} ${disable ? DISABLED_CLASSES : colorClasses} ${className}`;

    return (
        <button
            className={finalClasses}
            onClick={handleClick}
            >
            {iconPos == "left" ? (<>
                {Icon && <Icon size={iconSize}/>}
                {children}
            </>) : ( <>
                {children}
                {Icon && <Icon size={iconSize}/>}
            </>)}
        </button>
    )
}