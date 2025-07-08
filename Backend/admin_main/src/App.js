import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './sceens/auth/sign-in';
import SignUp from './sceens/auth/sign-up';
import Dashboard from './sceens/dashboard/dashboard';

import RegisterInstitution from './sceens/auth/RegisterInstitution';
import RegisterValidator from './sceens/auth/RegisterValidator';
import RegisterCreator from './sceens/auth/RegisterCreator';
import VerifyPhone from './sceens/auth/VerifyPhone'; // ✅ Import VerifyPhone

function App() {
  return (
    <BrowserRouter basename="/auth">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<RegisterInstitution />} />
        <Route path="/register/validator" element={<RegisterValidator />} />
        <Route path="/register/creator" element={<RegisterCreator />} />
        <Route path="/verify-phone" element={<VerifyPhone />} /> {/* ✅ Add this route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
