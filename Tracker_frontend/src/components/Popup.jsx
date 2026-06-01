import { useRef } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";

export default function Popup({ onClose, children }) {
    const boxRef = useRef(null);

    useOutsideClick(boxRef, onClose);

    return (
        <div className="Popup-container">
            <div className="Popup-box" ref={boxRef}>
                {children} 
            </div>
        </div>
    );
}