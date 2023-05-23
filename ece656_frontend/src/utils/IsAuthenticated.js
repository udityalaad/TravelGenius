import { Navigate } from 'react-router-dom';
const isAuthenticated = function(Component) {
    const role = localStorage.getItem('ece656_role')
    return role != null;
}

export default isAuthenticated;
