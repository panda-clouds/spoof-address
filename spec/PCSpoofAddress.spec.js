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

		const results = await Parse.Cloud.run('spoofCoordinates', { "lat":-111.3452345,"long":86.234523 });

		expect(results).toBe...
	});
});
