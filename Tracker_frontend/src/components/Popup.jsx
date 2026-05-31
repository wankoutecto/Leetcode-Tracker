import { useRef } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";

export default function Popup({ onClose, children }) {
    const boxRef = useRef(null);

    useOutsideClick(boxRef, onClose);

    return (
        <div className="popup-container">
            <div className="popup-box" ref={boxRef}>
                {children} 
            </div>
        </div>
    );
}