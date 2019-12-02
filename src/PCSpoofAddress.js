const TestingParse = require('parse/node');


const defaultRadius = 1;

class PCSpoofAddress {
	constructor() {
		// Empty Constructor
		// default to 1 mile
		this.radius = defaultRadius;
	}

	// Location Metadata
	latitude(input) {
		this.latitudeValue = input;
	}

	longitude(input) {
		this.longitudeValue = input;
	}

	static _generateRandomFloat(min, max, decimals) {
		// Truly random
		// https://gist.github.com/naomik/6030653
		return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
	}
	static spoof(params){
		// static randomPointWithInRadiusInMiles(centerGeo, radiusInput) {
		let centerGeo = PCSpoofAddress.geoPoint(params.lat, params.long);
		let radiusFromParams = params.radius;
		let radius;
		if (radiusFromParams) {
			radius = radiusFromParams
		}else {
			radius = defaultRadius
		}
		// Lat is about 69 miles apart always
		// Long are about 69 miles apart at the equator
		// Long in 0 miles at the north pole
		// https://www.thoughtco.com/degree-of-latitude-and-longitude-distance-4070616
		let radius;

		if (radiusInput) {
			radius = radiusInput;
		} else {
			radius = defaultRadius;
		}

		const aboutOneMileInDegrees = 1 / 69;
		const radiusInDegrees = aboutOneMileInDegrees * radius;

		let randomGeo;
		let distance;
		// Why a do-while?
		// the 1/69 is an esimate so we check that
		// the dot actually falls within the radius

		do {
			const latDelta = PCAddressPreview._generateRandomFloat(-radiusInDegrees, radiusInDegrees, 6);
			const longDelta = PCAddressPreview._generateRandomFloat(-radiusInDegrees, radiusInDegrees, 6);

			const randLat = centerGeo.latitude + latDelta;
			const randLong = centerGeo.longitude + longDelta;

			randomGeo = PCSpoofAddress.geoPoint(randLat, randLong);

			distance = centerGeo.milesTo(randomGeo);
		} while (distance > radius || distance < 0.02);

		// Make sure the point in within the X mile radius
		// and not within 0.02 miles (105.6 feet) of the house.
		// (a spoof is usless if its right on the house)
		return randomGeo;
	}

	static geoPoint(lat, long) {
		if (typeof Parse !== 'undefined') {
			/* global Parse */
			return new Parse.GeoPoint(lat, long);
		}

		return new TestingParse.GeoPoint(lat, long);
	}
}

module.exports = PCSpoofAddress;
