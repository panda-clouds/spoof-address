class PCSpoofAddress {
	static _generateRandomFloat(min, max, decimals) {
		// Truly random
		// https://gist.github.com/naomik/6030653
		return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
	}

	static spoof(lat, long, radius = 1) {
		// static randomPointWithInRadiusInMiles(centerGeo, radiusInput) {
		const centerGeo = new Parse.GeoPoint(lat, long);

		const aboutOneMileInDegrees = 1 / 69;
		const radiusInDegrees = aboutOneMileInDegrees * radius;

		let randomGeo;
		let distance;
		// Why a do-while?
		// the 1/69 is an esimate so we check that
		// the dot actually falls within the radius

		do {
			const latDelta = PCSpoofAddress._generateRandomFloat(-radiusInDegrees, radiusInDegrees, 6);
			const longDelta = PCSpoofAddress._generateRandomFloat(-radiusInDegrees, radiusInDegrees, 6);

			const randLat = centerGeo.latitude + latDelta;
			const randLong = centerGeo.longitude + longDelta;

			randomGeo = new Parse.GeoPoint(randLat, randLong);

			distance = centerGeo.milesTo(randomGeo);
		} while (distance > radius || distance < 0.02);

		// Make sure the point in within the X mile radius
		// and not within 0.02 miles (105.6 feet) of the house.
		// (a spoof is usless if its right on the house)
		return randomGeo;
	}
}

module.exports = PCSpoofAddress;
