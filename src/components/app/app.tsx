import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal, IngredientDetails, OrderInfo, AppHeader } from '@components';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIsAuthenticated,
  selectIsAuthChecked,
  checkUserAuth
} from '../../services/slices/authSlice';
import '../../index.css';
import styles from './app.module.css';

// только для авторизованных
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

//  для неавторизованных
const OnlyUnAuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }
  return <>{children}</>;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state && location.state.background;
  const isAuthChecked = useSelector(selectIsAuthChecked);
  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);
  if (!isAuthChecked) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* основные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* маршруты только для неавторизованных */}
        <Route
          path='/login'
          element={
            <OnlyUnAuthRoute>
              <Login />
            </OnlyUnAuthRoute>
          }
        />
        <Route
          path='/register'
          element={
            <OnlyUnAuthRoute>
              <Register />
            </OnlyUnAuthRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <OnlyUnAuthRoute>
              <ForgotPassword />
            </OnlyUnAuthRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <OnlyUnAuthRoute>
              <ResetPassword />
            </OnlyUnAuthRoute>
          }
        />

        {/* защищенные маршруты */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {/* модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
