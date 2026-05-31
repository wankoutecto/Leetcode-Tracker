import { useEffect, useState } from 'react';
import '../App.css';
import Popup from './popup';
import { formatDate } from '../utils/formatDate';

export default function ProblemCard({pb, onShowDescription, onShowSolution, slot}){
    const nextReviewDate = formatDate(pb.nextReviewDate);
    const lastReviewDate = formatDate(pb.lastReviewDate);
            

    return ( 
        <div className= "review-card">
            <div className="review-card-toLink">
                <span style={{ color: "#c7cf2b"}}>{pb.difficulty}</span>
            </div>

            <p className="page-title">{pb.title}</p>

            <br />

            <div className="info-line">
                <span>Description: </span>
                <button className="no-underline viewStyle" onClick={onShowDescription}>
                    Show
                </button>
            </div>

            <div className="info-line">
                <span>Next Review:</span>
                <span style={{ fontWeight: 700 }}>{formatDate(pb.nextReviewDate)}</span>
            </div>

            {pb.lastReviewDate && 
            <div className="info-line">
                <span>Last Review:</span>
                <span style={{ fontWeight: 700 }}>{formatDate(pb.lastReviewDate)}</span>
            </div>
            }

            <div className="info-line">
                <span>Review Left:</span>
                <span style={{ fontWeight: 700, 
                    color: pb.reviewLeft > 0 ? "red": "green" }}
                >{pb.reviewLeft}</span>
            </div>

            <div className="info-line">
                <span>Solution: </span>
                <button className="no-underline viewStyle" onClick={onShowSolution}>
                    Show
                </button>
            </div>
            <div className="info-line">
                <span>Link: </span>
                <a href={pb.url} target="_blank" rel="noopener noreferrer"className="no-underline viewStyle">
                    View on Leetcode
                </a>
            </div>
        
            <br />

            <div className="review-card-bottom">    
                {slot} 
            </div>

            
        </div>
    )
}