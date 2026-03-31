import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ApplicationStatus } from './pages/ApplicationStatus';
import { NewApplication } from './pages/NewApplication';
import {KYCPage} from '../src/pages/KYCPage'

function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/new-application"
        element={
          <ProtectedRoute>  
            <NewApplication />
          </ProtectedRoute>
        }
      />

      <Route
        path="/status/:id"
        element={
          <ProtectedRoute>
            <ApplicationStatus />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/kyc/:id"
        element={
          <ProtectedRoute>
            <KYCPage />
          </ProtectedRoute>
        }
      />

    

    </Routes>
  );
}

export default App;