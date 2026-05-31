import axios from "axios";
import { useEffect, useState } from "react";
import '../App.css';
import ProblemCard from '../components/ProblemCard';
import { useAuth } from "../AuthContext"
import { isTokenValid } from "../utils/isTokenValid";
import { useNavigate } from "react-router-dom";
import { getAllProblems, getDueToday, getFullyReviewed, getFututeReview, getOverdue } from "../service/ProblemService";
import AllProblems from "./AllProblems";


export default function Dashboard({activeTab, update, onUpdate, onMoveToTab}){
    const {token, logout} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allProblems, setAllProblems] = useState([]);
    const [pb, setPb] = useState('');
    const [dueToday, setDueToday] = useState(null);
    const [future, setFuture] = useState(null);
    const [overdue, setOverdue] = useState(null);
    const [fullyReviewed, setFullyReviewed] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const [dueRes, futureRes, overdueRes, fullyRes, allProblems] = await Promise.all([
                    getDueToday(token),
                    getFututeReview(token),
                    getOverdue(token),
                    getFullyReviewed(token),
                    getAllProblems(token)
                ]);
                
                setDueToday(dueRes.data.data);
                setFuture(futureRes.data.data);
                setOverdue(overdueRes.data.data);
                setFullyReviewed(fullyRes.data.data);
                setAllProblems(allProblems.data.data);

                

            } catch (err) {
                if (!isTokenValid(token)) {
                    logout();
                }
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCategories();

    }, [activeTab, update, token, logout]);
    

    if(loading) return <p>The page is loading...</p>
    if(error) return <p>Failed to fetch the data: {error.message}</p>

    return (
        <div className='grid-display' >
            <div onClick={() => navigate("/due-today")} className="dash-container">
                <h2>Due Today</h2>
                <h2>(<span style={{color: "red"}}> {dueToday?.length} </span>)</h2> 
            </div>

            <div onClick={() => navigate("/future-review")} className="dash-container">
                <h2>Future Review</h2>
                <h2>(<span style={{color: "red"}}> {future?.length} </span>)</h2> 
            </div>

            <div onClick={() => navigate("/overdue")} className="dash-container">
                <h2>Overdue</h2>
                <h2>(<span style={{color: "red"}}> {overdue?.length} </span>)</h2>   
            </div>

            <div onClick={() => navigate("/fully-reviewed")} className="dash-container">
                <h2>Fully Reviewed</h2>
                <h2>(<span style={{color: "green"}}> {fullyReviewed?.length} </span>)</h2>               
            </div>

            <div onClick={() => navigate("/all-problems")} className="dash-container">
                <h2>All Problems</h2>
                <h2>(<span style={{color: "blue"}}> {allProblems?.length} </span>)</h2>               
            </div>
        
        </div>
    );
}