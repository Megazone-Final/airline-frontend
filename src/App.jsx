import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Register from './pages/Register';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/flights" element={<FlightSearch />} />
                <Route path="/booking/:flightId" element={<Booking />} />
                <Route
                    path="/payment"
                    element={(
                        <ProtectedRoute>
                            <Payment />
                        </ProtectedRoute>
                    )}
                />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/mypage"
                    element={(
                        <ProtectedRoute>
                            <MyPage />
                        </ProtectedRoute>
                    )}
                />
            </Routes>
        </Layout>
    );
}
