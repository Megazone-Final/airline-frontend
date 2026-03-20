import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchFlights } from '../api/flights';
import { AIRPORT_OPTIONS } from '../data/airports';
import './FlightSearch.css';

// Demo data for when backend is not available
const DEMO_FLIGHTS = [
    { id: 1, airline: 'SkyWing Air', flightNo: 'SW101', departure: 'ICN', arrival: 'NRT', departureTime: '08:30', arrivalTime: '11:00', duration: '2h 30m', price: 189000, seats: 42 },
    { id: 2, airline: 'SkyWing Air', flightNo: 'SW201', departure: 'ICN', arrival: 'NRT', departureTime: '13:15', arrivalTime: '15:45', duration: '2h 30m', price: 215000, seats: 18 },
    { id: 3, airline: 'SkyWing Air', flightNo: 'SW305', departure: 'ICN', arrival: 'NRT', departureTime: '18:40', arrivalTime: '21:10', duration: '2h 30m', price: 175000, seats: 67 },
    { id: 4, airline: 'SkyWing Air', flightNo: 'SW321', departure: 'ICN', arrival: 'NRT', departureTime: '21:25', arrivalTime: '23:55', duration: '2h 30m', price: 198000, seats: 29 },
    { id: 5, airline: 'SkyWing Air', flightNo: 'SW102', departure: 'ICN', arrival: 'KIX', departureTime: '07:00', arrivalTime: '09:15', duration: '2h 15m', price: 165000, seats: 35 },
    { id: 6, airline: 'SkyWing Air', flightNo: 'SW118', departure: 'ICN', arrival: 'KIX', departureTime: '11:50', arrivalTime: '14:05', duration: '2h 15m', price: 172000, seats: 44 },
    { id: 7, airline: 'SkyWing Air', flightNo: 'SW126', departure: 'ICN', arrival: 'KIX', departureTime: '19:20', arrivalTime: '21:35', duration: '2h 15m', price: 158000, seats: 21 },
    { id: 8, airline: 'SkyWing Air', flightNo: 'SW410', departure: 'ICN', arrival: 'BKK', departureTime: '10:20', arrivalTime: '14:50', duration: '5h 30m', price: 285000, seats: 23 },
    { id: 9, airline: 'SkyWing Air', flightNo: 'SW422', departure: 'ICN', arrival: 'BKK', departureTime: '16:05', arrivalTime: '20:40', duration: '5h 35m', price: 312000, seats: 16 },
    { id: 10, airline: 'SkyWing Air', flightNo: 'SW434', departure: 'ICN', arrival: 'BKK', departureTime: '20:10', arrivalTime: '00:45', duration: '5h 35m', price: 274000, seats: 31 },
    { id: 11, airline: 'SkyWing Air', flightNo: 'SW510', departure: 'GMP', arrival: 'CJU', departureTime: '09:00', arrivalTime: '10:10', duration: '1h 10m', price: 68000, seats: 89 },
    { id: 12, airline: 'SkyWing Air', flightNo: 'SW518', departure: 'GMP', arrival: 'CJU', departureTime: '12:35', arrivalTime: '13:45', duration: '1h 10m', price: 74000, seats: 53 },
    { id: 13, airline: 'SkyWing Air', flightNo: 'SW526', departure: 'GMP', arrival: 'CJU', departureTime: '18:10', arrivalTime: '19:20', duration: '1h 10m', price: 79000, seats: 36 },
    { id: 14, airline: 'SkyWing Air', flightNo: 'SW611', departure: 'CJU', arrival: 'GMP', departureTime: '08:15', arrivalTime: '09:25', duration: '1h 10m', price: 65000, seats: 71 },
    { id: 15, airline: 'SkyWing Air', flightNo: 'SW619', departure: 'CJU', arrival: 'GMP', departureTime: '14:20', arrivalTime: '15:30', duration: '1h 10m', price: 72000, seats: 48 },
    { id: 16, airline: 'SkyWing Air', flightNo: 'SW627', departure: 'CJU', arrival: 'GMP', departureTime: '20:35', arrivalTime: '21:45', duration: '1h 10m', price: 76000, seats: 27 },
    { id: 17, airline: 'SkyWing Air', flightNo: 'SW701', departure: 'NRT', arrival: 'ICN', departureTime: '09:40', arrivalTime: '12:20', duration: '2h 40m', price: 193000, seats: 38 },
    { id: 18, airline: 'SkyWing Air', flightNo: 'SW709', departure: 'NRT', arrival: 'ICN', departureTime: '15:10', arrivalTime: '17:50', duration: '2h 40m', price: 207000, seats: 24 },
    { id: 19, airline: 'SkyWing Air', flightNo: 'SW731', departure: 'KIX', arrival: 'ICN', departureTime: '10:00', arrivalTime: '12:10', duration: '2h 10m', price: 161000, seats: 33 },
    { id: 20, airline: 'SkyWing Air', flightNo: 'SW739', departure: 'KIX', arrival: 'ICN', departureTime: '17:30', arrivalTime: '19:40', duration: '2h 10m', price: 169000, seats: 25 },
    { id: 21, airline: 'SkyWing Air', flightNo: 'SW811', departure: 'BKK', arrival: 'ICN', departureTime: '01:20', arrivalTime: '08:45', duration: '5h 25m', price: 301000, seats: 19 },
    { id: 22, airline: 'SkyWing Air', flightNo: 'SW823', departure: 'BKK', arrival: 'ICN', departureTime: '11:05', arrivalTime: '18:30', duration: '5h 25m', price: 289000, seats: 28 },
    { id: 23, airline: 'SkyWing Air', flightNo: 'SW902', departure: 'ICN', arrival: 'CJU', departureTime: '07:45', arrivalTime: '08:55', duration: '1h 10m', price: 71000, seats: 61 },
    { id: 24, airline: 'SkyWing Air', flightNo: 'SW918', departure: 'ICN', arrival: 'CJU', departureTime: '17:15', arrivalTime: '18:25', duration: '1h 10m', price: 84000, seats: 34 },
];

export default function FlightSearch() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [departure, setDeparture] = useState(searchParams.get('departure') || '');
    const [arrival, setArrival] = useState(searchParams.get('arrival') || '');
    const [date, setDate] = useState(searchParams.get('date') || '');
    const [passengers, setPassengers] = useState(Number(searchParams.get('passengers') || 1));

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [sortBy, setSortBy] = useState('price');
    const [errors, setErrors] = useState({});

    const departureOptions = AIRPORT_OPTIONS.filter((option) => option.value !== arrival);
    const arrivalOptions = AIRPORT_OPTIONS.filter((option) => option.value !== departure);

    useEffect(() => {
        if (departure && arrival) {
            handleSearch();
        }
    }, []); // eslint-disable-line

    const validateSearch = () => {
        const nextErrors = {};

        if (!departure) {
            nextErrors.departure = '출발지를 선택하세요';
        }

        if (!arrival) {
            nextErrors.arrival = '도착지를 선택하세요';
        }

        if (departure && arrival && departure === arrival) {
            nextErrors.arrival = '도착지는 출발지와 달라야 합니다';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleDepartureChange = (value) => {
        setDeparture(value);
        setErrors((prev) => ({ ...prev, departure: '', arrival: '' }));
        if (value && value === arrival) {
            setArrival('');
        }
    };

    const handleArrivalChange = (value) => {
        setArrival(value);
        setErrors((prev) => ({ ...prev, departure: '', arrival: '' }));
        if (value && value === departure) {
            setDeparture('');
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!validateSearch()) {
            setFlights([]);
            setSearched(false);
            return;
        }

        const params = new URLSearchParams();
        params.set('departure', departure);
        params.set('arrival', arrival);
        if (date) params.set('date', date);
        params.set('passengers', String(passengers));
        navigate(`/flights?${params.toString()}`, { replace: true });

        setLoading(true);
        setSearched(true);
        try {
            const res = await searchFlights({ departure, arrival, date, passengers });
            setFlights(res.data);
        } catch {
            // Use demo data when backend isn't available
            let filtered = DEMO_FLIGHTS;
            filtered = filtered.filter((flight) => flight.departure === departure);
            filtered = filtered.filter((flight) => flight.arrival === arrival);
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
                            <select
                                className={`form-input ${errors.departure ? 'input-error' : ''}`}
                                value={departure}
                                onChange={(e) => handleDepartureChange(e.target.value)}
                            >
                                <option value="">출발지를 선택하세요</option>
                                {departureOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.departure && <span className="form-error">{errors.departure}</span>}
                        </div>
                        <div className="search-field">
                            <label className="form-label">도착지</label>
                            <select
                                className={`form-input ${errors.arrival ? 'input-error' : ''}`}
                                value={arrival}
                                onChange={(e) => handleArrivalChange(e.target.value)}
                            >
                                <option value="">도착지를 선택하세요</option>
                                {arrivalOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.arrival && <span className="form-error">{errors.arrival}</span>}
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
