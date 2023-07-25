import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children, ...rest }) {
    let location = useLocation();
    
    let isLoggedIn = !!localStorage.getItem('token'); 

    return isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

export default PrivateRoute;
