import '../App.css';
import { use, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../AuthContext"
import { isTokenValid } from '../utils/isTokenValid';
import Popup from './Popup';
import { addProblem } from '../service/ProblemService';


export default function AddNewProblem({onUpdate}){
    const {token, logout} = useAuth();
    const [title, setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [topics, setTopics] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [solution, setSolution] = useState('');
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [response, setResponse] = useState();
    const [textArea, setTextArea] = useState("");
    const textAreaRef = useRef(null);

    const [inputType, setInputType] = useState('');

    useEffect(() => {
        if(showPopup && textAreaRef.current){
            textAreaRef.current.focus();
        }
    }, [showPopup]);

    const onAddProblem = async(e) => {
        e.preventDefault();
       
        try{
            if(!token){
                alert("You are not login. Please login to add new problem");
                return;
            }
            const problem = {
                title,
                description,
                url,
                topics : topics.split(",").map(t=>t.trim()).filter(Boolean),
                difficulty,
                solution
            }
            
            const res = await addProblem(problem, token);
           
            if(res.status === 200){
                setTitle('');
                setUrl('');
                setDescription('');
                setDifficulty('');
                setTopics('');
                setSolution('');
                setResponse("New problem Added"); 
                setError("")
                onUpdate();
            }
        } catch (err) {
            if(err.response?.status === 401 || err.response?.status === 403){
                logout();
            }
            if(err.response?.status === 409){
                setError(err.response.data.message);
                
            }
            setResponse("");
            console.error(err)
        }
    };

    return (
        <div>
            <div className="add-problem-card">
                <p className="page-title">Add New Problem</p>
                <form onSubmit={onAddProblem}>
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
                        Description
                        <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onClick={() => {
                            setShowPopup(true),
                            setInputType("description"),
                            setTextArea(description)
                        }}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Link
                        <input
                        type="text"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Topic
                        <input
                        type="text"
                        value={topics}
                        onChange={e => setTopics(e.target.value)}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Difficulty
                        <input
                        type="text"
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value)}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Solution
                        <input
                        type="text"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        onClick={() => {
                            setShowPopup(true),
                            setInputType("solution"),
                            setTextArea(solution)
                        }}
                        required
                        ></input>
                    </label>
                    <button type="submit">Add New Problem</button>

                    {response && <p style={{color:"green"}}>{response}</p>}
                    {error && <p style={{color:"red"}}>{error}</p>}

                </form>     
            </div>
            {showPopup && 
                <Popup onClose={() => setShowPopup(false)}>
                    <textarea
                        ref={textAreaRef}
                        value={textArea}
                        onChange={(e) => {
                            const value = e.target.value;
                            setTextArea(value);

                            if (inputType === "description") {
                                setDescription(value);
                            }

                            if (inputType === "solution") {
                                setSolution(value);
                            }
                        }}
                    />
                    <div className="button-group">
                        <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </Popup>
            }
        </div>
    );
}