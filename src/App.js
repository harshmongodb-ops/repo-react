import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AuthRoute from './components/AuthRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import UsersListPage from './pages/UsersListPage';
import UserCreatePage from './pages/UserCreatePage';
import UserEditPage from './pages/UserEditPage';

// repo-react: user CRUD is wired to the ojt_backend API via axios, called
// directly from each page (no shared api/store module). Auth is a real JWT
// issued by POST /api/userdata/login and checked by AuthRoute.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<UserCreatePage />} />

        <Route
          path="/users"
          element={
            <AuthRoute>
              <Layout>
                <UsersListPage />
              </Layout>
            </AuthRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <AuthRoute>
              <Layout>
                <UserCreatePage />
              </Layout>
            </AuthRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <AuthRoute>
              <Layout>
                <UserEditPage />
              </Layout>
            </AuthRoute>
          }
        />

        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
