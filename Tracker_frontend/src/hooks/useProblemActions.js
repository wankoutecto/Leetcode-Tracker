import { useState } from "react";
import { resetReview, markReview, updateProblem} from "../service/ProblemService";

export function useProblemActions(token, onUpdate) {
    const [active, setActive] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // OPEN Popup
    const onOpenProblem = (problemId, msg, type = "text") => {
        setActive({
            problemId,
            type,
            content: msg
        });
    };

    const onClose = () => {
        setActive(null);
        setIsEditing(false);
    };

    const onEdit = () => {
        setIsEditing(true);
    };

    // SAVE SOLUTION (this is your backend update)
    const onSave = async (newSolution) => {
        if (!active?.problemId) return;

        try {
            const update = await updateProblem(
                active.problemId,
                newSolution,
                token
            );

            if(!update) return;

            // update UI state locally
            setActive(prev => ({
                ...prev,
                content: update.data.data.solution
            }));
    
            setIsEditing(false);

            onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    const onMarkReview = async (problemId) => {
        try {
            const res = await markReview(problemId, token);
            if(res.status === 200){
                onUpdate();
            }
        } catch (error) {
           console.error(error); 
        }
        
    };

    const onResetReview = async (problemId) => {
        try {
            const res = await resetReview(problemId, token);
            if(res.status === 200){
                onUpdate();
            }
        } catch (error) {
           console.error(error); 
        }
    }

    return {
        active,
        isEditing,
        actions: {
            onOpenProblem,
            onClose,
            onEdit,
            onSave,
            onMarkReview,
            onResetReview
        }
    };
}