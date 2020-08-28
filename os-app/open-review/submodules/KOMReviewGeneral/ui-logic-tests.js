const { throws, deepEqual } = require('assert');

const mainModule = require('./ui-logic.js').default;

const KOMSharedLogic = require('../../../_shared/KOMSharedLogic/main.js').default;

const uGroup = function (param1, param2 = []) {
	const outputData = {};
	
	outputData[KOMSharedLogic.KOMSharedGroupingDay(param1)] = [].concat(param2);

	return outputData;
};

describe('KOMReviewGeneralTableDays', function test_KOMReviewGeneralTableDays() {

	it('returns number', function () {
		deepEqual(mainModule.KOMReviewGeneralTableDays(), 7);
	});

});

describe('KOMReviewGeneralHistoricalDates', function test_KOMReviewGeneralHistoricalDates() {

	it('returns array', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalDates(), Array.from(Array(mainModule.KOMReviewGeneralTableDays())).map(function (e, i) {
			return KOMSharedLogic.KOMSharedGroupingDay(new Date(Date.now() - 1000 * 60 * 60 * 24 * i));
		}));
	});

});

describe('KOMReviewGeneralHistoricalFilter', function test_KOMReviewGeneralHistoricalFilter() {

	const offset = (function (inputData) {
		return inputData < 10 ? `0${ inputData }` : inputData;
	})((new Date()).getTimezoneOffset() / 60);

	const uGroupingDate = function (inputData = 0) {
		return new Date(Date.parse(`${ KOMSharedLogic.KOMSharedGroupingDay(new Date()) }T04:00:00-${ offset }:00`) + inputData);
	};

	it('throws if not array', function () {
		throws(function () {
			mainModule.KOMReviewGeneralHistoricalFilter(null);
		}, /KOMErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalFilter([]), []);
	});

	it('excludes if unseen', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalFilter([StubSpacingObjectValid()]), []);
	});

	it('excludes if after today', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalFilter([StubSpacingObjectHistorical(uGroupingDate(1000 * 60 * 60 * 24))]), []);
	});

	it('excludes if before KOMReviewGeneralTableDays', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalFilter([StubSpacingObjectHistorical(uGroupingDate(-1000 * 60 * 60 * 24 * mainModule.KOMReviewGeneralTableDays() - 1))]), []);
	});

	it('includes if today', function () {
		const item = StubSpacingObjectHistorical(uGroupingDate());
		deepEqual(mainModule.KOMReviewGeneralHistoricalFilter([item]), [item]);
	});

	it('includes if KOMReviewGeneralTableDays', function () {
		const item = StubSpacingObjectHistorical(uGroupingDate(-1000 * 60 * 60 * 24 * mainModule.KOMReviewGeneralTableDays()));
		deepEqual(mainModule.KOMReviewGeneralHistoricalFilter([item]), [item]);
	});

});

describe('KOMReviewGeneralHistoricalGroupByDate', function test_KOMReviewGeneralHistoricalGroupByDate() {

	it('throws if not array', function () {
		throws(function () {
			mainModule.KOMReviewGeneralHistoricalGroupByDate(null);
		}, /KOMErrorInputNotValid/);
	});

	it('returns object', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalGroupByDate([]), {});
	});

	it('groups by date if single object', function () {
		const item = StubSpacingObjectHistorical();
		deepEqual(mainModule.KOMReviewGeneralHistoricalGroupByDate([item]), uGroup(item.KOMSpacingChronicles[0].KOMChronicleResponseDate, item));
	});

	it('groups by date if multiple objects', function () {
		const item1 = StubSpacingObjectHistorical(new Date('2019-04-12T00:00:00Z'));
		const item2 = StubSpacingObjectHistorical(new Date('2019-04-13T00:00:00Z'));

		deepEqual(mainModule.KOMReviewGeneralHistoricalGroupByDate([item1, item2]), Object.assign(uGroup(item1.KOMSpacingChronicles[0].KOMChronicleResponseDate, item1), uGroup(item2.KOMSpacingChronicles[0].KOMChronicleResponseDate, item2)));
	});

	it('groups by date if duplicate', function () {
		const item1 = StubSpacingObjectHistorical();
		const item2 = StubSpacingObjectHistorical();
		
		deepEqual(mainModule.KOMReviewGeneralHistoricalGroupByDate([item1, item2]), uGroup(item1.KOMSpacingChronicles[0].KOMChronicleResponseDate, [item1, item2]));
	});

	it('groups by date if multiple chronicle objects', function () {
		const item = Object.assign(StubSpacingObjectHistorical(), {
			KOMSpacingChronicles: [
				StubChronicleObjectValid(new Date('2019-04-12T00:00:00Z')),
				StubChronicleObjectValid(new Date('2019-04-13T00:00:00Z')),
			],
		});

		deepEqual(mainModule.KOMReviewGeneralHistoricalGroupByDate([item]), Object.assign(uGroup(item.KOMSpacingChronicles[0].KOMChronicleResponseDate, item), uGroup(item.KOMSpacingChronicles[1].KOMChronicleResponseDate, item)));
	});

	it('groups by date if multiple chronicle objects with duplicate date', function () {
		const item = Object.assign(StubSpacingObjectHistorical(), {
			KOMSpacingChronicles: [
				StubChronicleObjectValid(new Date('2019-04-12T00:00:00Z')),
				StubChronicleObjectValid(new Date('2019-04-12T00:00:00Z')),
			],
		});

		deepEqual(mainModule.KOMReviewGeneralHistoricalGroupByDate([item]), Object.assign(uGroup(item.KOMSpacingChronicles[0].KOMChronicleResponseDate, item)));
	});

});

describe('KOMReviewGeneralHistoricalTotalMilliseconds', function test_KOMReviewGeneralHistoricalTotalMilliseconds() {

	it('throws if not array', function () {
		throws(function () {
			mainModule.KOMReviewGeneralHistoricalTotalMilliseconds(null);
		}, /KOMErrorInputNotValid/);
	});

	it('returns number', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalTotalMilliseconds([]), 0);
	});

	it('counts single', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalTotalMilliseconds([StubChronicleObjectValid()]), 10000);
	});

	it('counts multiple', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalTotalMilliseconds([StubChronicleObjectValid(), StubChronicleObjectValid()]), 20000);
	});

});

describe('KOMReviewGeneralHistoricalColors', function test_KOMReviewGeneralHistoricalColors() {

	it('returns array', function () {
		deepEqual(mainModule.KOMReviewGeneralHistoricalColors(), [
			KOMSharedLogic.KOMSharedColorMature(),
			KOMSharedLogic.KOMSharedColorDeveloping(),
			KOMSharedLogic.KOMSharedColorRelearning(),
			KOMSharedLogic.KOMSharedColorUnseen(),
			]);
	});

});

describe('KOMReviewGeneralCollectionColors', function test_KOMReviewGeneralCollectionColors() {

	it('returns array', function () {
		deepEqual(mainModule.KOMReviewGeneralCollectionColors(), [
			KOMSharedLogic.KOMSharedColorUnseen(),
			KOMSharedLogic.KOMSharedColorDeveloping(),
			KOMSharedLogic.KOMSharedColorMature(),
			KOMSharedLogic.KOMSharedColorSuspended(),
			]);
	});

});
