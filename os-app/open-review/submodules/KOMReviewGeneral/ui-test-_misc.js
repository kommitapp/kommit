const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KOMReviewGeneralLogic = require('./ui-logic.js').default;

describe('KOMReviewGeneral_Misc', function () {

	describe('KOMReviewGeneralUpcomingDateBarTable', function test_KOMReviewGeneralUpcomingDateBarTable() {

		before(function () {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewGeneralSpacings: JSON.stringify([
					StubSpacingObjectValid(),
					Object.assign(StubSpacingObjectValid(), {
						KOMSpacingInterval: 1,
						KOMSpacingDueDate: new Date(),
					}),
					Object.assign(StubSpacingObjectValid(), {
						KOMSpacingInterval: 21,
						KOMSpacingDueDate: new Date(),
					}),
					Object.assign(StubSpacingObjectValid(), {
						KOMSpacingInterval: 21,
						KOMSpacingDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
					}),
					Object.assign(StubSpacingObjectValid(), {
						KOMSpacingInterval: 21,
						KOMSpacingDueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
					}),
				].reduce(function (coll, item) {
					return coll.concat([item, Object.assign(Object.assign({}, item), {
						KOMSpacingID: item.KOMSpacingID.replace('forward', 'backward'),
					})]);
				}, [])),
			});
		});

		context('KOMReviewGeneralUpcomingDateBarTableData', function () {
			
			it('creates KOMReviewGeneralTableDays elements', function () {
				browser.assert.elements(`${ KOMReviewGeneralUpcomingDateBarTable } .KOMReviewChartElementDateBarTableRow`, KOMReviewGeneralLogic.KOMReviewGeneralTableDays());
			});

			context('KOMReviewChartElementDateBarTableRow', function () {
				
				it('sets KOMReviewChartElementDateBarTableRowDataKey', function () {
					browser.assert.text(`${ KOMReviewGeneralUpcomingDateBarTable } .KOMReviewChartElementDateBarTableRow .KOMReviewChartElementDateBarTableRowKey`, KOMReviewGeneralLogic.KOMReviewGeneralUpcomingDates().join(''));
				});
				
				it('sets KOMReviewChartElementDateBarTableRowDataValues', function () {
					browser.assert.elements(`${ KOMReviewGeneralUpcomingDateBarTable } .KOMReviewChartElementDateBarTableRow .KOMReviewChartElementHorizontalStackedBarSection`, KOMReviewGeneralLogic.KOMReviewGeneralUpcomingColors().length * KOMReviewGeneralLogic.KOMReviewGeneralTableDays());
				});
			
			});

			context('KOMReviewChartElementHorizontalStackedBar', function () {
				
				it('sets KOMReviewChartElementHorizontalStackedBarColors', function () {
					KOMReviewGeneralLogic.KOMReviewGeneralUpcomingColors().forEach(function (e, i) {
						browser.assert.attribute(`${ KOMReviewGeneralUpcomingDateBarTable } .KOMReviewChartElementDateBarTableRow:first-of-type .KOMReviewChartElementHorizontalStackedBarSection:nth-child(${ i + 1 })`, 'fill', e);
					})
				});
			
			});
		
		});

	});

	describe('KOMReviewGeneralHistoricalDateBarTable', function test_KOMReviewGeneralHistoricalDateBarTable() {

		before(function () {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewGeneralSpacings: JSON.stringify([
					StubSpacingObjectValid(),
					StubSpacingObjectHistorical(),
					Object.assign(StubSpacingObjectHistorical(), {
						KOMSpacingInterval: 1,
					}),
					Object.assign(StubSpacingObjectHistorical(), {
						KOMSpacingInterval: 21,
					}),
					StubSpacingObjectHistorical(new Date(Date.now() - 1000 * 60 * 60 * 24 * KOMReviewGeneralLogic.KOMReviewGeneralTableDays() * 2)),
				].reduce(function (coll, item) {
					return coll.concat([item, Object.assign(Object.assign({}, item), {
						KOMSpacingID: item.KOMSpacingID.replace('forward', 'backward'),
					})]);
				}, [])),
			});
		});

		context('KOMReviewGeneralHistoricalDateBarTableData', function () {
			
			it('creates KOMReviewGeneralTableDays elements', function () {
				browser.assert.elements(`${ KOMReviewGeneralHistoricalDateBarTable } .KOMReviewChartElementDateBarTableRow`, KOMReviewGeneralLogic.KOMReviewGeneralTableDays());
			});

			context('KOMReviewChartElementDateBarTableRow', function () {
				
				it('sets KOMReviewChartElementDateBarTableRowDataKey', function () {
					browser.assert.text(`${ KOMReviewGeneralHistoricalDateBarTable } .KOMReviewChartElementDateBarTableRow .KOMReviewChartElementDateBarTableRowKey`, KOMReviewGeneralLogic.KOMReviewGeneralHistoricalDates().join(''));
				});
				
				it('sets KOMReviewChartElementDateBarTableRowDataValues', function () {
					browser.assert.elements(`${ KOMReviewGeneralHistoricalDateBarTable } .KOMReviewChartElementDateBarTableRow .KOMReviewChartElementHorizontalStackedBarSection`, KOMReviewGeneralLogic.KOMReviewGeneralHistoricalColors() * KOMReviewGeneralLogic.KOMReviewGeneralTableDays());
				});
			
			});

			context('KOMReviewChartElementHorizontalStackedBar', function () {
				
				it('sets KOMReviewChartElementHorizontalStackedBarColors', function () {
					KOMReviewGeneralLogic.KOMReviewGeneralHistoricalColors().forEach(function (e, i) {
						browser.assert.attribute(`${ KOMReviewGeneralHistoricalDateBarTable } .KOMReviewChartElementDateBarTableRow:first-of-type .KOMReviewChartElementHorizontalStackedBarSection:nth-child(${ i + 1 })`, 'fill', e);
					})
				});
			
			});
		
		});

	});

	describe('KOMReviewChartCompositionCollection', function test_KOMReviewChartCompositionCollection() {

		before(function () {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewGeneralSpacings: JSON.stringify([
					StubSpacingObjectValid(),
					Object.assign(StubSpacingObjectValid(), {
						KOMSpacingInterval: 1,
					}),
					Object.assign(StubSpacingObjectValid(), {
						KOMSpacingInterval: 21,
					}),
				].reduce(function (coll, item) {
					return coll.concat([item, Object.assign(Object.assign({}, item), {
						KOMSpacingID: item.KOMSpacingID.replace('forward', 'backward'),
					})]);
				}, [])),
			});
		});

		it('sets KOMReviewChartCompositionCollectionData', function () {
			browser.assert.text('.KOMReviewChartCompositionCollection .KOMReviewChartCompositionCollectionTotalCardsValue', '1');
			browser.assert.text('.KOMReviewChartCompositionCollection .KOMReviewChartCompositionCollectionUnseenCardsValue', '1');
			browser.assert.text('.KOMReviewChartCompositionCollection .KOMReviewChartCompositionCollectionDevelopingCardsValue', '1');
			browser.assert.text('.KOMReviewChartCompositionCollection .KOMReviewChartCompositionCollectionMatureCardsValue', '1');
		});

		it('sets KOMReviewChartElementHorizontalStackedBarColors', function () {
			KOMReviewGeneralLogic.KOMReviewGeneralCollectionColors().forEach(function (e, i) {
				browser.assert.attribute(`.KOMReviewChartCompositionCollection .KOMReviewChartElementHorizontalStackedBarSection:nth-child(${ i + 1 })`, 'fill', e);
			})
		});

	});

});
