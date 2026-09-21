import { Navigate } from 'react-router-dom';

// Simulate an authentication check
const AuthRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token'); // Replace with your actual auth logic
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default AuthRoute;
