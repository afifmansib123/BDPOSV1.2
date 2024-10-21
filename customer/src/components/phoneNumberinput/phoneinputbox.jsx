import Input from "antd/es/input/Input"
import { useState } from "react"
const Phoneinputbox = ({value, onChange}) => {
    const handlekeydown = (f) => {
        if((f.key >=0 && f.key <=9) || (f.key === "Backspace") || (f.key === "Delete") || (f.key === "ArrowRight") || (f.key === "ArrowLeft") || (f.key === "Enter") || (f.key === "Backspace")){
            return
        }
        f.preventDefault();
    }
    return (
        <div className="flex items-center space-x-2">
        <span className="juustify-center">(+88)</span><Input 
        placeholder = "enter Phone number"
        onKeyDown={handlekeydown}
        value={value}
        onChange={onChange}
        maxLength={11}
        ></Input>
        </div>
    )
}
export default Phoneinputbox