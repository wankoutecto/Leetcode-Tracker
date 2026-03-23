import { useState } from "react";
import '../App.css';
import axios from "axios";
import { useAuth } from '../AuthContext';
import { isTokenValid } from './isTokenValid';

const FIELD = ['solution', 'review'];

export default function ProblemCard({pb, onUpdate, activeTab}){
    const {token, logout} = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCode, setEditedCode] = useState("");
    const [error, setError] = useState('');
    const [popupType, setPopupType] = useState('');


    const handleSave = async () => {
        if (editedCode.trim() !== '') {
            // Build updated problem data
            const updatedProblem = {
                id: pb.id,
                title: pb.title,
                link: pb.link,
                nextReviewDate: pb.nextReviewDate,
                lastReviewDate: pb.lastReviewDate,
                reviewLeft: pb.reviewLeft,
                solutionCode: editedCode
            };

            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/problem/${pb.id}/update`,
                    updatedProblem, 
                    {headers: {Authorization: `Bearer ${token}`}}
                );

                if (res.status === 200) {
                    onUpdate(); // tell parent to refresh
                }
            } catch (err) {
                if(!isTokenValid(token)){
                    logout();
                }
                console.error("Update failed:", err);
            }
        }

        setIsEditing(false);
        setShowPopup(false);
    };

    const handleClose = () => {
        setIsEditing(false);
        setShowPopup(false);
    }


    const onMarkDone = async(problemId) => {
        try {
            //const encodeTitle = encodeURIComponent(title); only use for Query string
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/problem/${problemId}/reviewed`,{}, {
                headers:{Authorization: `Bearer ${token}`}
            });
            if(res.status === 200){
                onUpdate();
                console.log("Mark reviewed");
            }
        } catch (err) {
            if(!isTokenValid(token)){
                logout();
            }
            console.error(err);
        } finally{
            handleClose();
        }
    }

    const resetProblem = async(problemId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/problem/${problemId}/reset`,{}, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if(res.status === 200){
                onUpdate();
                console.log("Problem reset");
            }
        } catch (err) {
            if(!isTokenValid(token)){
               logout();
            }else if(err.status === 409){
                setError(err.response.data.message);
                return;
            }
            console.error(err);
        }finally{
            handleClose();
        }
    }


    
    return (
        <>
            <div className= "review-card">
                <div className="review-card-toLink">
                    <a href={pb.link} target="_blank" rel="noopener noreferrer"className="no-underline viewStyle">
                        view problem
                    </a>
                </div>

                <p className="page-title">{pb?.title}</p>

                <div className="info-line">
                    <span>Next Review</span>
                    <span style={{ fontWeight: 700 }}>{pb?.nextReviewDate ?? "completed"}</span>
                </div>

                <div className="info-line">
                    <span>Last Review</span>
                    <span style={{ fontWeight: 700 }}>{pb?.lastReviewDate}</span>
                </div>

                <div className="info-line">
                    <span>Review Left</span>
                    <span style={{ fontWeight: 700, 
                        color: pb?.reviewLeft > 0 ? "red": "green" }}
                    >{pb.reviewLeft}</span>
                </div>

                <div className="info-line">
                    <span>Solution Code</span>
                    <button
                        onClick={() => {
                            setEditedCode(pb.solutionCode);
                            setShowPopup(true);
                            setPopupType(FIELD[0]);
                        }}
                        className="no-underline viewStyle"
                        >
                        Show
                    </button>
                </div>
                
            
                <br />
                <div className="review-card-bottom">
                    {activeTab !== "Fully Reviewed" && (
                        <button onClick={() => {
                            setShowPopup(true);
                            setPopupType(FIELD[1]);
                        } }
                        >Mark Review</button>
                    )}
                    
                    {(activeTab === "Fully Reviewed") && (
                        <button onClick={() => {
                            setShowPopup(true);
                            setPopupType(FIELD[2]);
                        }}>Reset Review</button>   
                    )}
                </div>
                {error && <p>{error}</p>}
            </div>

            {showPopup && (
                <div className="popup-container">
                    {popupType === FIELD[0] &&
                        <div className="popup-box">
                            {isEditing ? (
                                <textarea value={editedCode} onChange={(e) => setEditedCode(e.target.value)}
                                className="editable"/>
                            ) : (<p className="editable">{editedCode}</p>)}

                            <div className="button-group">
                                <div className="atCenter">
                                {isEditing ? (
                                    <>
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={handleClose}>Close</button>
                                    </>
                                ) : (
                                    <>
                                    <button onClick={() => setIsEditing(true)}>Edit</button>
                                    <button onClick={handleClose}>Close</button>
                                    </>
                                )}
                                </div>
                            </div>
                        </div > 
                    }
                    {popupType === FIELD[1] &&
                        <div className="popup-box">
                            <div className="button-group">
                                <div className="atCenter">
                                    <button onClick={() => pb?.id && onMarkDone(pb?.id)}>Mark Review</button>
                                    <button onClick={handleClose}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    }
                    {popupType === FIELD[2] &&
                        <div className="popup-box">
                            <div className="button-group">
                                <div className="atCenter">
                                    <button onClick={() => pb?.id && resetProblem(pb?.id)}>Reset</button>
                                    <button onClick={handleClose}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            )}
        </>
    );
}