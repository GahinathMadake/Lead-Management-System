import { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth pages
import LoginSignUpLayout from './components/common/LoginSignUpLayout';
import { LoginForm } from '@/pages/auth/login-form';
import { SignUpForm } from './pages/auth/signup-form';
import PasswordForgot from './pages/auth/forgot-password';
import NotFound from './pages/NotFound';

// User page
import LandingPage from './pages/LandingPage';
import Feature from './pages/Feature';

// Context
import { useUser } from './context/authContext';
import Loading from './components/common/Loading';
import LeadsPage from './pages/LeadPage';
import AddReview from './pages/AddReview';

function App() {

  async function fetchAppStatus(){
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getApp`);
      console.log(response);
    } catch (error) {
      console.error('Error fetching app status:', error);
    }
  }

  useEffect(()=>{
    fetchAppStatus();
  }, []);


  const { loading } = useUser();

  if(loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    )
  } 

  return (
    <>
      <Router>
        
        <Routes>
          <Route path="/login" element={<LoginSignUpLayout><LoginForm /></LoginSignUpLayout>} />
          <Route path="/sign-up" element={<LoginSignUpLayout><SignUpForm /></LoginSignUpLayout>} />
          <Route path="/forgot-password" element={<LoginSignUpLayout><PasswordForgot /></LoginSignUpLayout>} />
          

          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<Feature />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/add-review" element={<AddReview />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;