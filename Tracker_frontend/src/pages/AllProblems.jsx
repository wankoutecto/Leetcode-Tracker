import { useEffect, useState } from 'react';
import '../App.css'
import axios from 'axios';
import { useAuth } from "../AuthContext"
import { isTokenValid } from '../utils/isTokenValid';
import { getAllProblems, deleteProblem } from '../service/ProblemService';
import { formatDate } from '../utils/formatDate';
import Popup from '../components/popup';
import { useProblemActions } from '../hooks/useProblemActions';



export default function AllProblems(){
    const {token, logout} = useAuth();
    const [problemList, setProblemList] = useState([]);
    const [searchProblem, setSearchProblem] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [title, setTitle] = useState('');
    const [problemId, setProblemId] = useState('');
    const [refresh, setRefresh] = useState(0);
    const [showPopUp, setShowPopUp] = useState(false);
    const problemActions = useProblemActions(token, () => {
        setRefresh(prev => prev + 1);
    });

    const onUpdate = () => {
        setRefresh(prev => prev + 1);
    }

    const fetchProblem = async() => {
        try {
            const res = await getAllProblems(token);
            setProblemList(res.data.data);
        } catch (err) {
            if(err.response?.status === 403 || err.response?.status === 401){
                logout();
            }
        }
    };

    useEffect(() => {
        fetchProblem();
    }, [token, logout, refresh]);

    const handleInput = (e) => {
        setSearchProblem(e.target.value.toLowerCase());
    };

    const isNumber = (title) => {
        if (!title) return null;
        const part = Number(title.split(".")[0]);
        return !Number.isNaN(part) ? part : null;
    }

    const sortProblems = [...problemList].sort((a, b) => {

        const numA = isNumber(a?.title);
        const numB = isNumber(b?.title);

        if (numA !== null && numB !== null) {
            return numA - numB;
        }

        const titleA = a?.title ?? "";
        const titleB = b?.title ?? "";

        return titleA.localeCompare(titleB);
    });

    const filterProblem = sortProblems.filter(pb => 
        pb?.title?.toLowerCase().includes(searchProblem)
    );

    const onClose = () => {
        setShowPopUp(false);
    }

    const onDeleteProblem = async(pbId) => {
        try {
            const res = await deleteProblem(pbId, token);
            if(res.status === 200){
                onUpdate();
            }     
        } catch (err) {
            if(err.response?.status === 401 || err.response?.status === 403){
                logout();
            }
            console.error(err);
        }finally{
            setShowPopUp(false);
        }
    };
        


    return (
       <div >
        <h1>All Problems</h1>
        <form className='search-problem' onSubmit={e => e.preventDefault()}>
            <button>🔍</button>
            <input 
            placeholder='Search Problem By Title'
            value={searchProblem}
            onChange={handleInput}
            ></input>
            
        </form>
        <table>
            <thead>
               <tr className='title'>
                <th>Title</th>
                <th>Link To LeetCode</th>
                <th >Next Review</th>
                <th >Last Review</th> 
                <th>Review Left</th>
                <th></th>
               </tr> 
            </thead>
            <tbody>
                {filterProblem.map((pb) => (
                    <tr key={pb.title}>
                        <td className='title'>{pb.title}</td>
                        <td>
                            <a href={pb.url} 
                            target='_blank' 
                            rel='noopener noreferrer'
                            className='delete'
                            >Link</a>
                        </td>
                        <td style={{color: pb.nextReviewDate === null && "green"}}>{formatDate(pb?.nextReviewDate)}</td> 
                        <td>{formatDate(pb.lastReviewDate)}</td> 
                        <td style={{color: pb.reviewLeft > 0 ? "red" : "green"}} >{pb.reviewLeft}</td>
                        <td className='delete' onClick={() => {
                                setTitle(pb.title); 
                                setProblemId(pb.id);
                                setShowPopUp(true);
                            }} 
                        >Delete</td>

                    </tr>
                ))}
            </tbody>
        </table>

        {showPopUp && 
            <Popup onClose={onClose} >
                <p>{title}</p>
                <div className="button-group">
                    <button onClick={() => onDeleteProblem(problemId)}>Delete</button>
                    <button onClick={() => setShowPopUp(false)} >Cancel</button>
                </div>  
            </Popup>
        }

       </div> 
    );
}