import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchFlights } from '../api/flights';
import './FlightSearch.css';

// Demo data for when backend is not available
const DEMO_FLIGHTS = [
    { id: 1, airline: 'SkyWing Air', flightNo: 'SW101', departure: 'ICN', arrival: 'NRT', departureTime: '08:30', arrivalTime: '11:00', duration: '2h 30m', price: 189000, seats: 42 },
    { id: 2, airline: 'SkyWing Air', flightNo: 'SW201', departure: 'ICN', arrival: 'NRT', departureTime: '13:15', arrivalTime: '15:45', duration: '2h 30m', price: 215000, seats: 18 },
    { id: 3, airline: 'SkyWing Air', flightNo: 'SW305', departure: 'ICN', arrival: 'NRT', departureTime: '18:40', arrivalTime: '21:10', duration: '2h 30m', price: 175000, seats: 67 },
    { id: 4, airline: 'SkyWing Air', flightNo: 'SW102', departure: 'ICN', arrival: 'KIX', departureTime: '07:00', arrivalTime: '09:15', duration: '2h 15m', price: 165000, seats: 35 },
    { id: 5, airline: 'SkyWing Air', flightNo: 'SW410', departure: 'ICN', arrival: 'BKK', departureTime: '10:20', arrivalTime: '14:50', duration: '5h 30m', price: 285000, seats: 23 },
    { id: 6, airline: 'SkyWing Air', flightNo: 'SW510', departure: 'GMP', arrival: 'CJU', departureTime: '09:00', arrivalTime: '10:10', duration: '1h 10m', price: 68000, seats: 89 },
];

export default function FlightSearch() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [departure, setDeparture] = useState(searchParams.get('departure') || '');
    const [arrival, setArrival] = useState(searchParams.get('arrival') || '');
    const [date, setDate] = useState(searchParams.get('date') || '');
    const [passengers, setPassengers] = useState(1);

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [sortBy, setSortBy] = useState('price');

    useEffect(() => {
        if (departure || arrival || date) {
            handleSearch();
        }
    }, []); // eslint-disable-line

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSearched(true);
        try {
            const res = await searchFlights({ departure, arrival, date, passengers });
            setFlights(res.data);
        } catch {
            // Use demo data when backend isn't available
            let filtered = DEMO_FLIGHTS;
            if (departure) filtered = filtered.filter(f => f.departure.toLowerCase().includes(departure.toLowerCase()));
            if (arrival) filtered = filtered.filter(f => f.arrival.toLowerCase().includes(arrival.toLowerCase()));
            setFlights(filtered);
        } finally {
            setLoading(false);
        }
    };

    const sortedFlights = [...flights].sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'time') return a.departureTime.localeCompare(b.departureTime);
        return 0;
    });

    const handleSelectFlight = (flight) => {
        navigate(`/booking/${flight.id}`, { state: { flight, passengers, date } });
    };

    return (
        <div className="page flight-search">
            <div className="container">
                <div className="page-header">
                    <h1>항공편 검색</h1>
                    <p>원하는 항공편을 찾아 예약까지 한번에</p>
                </div>

                {/* Search Form */}
                <form className="search-form glass" onSubmit={handleSearch}>
                    <div className="search-row">
                        <div className="search-field">
                            <label className="form-label">출발지</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="ICN"
                                value={departure}
                                onChange={(e) => setDeparture(e.target.value)}
                            />
                        </div>
                        <div className="search-field">
                            <label className="form-label">도착지</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="NRT"
                                value={arrival}
                                onChange={(e) => setArrival(e.target.value)}
                            />
                        </div>
                        <div className="search-field">
                            <label className="form-label">출발일</label>
                            <input
                                type="date"
                                className="form-input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="search-field search-field-sm">
                            <label className="form-label">승객 수</label>
                            <select
                                className="form-input"
                                value={passengers}
                                onChange={(e) => setPassengers(Number(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                    <option key={n} value={n}>{n}명</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg search-submit" disabled={loading}>
                            {loading ? '검색 중...' : '검색'}
                        </button>
                    </div>
                </form>

                {/* Results */}
                {searched && (
                    <div className="results-section animate-fade-in">
                        <div className="results-header">
                            <span className="results-count">
                                {flights.length > 0 ? `${flights.length}개의 항공편` : '검색 결과 없음'}
                            </span>
                            {flights.length > 0 && (
                                <div className="sort-group">
                                    <label>정렬:</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                                        <option value="price">가격 낮은 순</option>
                                        <option value="time">출발 시간 순</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flight-list">
                            {sortedFlights.map((flight, i) => (
                                <div
                                    key={flight.id}
                                    className="flight-card card"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                    onClick={() => handleSelectFlight(flight)}
                                >
                                    <div className="flight-info">
                                        <div className="flight-airline">
                                            <span className="airline-badge">SW</span>
                                            <div>
                                                <strong>{flight.airline}</strong>
                                                <span className="flight-no">{flight.flightNo}</span>
                                            </div>
                                        </div>

                                        <div className="flight-route">
                                            <div className="route-point">
                                                <span className="route-time">{flight.departureTime}</span>
                                                <span className="route-code">{flight.departure}</span>
                                            </div>
                                            <div className="route-line">
                                                <span className="route-duration">{flight.duration}</span>
                                                <div className="route-line-bar"></div>
                                                <span className="route-type">직항</span>
                                            </div>
                                            <div className="route-point">
                                                <span className="route-time">{flight.arrivalTime}</span>
                                                <span className="route-code">{flight.arrival}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flight-price-section">
                                        <span className="flight-seats">잔여 {flight.seats}석</span>
                                        <span className="flight-price">₩{flight.price.toLocaleString()}</span>
                                        <button className="btn btn-accent">선택</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
