const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KOMReviewGeneral: '.KOMReviewGeneral',

	KOMReviewGeneralUpcoming: '.KOMReviewGeneralUpcoming',
	KOMReviewGeneralUpcomingHeading: '.KOMReviewGeneralUpcomingHeading',
	KOMReviewGeneralUpcomingDateBarTable: '.KOMReviewGeneralUpcoming .KOMReviewChartElementDateBarTable',

	KOMReviewGeneralHistorical: '.KOMReviewGeneralHistorical',
	KOMReviewGeneralHistoricalHeading: '.KOMReviewGeneralHistoricalHeading',
	KOMReviewGeneralHistoricalDateBarTable: '.KOMReviewGeneralHistorical .KOMReviewChartElementDateBarTable',

	KOMReviewGeneralCollection: '.KOMReviewGeneralCollection',
	KOMReviewGeneralCollectionHeading: '.KOMReviewGeneralCollectionHeading',
}).map(function (e) {
	return global[e.shift()] = e.pop();
});

describe('KOMReviewGeneral_Access', function () {

	before(function () {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KOMReviewGeneral', function () {
		browser.assert.elements(KOMReviewGeneral, 1);
	});

	it('hides KOMReviewGeneralUpcoming', function () {
		browser.assert.elements(KOMReviewGeneralUpcoming, 0);
	});

	it('hides KOMReviewGeneralHistorical', function () {
		browser.assert.elements(KOMReviewGeneralHistorical, 0);
	});

	it('shows KOMReviewGeneralCollection', function () {
		browser.assert.elements(KOMReviewGeneralCollection, 1);
	});

	it('shows KOMReviewGeneralCollectionHeading', function () {
		browser.assert.elements(KOMReviewGeneralCollectionHeading, 1);
	});

	it('shows KOMReviewChartCompositionCollection', function () {
		browser.assert.elements('.KOMReviewChartCompositionCollection', 1);
	});

	context('upcoming', function () {
		
		before(function () {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewGeneralUpcomingData: JSON.stringify([{
					KOMReviewChartElementDateBarTableRowDataKey: 'alfa',
					KOMReviewChartElementDateBarTableRowDataValues: [1, 2],
				}]),
			});
		});

		it('shows KOMReviewGeneralUpcoming', function () {
			browser.assert.elements(KOMReviewGeneralUpcoming, 1);
		});

		it('shows KOMReviewGeneralUpcomingHeading', function () {
			browser.assert.elements(KOMReviewGeneralUpcomingHeading, 1);
		});

		it('shows KOMReviewGeneralUpcomingDateBarTable', function () {
			browser.assert.elements(KOMReviewGeneralUpcomingDateBarTable, 1);
		});
	
	});

	context('historical', function () {
		
		before(function () {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewGeneralHistoricalData: JSON.stringify([{
					KOMReviewChartElementDateBarTableRowDataKey: 'alfa',
					KOMReviewChartElementDateBarTableRowDataValues: [1, 2, 3, 4],
				}]),
			});
		});

		it('shows KOMReviewGeneralHistorical', function () {
			browser.assert.elements(KOMReviewGeneralHistorical, 1);
		});

		it('shows KOMReviewGeneralHistoricalHeading', function () {
			browser.assert.elements(KOMReviewGeneralHistoricalHeading, 1);
		});

		it('shows KOMReviewGeneralHistoricalDateBarTable', function () {
			browser.assert.elements(KOMReviewGeneralHistoricalDateBarTable, 1);
		});
	
	});

});
