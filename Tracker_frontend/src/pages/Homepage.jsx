import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import '../App.css';
import AddNewProblem from "../components/AddNewProblem";
import DueToday from "./DueToday";
import AllProblems from "./AllProblems";
import { useAuth } from "../AuthContext"
import FutureReview from "./FutureReview";
import Overdue from "./Overdue";
import FullyReview from "./FullyReview";
import Dashboard from "./Dashboard";



const TABS = [{label: 'Dashboard', path: '/'},
              {label: 'Due Today', path: '/due-today'}, 
              {label: 'Future Review', path: '/future-review'}, 
              {label: 'Overdue', path: '/overdue'}, 
              {label: 'Fully Reviewed', path: '/fully-reviewed'}, 
              {label: 'All problems', path: '/all-problems'}];

export default function Homepage(){
  const { token, logout, username } = useAuth();
  const navigate = useNavigate();
  const [update, setUpdate] = useState(0);
  const path = useLocation().pathname;

  const onUpdate = () => {
    setUpdate(prev => prev + 1);
  }

  return (
      <>
        <div className="header">
          <h1>Leetcode Tracker</h1>
          <div className="button-group">
            {!token ? (
              <>
              <button onClick={() => navigate('/register')}>Sign up</button>
              <button onClick={() => navigate('/login')}>Log in</button>
              </>
            ) : (
              <>
              <p>{username}</p>
              <button onClick={logout}>Log out</button>
              </>
            )}  
          </div>
        </div>
        <div className="nav">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => navigate(`${tab.path}`)}
                className={path === tab.path ? 'active': ''}
              >{tab.label}</button>
            ))}
        </div> 
        <div className="review-problem-container">
          <div className="review-container">
            <Outlet />
          </div >
          <div className="add-problem-container">
            <AddNewProblem onUpdate={onUpdate}/>
          </div>
        </div>       
      </>
  );
}
