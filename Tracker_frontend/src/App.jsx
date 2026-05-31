import { Navigate, Route, Routes} from "react-router-dom";
import { useAuth } from './AuthContext'
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FakeHomepage from "./pages/FakeHomepage";
import DueToday from "./pages/DueToday";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import FutureReview from "./pages/FutureReview";
import Overdue from "./pages/Overdue";
import FullyReview from "./pages/FullyReview";
import AllProblems from "./pages/AllProblems";
import ProtectedRoute from "./components/ProtectedRoute";
import Popup from "./components/popup";


export default function App(){

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="due-today" element={<DueToday />} />
        <Route path="future-review" element={<FutureReview />} />
        <Route path="overdue" element={<Overdue />} />
        <Route path="fully-reviewed" element={<FullyReview />} />
        <Route path="all-problems" element={<AllProblems />} />
      </Route>
          
      <Route path="/public" element={<FakeHomepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/popup" element={<Popup />} />
    </Routes>
  );
}