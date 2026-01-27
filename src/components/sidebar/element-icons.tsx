import { ContainerIcon, TextIcon } from "../../assets/icons";

export const elementIcons = (color: string = "white", size: number = 40) => ({
    text: <TextIcon color={color} size={size}/>,
    container: <ContainerIcon color={color} size={size}/>
})