const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KOMReviewGeneralLogic = require('./ui-logic.js').default;

describe('KOMReviewGeneral_Misc', function () {

	describe('KOMReviewGeneralUpcomingDateBarTable', function test_KOMReviewGeneralUpcomingDateBarTable() {

		before(function () {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewGeneralUpcomingData: JSON.stringify([{
					KOMReviewChartElementDateBarTableRowDataKey: 'alfa',
					KOMReviewChartElementDateBarTableRowDataValues: [1, 2],
				}]),
			});
		});

		context('KOMReviewGeneralUpcomingDateBarTableData', function () {
			
			it('creates KOMReviewGeneralTableDays elements', function () {
				browser.assert.elements(`${ KOMReviewGeneralUpcomingDateBarTable } .KOMReviewChartElementDateBarTableRow`, 1);
			});

			context('KOMReviewChartElementDateBarTableRow', function () {
				
				it('sets KOMReviewChartElementDateBarTableRowDataKey', function () {
					browser.assert.text(`${ KOMReviewGeneralUpcomingDateBarTable } .KOMReviewChartElementDateBarTableRow .KOMReviewChartElementDateBarTableRowKey`, 'alfa');
				});
				
				it('sets KOMReviewChartElementDateBarTableRowDataValues', function () {
					browser.assert.elements(`${ KOMReviewGeneralUpcomingDateBarTable } .KOMReviewChartElementDateBarTableRow .KOMReviewChartElementHorizontalStackedBarSection`, 2);
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
				KOMReviewGeneralHistoricalData: JSON.stringify([{
					KOMReviewChartElementDateBarTableRowDataKey: 'alfa',
					KOMReviewChartElementDateBarTableRowDataValues: [1, 2, 3, 4],
				}]),
			});
		});

		context('KOMReviewGeneralHistoricalDateBarTableData', function () {
			
			it('creates KOMReviewGeneralTableDays elements', function () {
				browser.assert.elements(`${ KOMReviewGeneralHistoricalDateBarTable } .KOMReviewChartElementDateBarTableRow`, 1);
			});

			context('KOMReviewChartElementDateBarTableRow', function () {
				
				it('sets KOMReviewChartElementDateBarTableRowDataKey', function () {
					browser.assert.text(`${ KOMReviewGeneralHistoricalDateBarTable } .KOMReviewChartElementDateBarTableRow .KOMReviewChartElementDateBarTableRowKey`, 'alfa');
				});
				
				it('sets KOMReviewChartElementDateBarTableRowDataValues', function () {
					browser.assert.elements(`${ KOMReviewGeneralHistoricalDateBarTable } .KOMReviewChartElementDateBarTableRow .KOMReviewChartElementHorizontalStackedBarSection`, 4);
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

		const item = {
			KOMSpacingGroupingTotal: 1,
			KOMSpacingGroupingUnseen: 2,
			KOMSpacingGroupingDeveloping: 3,
			KOMSpacingGroupingMature: 4,
			KOMSpacingGroupingRetired: 5,
		};

		before(function () {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewChartCompositionCollectionData: JSON.stringify(item),
			});
		});

		it('sets KOMReviewChartCompositionCollectionData', function () {
			browser.assert.text('.KOMReviewChartCompositionCollection .KOMReviewChartCompositionCollectionTotalCardsValue', item.KOMSpacingGroupingTotal);
			browser.assert.text('.KOMReviewChartCompositionCollection .KOMReviewChartCompositionCollectionUnseenCardsValue', item.KOMSpacingGroupingUnseen);
			browser.assert.text('.KOMReviewChartCompositionCollection .KOMReviewChartCompositionCollectionDevelopingCardsValue', item.KOMSpacingGroupingDeveloping);
			browser.assert.text('.KOMReviewChartCompositionCollection .KOMReviewChartCompositionCollectionMatureCardsValue', item.KOMSpacingGroupingMature);
			browser.assert.text('.KOMReviewChartCompositionCollection .KOMReviewChartCompositionCollectionRetiredCardsValue', item.KOMSpacingGroupingRetired);
		});

		it('sets KOMReviewChartElementHorizontalStackedBarColors', function () {
			KOMReviewGeneralLogic.KOMReviewGeneralCollectionColors().forEach(function (e, i) {
				browser.assert.attribute(`.KOMReviewChartCompositionCollection .KOMReviewChartElementHorizontalStackedBarSection:nth-child(${ i + 1 })`, 'fill', e);
			})
		});

	});

});
