import axios from "axios"

const API = import.meta.env.VITE_API_URL;

export const getDueToday = (token) => {
    return axios.get(`${API}/api/problems/due-today`,
        {headers : {Authorization : `Bearer ${token}`}}
    );
}

export const getFututeReview = (token) => {
    return axios.get(`${API}/api/problems/future-review`,
        {headers : {Authorization : `Bearer ${token}`}}
    );
}

export const getOverdue = (token) => {
    return axios.get(`${API}/api/problems/overdue`,
        {headers : {Authorization : `Bearer ${token}`}}
    );
}

export const getFullyReviewed = (token) => {
    return axios.get(`${API}/api/problems/fully-reviewed`,
        {headers : {Authorization : `Bearer ${token}`}}
    );
}

export const getAllProblems = (token) => {
    return axios.get(`${API}/api/problems/all-problems`,
        {headers : {Authorization : `Bearer ${token}`}}
    );
}

export const updateProblem = (problemId, solution, token) => {
    return axios.put(`${API}/api/problems/${problemId}/update`,
        {solution},
        {headers : {Authorization : `Bearer ${token}`}}
    );
}

export const deleteProblem = (problemId, token) => {
    return axios.delete(`${API}/api/problems/${problemId}/delete`,
        {headers:{Authorization: `Bearer ${token}`}}
    );
}

export const addProblem = (pb, token) => {
    return axios.post(`${API}/api/problems/add`,
        pb,
        {headers:{Authorization: `Bearer ${token}`}}
    );
}

export const markReview = (problemId, token) => {
    return axios.post(`${API}/api/problems/${problemId}/reviewed`,
        {headers : {Authorization : `Bearer ${token}`}}
    );
}

export const resetReview = (problemId, token) => {
    return axios.post(`${API}/api/problems/${problemId}/reset`,
        {headers : {Authorization : `Bearer ${token}`}}
    );
}