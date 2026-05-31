import { useState } from "react"

export function EditRenderer({solution, onSave, onClose}){
    const [textEditing, setTextEditing] = useState(solution);

    return (
        <>
            <textarea
                value={textEditing}
                onChange={(e) => setTextEditing(e.target.value)}
            />
            <div>
                <button onClick={() => onSave(textEditing)}>Save</button>
                <button onClick={onClose}>Close</button>
            </div>
        </>
    )
}