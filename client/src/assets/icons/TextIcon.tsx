import type { IconProps } from "./icon-props.interface"

export const TextIcon = ({size, color, className} : IconProps) => {
    return <svg width={size} height={size} className={className} viewBox="0 0 50 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 2.5V42.5M37.5 22.5V42.5M10 42.5H20M32.5 42.5H42.5M27.5 10V2.5H2.5V10M47.5 27.5V22.5H27.5V27.5" stroke={color} stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
}