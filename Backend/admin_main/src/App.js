import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './sceens/auth/sign-in';
import Dashboard from './sceens/dashboard/dashboard';

function App() {
  return (
    <BrowserRouter basename="/auth">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
