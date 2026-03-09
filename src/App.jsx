import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Register from './pages/Register';
import Login from './pages/Login';
import MyPage from './pages/MyPage';

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/flights" element={<FlightSearch />} />
                <Route path="/booking/:flightId" element={<Booking />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mypage" element={<MyPage />} />
            </Routes>
        </Layout>
    );
}
