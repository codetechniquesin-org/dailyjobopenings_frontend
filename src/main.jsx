import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import JobPostForm from './admin_pages/job_posting.jsx'
import ViewJob from './user_pages/viewjob.jsx'
import About from './user_pages/about.jsx'
import Contact from './user_pages/contactus.jsx'
import Privacy from './user_pages/privacy.jsx'
import Advertise from './user_pages/advertise_with_us.jsx'
import ResourcesPage from './user_pages/ResourcesPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/post-job" element={<JobPostForm />} />
        <Route path="/view-job/:slug" element={<ViewJob />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/advertise-with-us" element={<Advertise />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)