import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import ApplicantRegister from './pages/applicant/Register'
import ApplicantDashboard from './pages/applicant/Dashboard'
import ResumeAnalyzer from './pages/applicant/ResumeAnalyzer'
import RelatedJobs from './pages/applicant/RelatedJobs'
import EligibilityChecker from './pages/applicant/EligibilityChecker'
import RecruiterRegister from './pages/recruiter/Register'
import RecruiterDashboard from './pages/recruiter/Dashboard'
import RecruiterApplicants from './pages/recruiter/Applicants'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'

function PrivateRoute({ children, role }) {
  const storedRole = localStorage.getItem('role')
  const token = localStorage.getItem('token')
  if (!token || storedRole !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Applicant */}
        <Route path="/applicant/register" element={<ApplicantRegister />} />
        <Route path="/applicant/dashboard" element={
          <PrivateRoute role="applicant"><ApplicantDashboard /></PrivateRoute>
        } />
        <Route path="/applicant/resume" element={
          <PrivateRoute role="applicant"><ResumeAnalyzer /></PrivateRoute>
        } />
        <Route path="/applicant/jobs" element={
          <PrivateRoute role="applicant"><RelatedJobs /></PrivateRoute>
        } />
        <Route path="/applicant/eligibility" element={
          <PrivateRoute role="applicant"><EligibilityChecker /></PrivateRoute>
        } />

        {/* Recruiter */}
        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route path="/recruiter/dashboard" element={
          <PrivateRoute role="recruiter"><RecruiterDashboard /></PrivateRoute>
        } />
        <Route path="/recruiter/applicants" element={
          <PrivateRoute role="recruiter"><RecruiterApplicants /></PrivateRoute>
        } />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
