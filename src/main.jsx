import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
// import JobPostForm from './admin_pages/job_posting.jsx'
import ViewJob from './user_pages/viewjob.jsx'
import About from './user_pages/about.jsx'
import Contact from './user_pages/contactus.jsx'
import Privacy from './user_pages/privacy.jsx'
import Advertise from './user_pages/advertise_with_us.jsx'
import ResourcesPage from './user_pages/ResourcesPage.jsx'
import Jobcategories from './user_pages/jobcategeories.jsx'
import InterviewQuestionsPage from './user_pages/interviewquespage.jsx'
import AdminLogin from './admin/pages/adminlogin.jsx'
import AdminDashboard from './admin/pages/adminDashboard.jsx'
import Admins from './admin/pages/manageAdmins.jsx'
import ProtectedRoute from "./admin/components/ProtectedRoute";
import ManageJobs from './admin/pages/manageJobs.jsx'
import WalkInDrivesPage from './user_pages/walk_in_jobs.jsx'
import ManageResources from './admin/pages/manageResources.jsx'
import InterviewQues from './admin/pages/manageInterQues.jsx'
import ResetPassword from './admin/pages/resetPassword.jsx'
import ExamsPage from './user_pages/Exams.jsx'
import ViewExam from './user_pages/viewexam.jsx'
import WalkInJobDetail from './user_pages/viewWalkins.jsx'
import WalkInAdmin from './admin/pages/managewalkin.jsx';
import ManageExams from './admin/pages/manageExams.jsx';
import VerifyJobAlert from './components/common_components/verify_job_alert.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/view-job/:slug" element={<ViewJob />} />
        <Route path="/user/view-exams/:slug" element={<ViewExam />} />
        <Route path="/user/walkins/view-walkin/:walkinslug" element={<WalkInJobDetail />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/advertise-with-us" element={<Advertise />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/jobs/categories/:category" element={<Jobcategories />} />
        <Route path="/users/view-courses" element={<InterviewQuestionsPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/walk-in-drive" element={<WalkInDrivesPage/>}/>
        <Route path="/user/view-exams" element={<ExamsPage />} />
        <Route path="/user/verify-job-alert" element={<VerifyJobAlert />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/manage-jobs" element={<ProtectedRoute><ManageJobs /></ProtectedRoute>} />
        <Route path="/admin/manage-admins" element={<ProtectedRoute><Admins /></ProtectedRoute>} />
        <Route path="/admin/manage-resources" element={<ProtectedRoute><ManageResources /></ProtectedRoute>} />
        <Route path="/admin/manage-interview-questions" element={<ProtectedRoute><InterviewQues /></ProtectedRoute>} />
        <Route path="/admin/reset-password" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
        <Route path="/admin/manage-walkins" element={<ProtectedRoute><WalkInAdmin /></ProtectedRoute>} />
        <Route path="/admin/manage-exams" element={<ProtectedRoute><ManageExams /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)