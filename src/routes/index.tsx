import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import AppLayout from '../components/app/layout/AppLayout';
import HomePage from '../pages/app/HomePage';
import LiveTV from '../pages/app/LiveTV';
import ProgramGuide from '../pages/app/ProgramGuide';
import Settings from '../pages/app/Settings';
import ShowsPage from '../pages/app/admin/ShowsPage';
import SchedulePage from '../pages/app/admin/SchedulePage';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'live',
        element: <LiveTV />,
      },
      {
        path: 'guide',
        element: <ProgramGuide />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'admin/shows',
        element: (
          <ProtectedRoute requireAdmin>
            <ShowsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/schedule',
        element: (
          <ProtectedRoute requireAdmin>
            <SchedulePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);