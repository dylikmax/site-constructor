import type { IconProps } from "./icon-props.interface"

export const ArrowIcon = ({size, color, className} : IconProps) => {
    return <svg width={size} height={size} className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 10L15 22.5L27.5 10" stroke={color} stroke-width="3.75" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
}
