import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './sceens/auth/sign-in';
import Dashboard from './sceens/dashboard/dashboard';
import SignUp from './sceens/auth/sign-up';

function App() {
  return (
    <BrowserRouter basename="/auth">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
