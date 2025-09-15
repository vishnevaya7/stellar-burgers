import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import '../../index.css';
import styles from './app.module.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: Добавить логику проверки авторизации
  const isAuthenticated = false; // заменить на реальную проверку из стора
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return <>{children}</>;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* основные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* защищенные маршруты */}
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
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
