import { useEffect, useState } from "react";

export function MessageRenderer({active, isEditing, actions}){
    const [editMsg, setEditMsg] = useState("");

    
    useEffect(() => {
        if(active){
            setEditMsg(active.content);
        }
    }, [active])

    return  (
        <>
        {active.type === "text" && 
            <>
                <p className="text-size">{active.content}</p>
                <div className="button-group">
                    <button onClick={actions.onClose}>Close</button>
                </div>
                
            </>
        }

        {active.type === "code" && 

            (!isEditing ? 
            <>
                <pre className="code-size">{active.content}</pre>
                <div className="button-group">
                    <button onClick={actions.onEdit}>Edit</button>
                    <button onClick={actions.onClose}>Close</button>
                </div>
            </> :
            <>
                <textarea 
                    value={editMsg}
                    onChange={(e) => setEditMsg(e.target.value)}
                />
                <div className="button-group">
                    <button onClick={() => actions.onSave(editMsg)}>Save</button>
                    <button onClick={actions.onClose}>Close</button>
                </div>
            </>) 
        }
        </>
    );
}