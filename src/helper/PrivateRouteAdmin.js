import { Navigate, useLocation } from 'react-router-dom';
import  secureLocalStorage  from  "react-secure-storage";


function PrivateRoute({ children, ...rest }) {
    let location = useLocation();

    const token = localStorage.getItem('admintoken');
    let isLoggedIn = !!token;

    // If not logged in, redirect to some public route (like login)
    if (!isLoggedIn) {
        return <Navigate to="/admin" state={{ from: location }} replace />;
    }

    const userType = secureLocalStorage.getItem("user_type"); // Assuming 'userType' is the key in your payload

    if (userType === 1) {
        return children;
    } else {
        // For any other user type, redirect to appropriate route
        return <Navigate to="/admin" state={{ from: location }} replace />;
    }
}

export default PrivateRoute;