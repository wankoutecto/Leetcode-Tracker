import '../App.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../AuthContext"
import { isTokenValid } from './isTokenValid';


export default function AddNewProblem({onUpdate}){
    const {token, logout} = useAuth();
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [solutionCode, setSolutionCode] = useState('');
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const popupRef = useRef(null); //give you the reference for the part of the screen you click

    const [response, setResponse] = useState();

    const addProblem = async(e) => {
        e.preventDefault();
        try{
            if(!token){
                alert("You are not login. Please login to add new problem");
                return;
            }
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/problem/add`,
                { title, link, solutionCode },
                {headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if(res.status === 200){
                setTitle('');
                setLink('');
                setSolutionCode('');
                setResponse("New problem Added"); 
                setError("")
                onUpdate();
            }
        } catch (err) {
            if(!isTokenValid(token)){
                logout();
            }
            else if(err.status === 409){
                setError(err.response.data.message);
                setResponse('');
                setEdited('');
                return;
            }
            console.error(err?.response?.data?.message || "Error Occurred");
            setResponse("");
        }
    };

    useEffect(() => {
        const handlePopUp = (e) => {
            if(popupRef.current && !popupRef.current.contains(e.target)){
                setShowPopup(false);
            }
        }

        if(showPopup){
            document.addEventListener("mousedown", handlePopUp);
        }
        return () => {
            document.removeEventListener("mousedown", handlePopUp);
        }
    }, [showPopup]);


    return (
        <div>
            <div className="add-problem-card">
                <p className="page-title">Add New Problem</p>
                <form onSubmit={addProblem}>
                    <label>
                        Title
                        <input
                        type="text"
                        value={title}
                        onChange={e => {
                            setTitle(e.target.value)
                            setResponse('')
                            setError('')
                        }}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Link
                        <input
                        type="text"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Solution Code
                        <input
                        type="text"
                        value={solutionCode}
                        onChange={(e) => setSolutionCode(e.target.value)}    
                        onClick={() => setShowPopup(true)}
                        required
                        ></input>
                    </label>
                    <button type="submit">Add New Problem</button>
                    {response && <p style={{color:"green"}}>{response}</p>}
                    {error && <p style={{color:"red"}}>{error}</p>}
                </form>     
            </div>
            {showPopup && (
            <div className="popup-container">
                <div className="popup-box" ref={popupRef}>
                    <textarea 
                    placeholder='input solution code here'
                    className="editable" 
                    value={solutionCode}
                    onChange={(e) => setSolutionCode(e.target.value)}
                    />
                    <div className="button-group">                   
                        <div className="atCenter">    
                            <button onClick={() => setShowPopup(false)}>Close</button>
                         </div>
                    </div>
                </div>
            </div>)}
        </div>
    );
}