export function normalizeAirlineName(value) {
    return value && value !== 'SkyWing Air' ? value : 'MZC';
}

export function normalizeFlightNo(value) {
    return value ? String(value).replace(/^SW/, 'MZC') : value;
}

export function normalizeFlightBrand(flight) {
    if (!flight) {
        return flight;
    }

    return {
        ...flight,
        airline: normalizeAirlineName(flight.airline),
        flightNo: normalizeFlightNo(flight.flightNo),
    };
}
