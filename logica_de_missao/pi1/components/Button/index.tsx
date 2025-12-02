import { MouseEventHandler, ReactNode } from "react"
import { IconType } from "react-icons";

type ButtonProps = {
    handleClick?: MouseEventHandler<HTMLButtonElement>,
    children?: ReactNode;
    className?: string | (() => string);
    disabled?: boolean,
    color?:  "primary" | "secondary" | "success" | "warn" | "error",
    icon?: IconType
    iconPos?: "right" | "left",
    iconSize?: number,
    smoth?: boolean
}

const COLOR_CLASSES = {
    primary: "bg-slate-400 text-white hover:bg-gray-500 focus:ring-offset-1 focus:ring-gray-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-offset-1 focus:ring-gray-400",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-offset-1 focus:ring-green-400",
    warn: "bg-yellow-500 text-gray-900 hover:bg-yellow-600 focus:ring-offset-1 focus:ring-yellow-400",
    error: "bg-red-600 text-white hover:bg-red-700 focus:ring-offset-1 focus:ring-red-500",
};

const SMOTH_COLOR_CLASSES = {
    primary: "bg-slate-200 text-slate-500 hover:bg-gray-300 focus:ring-offset-1 focus:ring-gray-400",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-offset-1 focus:ring-gray-200",
    success: "bg-green-200 text-green-700 hover:bg-green-300 focus:ring-offset-1 focus:ring-green-300",
    warn: "bg-yellow-200 text-gray-700 hover:bg-yellow-300 focus:ring-offset-1 focus:ring-yellow-300",
    error: "bg-red-200 text-red-700 hover:bg-red-300 focus:ring-offset-1 focus:ring-red-300",
};

const DISABLED_CLASSES = "opacity-50 cursor-not-allowed bg-gray-300 text-gray-600 shadow-none";

export default function Button({
    handleClick,
    children,
    className = '',
    disabled = false,
    color = 'primary',
    icon : Icon,
    iconPos = "left",
    iconSize = 12,
    smoth= false
}: ButtonProps){
    const baseClasses = "w-full bg-gray-200 text-gray-900 py-2 rounded-lg text-xs flex items-center justify-center gap-1";

    const colorClasses = (smoth ? SMOTH_COLOR_CLASSES[color] : COLOR_CLASSES[color]) || COLOR_CLASSES.primary;

    const interactionClasses = disabled
        ? DISABLED_CLASSES
        : `cursor-pointer active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-opacity-50`;

    const resolvedClassName = typeof className === 'function' ? className() : className;

    const finalClasses = `${baseClasses} ${interactionClasses} ${disabled ? DISABLED_CLASSES : colorClasses} ${resolvedClassName}`;

    return (
        <button
            className={finalClasses}
            onClick={handleClick}
            disabled={disabled}
            >
            {iconPos == "left" ? (<>
                {Icon && <span data-testid="button-icon"><Icon size={iconSize}/></span>}
                {children}
            </>) : ( <>
                {children}
                {Icon && <span data-testid="button-icon"><Icon size={iconSize}/></span>}
            </>)}
        </button>
    )
}