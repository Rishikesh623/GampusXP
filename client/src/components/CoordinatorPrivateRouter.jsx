import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CoordinatorPrivateRouter = ({ children }) => {
  const user = useSelector(state => {
    return state.email;
  });
  // console.log(user);
  return (user === "coordinator@gmail.com"  )? children : <Navigate to="/404" />;

};

export default CoordinatorPrivateRouter;
