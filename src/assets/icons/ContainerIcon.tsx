import type { IconProps } from "./icon-props.interface"

export const ContainerIcon = ({size, color, className} : IconProps) => {
    return <svg width={size} height={size} className={className} viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32.5 2.5H32.525M22.5 2.5H22.525M22.5 42.5H22.525M32.5 42.5H32.525M12.5 2.5H12.525M2.5 2.5H2.525M2.5 12.5H2.525M2.5 22.5H2.525M2.5 32.5H2.525M2.5 42.5H2.525M12.5 42.5H12.525M42.5 2.5H42.525M42.5 12.5H42.525M42.5 22.5H42.525M42.5 32.5H42.525M42.5 42.5H42.525" stroke={color} stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

}