import { useEffect, useState } from 'react';
import '../App.css'
import axios from 'axios';
import ProblemCard from '../components/ProblemCard';
import { useAuth } from '../AuthContext';
import { isTokenValid } from '../utils/isTokenValid';
import { getDueToday } from '../service/ProblemService';
import { useProblemActions } from '../hooks/useProblemActions';
import { ActionButton } from '../components/ActionButton';
import Popup from '../components/popup';
import { MessageRenderer} from '../components/MessageRenderer';

export default function DueToday(){
    const {token, logout} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [problemList, setProblemList] = useState([]);
    const [refresh, setRefresh] = useState(0);

    const problemEditor = useProblemActions(token, () => {
        setRefresh(prev => prev + 1);
    });

    const onUpdate = () => {
        setRefresh(prev => prev + 1);
    }    

    const fetchProblem = async() => {
        try {
            const res = await getDueToday(token);
            if(res.status === 200){
                setProblemList(res.data.data);
            }     
        }catch (err) {
            if(!isTokenValid(token)){
                logout();
            }
            setError(err);
        }finally{
            setLoading(false);
        }
    };
        
    useEffect(() => {
        fetchProblem();
    }, [token, logout, refresh]);

    
    if(loading) return <p>The page is loading...</p>
    if(error) return <p>Failed to fetch the data: {error.message}</p>

    
    
    return (
    <>
    {problemList.length !== 0 ? 
        <div className='grid-display'>
            {problemList.map((pb) => (
                <ProblemCard
                    key={pb.id}
                    pb={pb}
                    onShowDescription={() =>
                        problemEditor.actions.onOpenProblem(pb.id, pb.description, "text")
                    }
                    onShowSolution={() =>
                        problemEditor.actions.onOpenProblem(pb.id, pb.solution, "code")
                    }
                    slot={
                        <ActionButton
                            pb={pb}
                            onAction={() => problemEditor.actions.onMarkReview(pb.id)}
                            label="Mark Review"
                        />
                    }
                />
            ))}
        </div> :
        <p>NO Problems Due Today</p>
    }

    {problemEditor.active && (
        <Popup
            onClose={problemEditor.actions.onClose}
        >
            <MessageRenderer
                active={problemEditor.active}
                isEditing={problemEditor.isEditing}
                actions={problemEditor.actions}
            />
        </Popup>
    )}
    </>
    );
}

