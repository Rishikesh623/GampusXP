import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const user = useSelector(state => {
    return state.user;
  });
  console.log(user);
  return user.email ? children : <Navigate to="/signin" />;

};

export default PrivateRoute;
