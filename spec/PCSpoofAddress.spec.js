const PCParseRunner = require('@panda-clouds/parse-runner');
let Parse;

describe('test', () => {
	const parseRunner = new PCParseRunner();

	parseRunner.projectDir(__dirname + '/..');
	parseRunner.injectCode(`
Parse.Cloud.define('challenge', request => {
  return 'everest';
});

const PCSpoofAddress = require('./PCSpoofAddress.js');
Parse.Cloud.define('searchAddressForString', request => {
	const spoofer = new PCSpoofAddress()
  return PCSpoofAddress.test()
});
Parse.Cloud.define('spoofCoordinates', request => {
  return PCSpoofAddress.spoof(request.params)
});
	`);

	beforeAll(async () => {
		Parse = await parseRunner.startParseServer();
	}, 1000 * 60 * 2);

	afterAll(async () => {
		await parseRunner.cleanUp();
	});

	it('should connect to parse server', async () => {
		expect.assertions(1);

		const result = await Parse.Cloud.run('challenge');

		expect(result).toBe('everest');
	});

	it('should pass stringValue', async () => {
		expect.assertions(1);

		

		for (let x = 0; x < 500; x++) {

				// Bamboozle up a Geo-Point
				let lat = 33.417847
				let long = -111.960097
				const knownHouseGeo = Parse.geoPoint(lat,long );
				const spoofGeo = await Parse.Cloud.run('spoofCoordinates', { "lat":lat,"long":long});

				const spoofDelta = knownHouseGeo.milesTo(spoofGeo);

				// the spoof geo should be within 1 mile of our house
				expect(spoofDelta).not.toBeLessThan(0.02);
				expect(spoofDelta).not.toBeGreaterThan(1);
			}
	});
});
