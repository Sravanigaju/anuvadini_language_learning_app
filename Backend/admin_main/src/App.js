import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './sceens/auth/sign-in';
import SignUp from './sceens/auth/sign-up';
import DashAnalytics from './sceens/dashboard/dashboard';

import RegisterInstitution from './sceens/auth/RegisterInstitution';
import RegisterValidator from './sceens/auth/RegisterValidator';
import RegisterCreator from './sceens/auth/RegisterCreator';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter basename="/auth">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<DashAnalytics />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/register/institution" element={<RegisterInstitution />} />
        <Route path="/register/validator" element={<RegisterValidator />} />
        <Route path="/register/creator" element={<RegisterCreator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
