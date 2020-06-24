const { throws, deepEqual, notDeepEqual } = require('assert');

const mainModule = require('./ui-logic.js').default;
const KOMSpacingModel = require('../_shared/KOMSpacing/model.js').default;

const kTesting = {
	StubStateObjectValid () {
		return {
			KOMPlayStateQueue: [],
			KOMPlayStateWait: [],
		};
	},
	StubChronicleObjectPrepared () {
		return {
			KOMChronicleDrawDate: new Date('2019-02-23T12:00:00Z'),
			KOMChronicleFlipDate: new Date('2019-02-23T12:00:00Z'),
			KOMChronicleResponseDate: new Date('2019-02-23T12:00:00Z'),
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
		};
	},
	StubChronicleObjectValid () {
		return Object.assign(kTesting.StubChronicleObjectPrepared(), {
			KOMChronicleDueDate: new Date('2019-02-23T12:00:00Z'),
		});
	},
	StubSpacingObjectValid() {
		return {
			KOMSpacingID: 'bravo-forward',
			KOMSpacingChronicles: [],
		};
	},
	uRepeat(param1, param2) {
		return Array.from(new Array(param1)).map(param2);
	},
};

const offset = (function(inputData) {
	return inputData < 10 ? `0${ inputData }` : inputData;
})((new Date()).getTimezoneOffset() / 60);

describe('KOMPlayDayGrouping', function test_KOMPlayDayGrouping() {

	it('throws if not valid', function () {
		throws(function () {
			mainModule.KOMPlayDayGrouping(new Date('alfa'));
		}, /KOMErrorInputNotValid/);
	});

	it('returns day in current timezone', function() {
		deepEqual(mainModule.KOMPlayDayGrouping(new Date(`2020-05-02T12:00:00-${ offset }:00`)), '2020-05-02');
	});

	it('previous day if before 4am', function() {
		const date = new Date(`2020-05-02T03:59:00-${ offset }:00`);
		deepEqual(mainModule.KOMPlayDayGrouping(date), '2020-05-01');
	});

	it('same day if 4am', function() {
		const date = new Date(`2020-05-02T04:00:00-${ offset }:00`);
		deepEqual(mainModule.KOMPlayDayGrouping(date), '2020-05-02');
	});

});

describe('KOMPlaySort', function test_KOMPlaySort() {
	
	const uItems = function (param1 = 4, param2 = Infinity, param3 = false) {
		return kTesting.uRepeat(param1, function (e, i) {
			return Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingID: (i + 1).toString() + '-forward',
				KOMSpacingDueDate: i >= param2 ? new Date() : undefined,
				KOMSpacingChronicles: [],
			});
		}).concat(param3 ? kTesting.uRepeat(param1, function (e, i) {
			return Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingID: (i + 1).toString() + '-backward',
				KOMSpacingDueDate: i >= param2 ? new Date() : undefined,
				KOMSpacingChronicles: [],
			});
		}) : []);
	};

	const uSlug = function (inputData) {
		return inputData.map(function (e) {
			return e.KOMSpacingID;
		}).join(',');
	};

	it('throws if not array', function () {
		throws(function () {
			mainModule.KOMPlaySort(null);
		}, /KOMErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(Array.isArray(mainModule.KOMPlaySort(uItems())), true);
	});

	it('creates copy', function() {
		const items = uItems();
		deepEqual(mainModule.KOMPlaySort(items) === items, false);
	});

	it('randomizes', function() {
		deepEqual(kTesting.uRepeat(10, function (e) {
			return uSlug(mainModule.KOMPlaySort(uItems()));
		}).filter(function (value, index, self) {
			return self.indexOf(value) === index;
		}).length > 1, true);
	});

	context('unseen', function () {
		
		it('spaces single', function() {
			deepEqual(mainModule.KOMPlaySort(uItems(10, 1)).map(function (e, i) {
				if (!e.KOMSpacingDueDate) {
					return i;
				}
			}).join(''), '5');
		});
		
		it('spaces multiple', function() {
			deepEqual(mainModule.KOMPlaySort(uItems(10, 2)).map(function (e, i) {
				if (!e.KOMSpacingDueDate) {
					return i;
				}
			}).join(''), '36');
		});

		it('randomizes', function() {
			deepEqual(kTesting.uRepeat(10, function (e) {
				return uSlug(mainModule.KOMPlaySort(uItems(10, 4)).filter(function (e) {
					return !e.KOMSpacingDueDate;
				}));
			}).filter(function (value, index, self) {
				return self.indexOf(value) === index;
			}).length > 1, true);
		});
	
	});

	context('siblings_unseen', function () {

		it('spaces with others', function() {
			deepEqual(mainModule.KOMPlaySort(uItems(5, 2, true)).map(function (e, i) {
				if (!e.KOMSpacingDueDate) {
					return i;
				}
			}).join(''), '2468');
		});

		it('sorts forward before backward', function() {
			deepEqual(mainModule.KOMPlaySort(uItems(10, Infinity, true)).filter(function (e, i, coll) {
				return coll.filter(function (item, index) {
					if (KOMSpacingModel.KOMSpacingModelIdentifier(item.KOMSpacingID) !== KOMSpacingModel.KOMSpacingModelIdentifier(e.KOMSpacingID)) {
						return false;
					}

					if (KOMSpacingModel.KOMSpacingModelLabel(item.KOMSpacingID) !== KOMSpacingModel.KOMSpacingModelLabelBackward()) {
						return false;
					}

					return index < i;
				}).length;
			}), []);
		});

		it('spaces apart from sibling', function() {
			deepEqual(kTesting.uRepeat(10, function (e) {
				return mainModule.KOMPlaySort(uItems(10, Infinity, true)).filter(function (e, i, coll) {
					return i && KOMSpacingModel.KOMSpacingModelIsBackward(e) && KOMSpacingModel.KOMSpacingModelIdentifier(e.KOMSpacingID) === KOMSpacingModel.KOMSpacingModelIdentifier(coll[i - 1].KOMSpacingID);
				});
			}).filter(function (e) {
				return e.length;
			}), []);
		});

		it('randomizes', function() {
			deepEqual(kTesting.uRepeat(10, function (e) {
				return uSlug(mainModule.KOMPlaySort(uItems(10, Infinity, true)).filter(KOMSpacingModel.KOMSpacingModelIsBackward));
			}).filter(function (value, index, self) {
				return self.indexOf(value) === index;
			}).length > 1, true);
		});

		it('terminates if impossible to space apart from sibling', function() {
			const items = uItems(1, Infinity, true);
			deepEqual(mainModule.KOMPlaySort(items), items);
		});
	
	});

	context('siblings_review', function () {

		it('spaces apart from sibling', function() {
			deepEqual(kTesting.uRepeat(10, function (e) {
				return mainModule.KOMPlaySort(uItems(10, 0, true)).filter(function (e, i, coll) {
					return i && KOMSpacingModel.KOMSpacingModelIsBackward(e) && KOMSpacingModel.KOMSpacingModelIdentifier(e.KOMSpacingID) === KOMSpacingModel.KOMSpacingModelIdentifier(coll[i - 1].KOMSpacingID);
				});
			}).filter(function (e) {
				return e.length;
			}), []);
		});

		it('randomizes', function() {
			deepEqual(kTesting.uRepeat(10, function (e) {
				return uSlug(mainModule.KOMPlaySort(uItems(10, 0, true)).filter(KOMSpacingModel.KOMSpacingModelIsBackward));
			}).filter(function (value, index, self) {
				return self.indexOf(value) === index;
			}).length > 1, true);
		});

		it('terminates if impossible to space apart from sibling', function() {
			const items = uItems(1, 0, true);
			deepEqual(mainModule.KOMPlaySort(items), items);
		});
	
	});

	context('bug_mixed_forwards_not_first', function () {

		it('sorts forward before backward', function() {
			deepEqual(mainModule.KOMPlaySort(uItems(5, 2, true)).filter(function (e, i, coll) {
				return coll.filter(function (item, index) {
					if (KOMSpacingModel.KOMSpacingModelIdentifier(item.KOMSpacingID) !== KOMSpacingModel.KOMSpacingModelIdentifier(e.KOMSpacingID)) {
						return false;
					}

					if (KOMSpacingModel.KOMSpacingModelLabel(item.KOMSpacingID) !== KOMSpacingModel.KOMSpacingModelLabelBackward()) {
						return false;
					}

					return index < i;
				}).length;
			}), []);
		});
		
	});

});

describe('KOMPlayStateIsValid', function test_KOMPlayStateIsValid() {
	
	it('throws if not object', function () {
		throws(function () {
			mainModule.KOMPlayStateIsValid(null);
		}, /KOMErrorInputNotValid/);
	});

	it('returns false if KOMPlayStateQueue not array', function() {
		deepEqual(mainModule.KOMPlayStateIsValid(Object.assign(kTesting.StubStateObjectValid(), {
			KOMPlayStateQueue: null,
		})), false);
	});

	it('returns false if KOMPlayStateWait not array', function() {
		deepEqual(mainModule.KOMPlayStateIsValid(Object.assign(kTesting.StubStateObjectValid(), {
			KOMPlayStateWait: null,
		})), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.KOMPlayStateIsValid(kTesting.StubStateObjectValid()), true);
	});

	context('KOMPlayStateCurrent', function () {

		it('returns false if not valid', function() {
			deepEqual(mainModule.KOMPlayStateIsValid(Object.assign(kTesting.StubStateObjectValid(), {
				KOMPlayStateCurrent: {},
			})), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KOMPlayStateIsValid(Object.assign(kTesting.StubStateObjectValid(), {
				KOMPlayStateCurrent: null,
			})), true);
		});
	
	});

	context('KOMPlayStateShouldRandomize', function () {
		
		it('returns false if not boolean', function() {
			deepEqual(mainModule.KOMPlayStateIsValid(Object.assign(kTesting.StubStateObjectValid(), {
				KOMPlayStateShouldRandomize: null,
			})), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KOMPlayStateIsValid(Object.assign(kTesting.StubStateObjectValid(), {
				KOMPlayStateShouldRandomize: true,
			})), true);
		});
	
	});

});

describe('KOMPlayResponseTypeAgain', function test_KOMPlayResponseTypeAgain() {

	it('returns string', function () {
		deepEqual(mainModule.KOMPlayResponseTypeAgain(), 'RESPONSE_AGAIN');
	});

});

describe('KOMPlayResponseTypeHard', function test_KOMPlayResponseTypeHard() {

	it('returns string', function () {
		deepEqual(mainModule.KOMPlayResponseTypeHard(), 'RESPONSE_HARD');
	});

});

describe('KOMPlayResponseTypeGood', function test_KOMPlayResponseTypeGood() {

	it('returns string', function () {
		deepEqual(mainModule.KOMPlayResponseTypeGood(), 'RESPONSE_GOOD');
	});

});

describe('KOMPlayResponseTypeEasy', function test_KOMPlayResponseTypeEasy() {

	it('returns string', function () {
		deepEqual(mainModule.KOMPlayResponseTypeEasy(), 'RESPONSE_EASY');
	});

});

describe('KOMPlayResponseTypes', function test_KOMPlayResponseTypes() {

	it('returns array', function () {
		deepEqual(mainModule.KOMPlayResponseTypes(), [
			mainModule.KOMPlayResponseTypeAgain(),
			mainModule.KOMPlayResponseTypeHard(),
			mainModule.KOMPlayResponseTypeGood(),
			mainModule.KOMPlayResponseTypeEasy(),
		]);
	});

});

describe('KOMPlayResponseIntervalAgain', function test_KOMPlayResponseIntervalAgain() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseIntervalAgain(), 1000 * 50);
	});

});

describe('KOMPlayResponseIntervalLearn', function test_KOMPlayResponseIntervalLearn() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseIntervalLearn(), 1000 * 60 * 10);
	});

});

describe('KOMPlayResponseIntervalGraduateDefault', function test_KOMPlayResponseIntervalGraduateDefault() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseIntervalGraduateDefault(), 1);
	});

});

describe('KOMPlayResponseIntervalGraduateEasy', function test_KOMPlayResponseIntervalGraduateEasy() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseIntervalGraduateEasy(), 4);
	});

});

describe('KOMPlayResponseIntervalOverdueDivisorHard', function test_KOMPlayResponseIntervalOverdueDivisorHard() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueDivisorHard(), 4);
	});

});

describe('KOMPlayResponseIntervalOverdueDivisorGood', function test_KOMPlayResponseIntervalOverdueDivisorGood() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueDivisorGood(), 2);
	});

});

describe('KOMPlayResponseIntervalOverdueDivisorEasy', function test_KOMPlayResponseIntervalOverdueDivisorEasy() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueDivisorEasy(), 1);
	});

});

describe('KOMPlayResponseIntervalOverdueDays', function test_KOMPlayResponseIntervalOverdueDays() {

	it('throws if param1 not valid', function () {
		throws(function () {
			mainModule.KOMPlayResponseIntervalOverdueDays({}, kTesting.StubChronicleObjectValid());
		}, /KOMErrorInputNotValid/);
	});

	it('throws if param2 not prepared', function () {
		throws(function () {
			mainModule.KOMPlayResponseIntervalOverdueDays(kTesting.StubSpacingObjectValid(), Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleDrawDate: null,
			}));
		}, /KOMErrorInputNotValid/);
	});

	it('returns 0 if no KOMSpacingInterval', function() {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueDays(kTesting.StubSpacingObjectValid(), kTesting.StubChronicleObjectValid()), 0);
	});

	it('returns 0 if KOMSpacingDueDate same day', function() {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueDays(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingDueDate: new Date(`2020-05-02T12:00:00-${ offset }:00`),
		}), Object.assign(kTesting.StubChronicleObjectValid(), {
			KOMChronicleResponseDate: new Date(`2020-05-02T18:00:00-${ offset }:00`),
		})), 0);
	});

	it('returns days if KOMSpacingDueDate past', function() {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueDays(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingDueDate: new Date(`2020-05-02T12:00:00-${ offset }:00`),
		}), Object.assign(kTesting.StubChronicleObjectValid(), {
			KOMChronicleResponseDate: new Date(`2020-05-12T18:00:00-${ offset }:00`),
		})), 10);
	});

});

describe('KOMPlayResponseIntervalOverdueBonus', function test_KOMPlayResponseIntervalOverdueBonus() {

	it('throws if param1 not valid', function () {
		throws(function () {
			mainModule.KOMPlayResponseIntervalOverdueBonus({}, kTesting.StubChronicleObjectValid());
		}, /KOMErrorInputNotValid/);
	});

	it('throws if param2 not prepared', function () {
		throws(function () {
			mainModule.KOMPlayResponseIntervalOverdueBonus(kTesting.StubSpacingObjectValid(), Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleDrawDate: null,
			}));
		}, /KOMErrorInputNotValid/);
	});

	it('returns 0', function() {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueBonus(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingDueDate: new Date(`2020-05-02T12:00:00-${ offset }:00`),
		}), Object.assign(kTesting.StubChronicleObjectValid(), {
			KOMChronicleResponseDate: new Date(`2020-05-12T18:00:00-${ offset }:00`),
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeAgain(),
		})), 0);
	});

	it('adjusts if Hard', function() {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueBonus(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingDueDate: new Date(`2020-05-02T12:00:00-${ offset }:00`),
		}), Object.assign(kTesting.StubChronicleObjectValid(), {
			KOMChronicleResponseDate: new Date(`2020-05-12T18:00:00-${ offset }:00`),
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
		})), 10 / mainModule.KOMPlayResponseIntervalOverdueDivisorHard());
	});

	it('adjusts if Good', function() {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueBonus(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingDueDate: new Date(`2020-05-02T12:00:00-${ offset }:00`),
		}), Object.assign(kTesting.StubChronicleObjectValid(), {
			KOMChronicleResponseDate: new Date(`2020-05-12T18:00:00-${ offset }:00`),
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
		})), 10 / mainModule.KOMPlayResponseIntervalOverdueDivisorGood());
	});

	it('adjusts if Easy', function() {
		deepEqual(mainModule.KOMPlayResponseIntervalOverdueBonus(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingDueDate: new Date(`2020-05-02T12:00:00-${ offset }:00`),
		}), Object.assign(kTesting.StubChronicleObjectValid(), {
			KOMChronicleResponseDate: new Date(`2020-05-12T18:00:00-${ offset }:00`),
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
		})), 10 / mainModule.KOMPlayResponseIntervalOverdueDivisorEasy());
	});

});

describe('KOMPlayResponseMultiplierDefault', function test_KOMPlayResponseMultiplierDefault() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseMultiplierDefault(), 2.5);
	});

});

describe('KOMPlayResponseMultiplierMin', function test_KOMPlayResponseMultiplierMin() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseMultiplierMin(), 1.3);
	});

});

describe('KOMPlayResponseMultiplierHard', function test_KOMPlayResponseMultiplierHard() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseMultiplierHard(), 1.2);
	});

});

describe('KOMPlayResponseMultiplierSummandFail', function test_KOMPlayResponseMultiplierSummandFail() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseMultiplierSummandFail(), -0.2);
	});

});

describe('KOMPlayResponseMultiplierSummandGood', function test_KOMPlayResponseMultiplierSummandGood() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseMultiplierSummandGood(), 0);
	});

});

describe('KOMPlayResponseMultiplierSummandHard', function test_KOMPlayResponseMultiplierSummandHard() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseMultiplierSummandHard(), -0.15);
	});

});

describe('KOMPlayResponseMultiplierSummandEasy', function test_KOMPlayResponseMultiplierSummandEasy() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseMultiplierSummandEasy(), 0.15);
	});

});

describe('KOMPlayResponseMultiplierMultiplicandEasy', function test_KOMPlayResponseMultiplierMultiplicandEasy() {

	it('returns number', function () {
		deepEqual(mainModule.KOMPlayResponseMultiplierMultiplicandEasy(), 1.3);
	});

});

describe('KOMChronicleIsPrepared', function test_KOMChronicleIsPrepared() {
	
	it('throws if not object', function () {
		throws(function () {
			mainModule.KOMChronicleIsPrepared(null);
		}, /KOMErrorInputNotValid/);
	});

	it('returns false if KOMChronicleDrawDate not date', function() {
		deepEqual(mainModule.KOMChronicleIsPrepared(Object.assign(kTesting.StubChronicleObjectPrepared(), {
			KOMChronicleDrawDate: new Date('alfa'),
		})), false);
	});

	it('returns false if KOMChronicleFlipDate not date', function() {
		deepEqual(mainModule.KOMChronicleIsPrepared(Object.assign(kTesting.StubChronicleObjectPrepared(), {
			KOMChronicleFlipDate: new Date('alfa'),
		})), false);
	});

	it('returns false if KOMChronicleResponseDate not date', function() {
		deepEqual(mainModule.KOMChronicleIsPrepared(Object.assign(kTesting.StubChronicleObjectPrepared(), {
			KOMChronicleResponseDate: new Date('alfa'),
		})), false);
	});

	it('returns false if KOMChronicleResponseType not valid', function() {
		deepEqual(mainModule.KOMChronicleIsPrepared(Object.assign(kTesting.StubChronicleObjectPrepared(), {
			KOMChronicleResponseType: 'alfa',
		})), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.KOMChronicleIsPrepared(kTesting.StubChronicleObjectPrepared()), true);
	});

});

describe('KOMChronicleIsValid', function test_KOMChronicleIsValid() {
	
	it('throws if not prepared', function () {
		throws(function () {
			mainModule.KOMChronicleIsValid(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleDrawDate: new Date('alfa'),
			})));
		}, /KOMErrorInputNotValid/);
	});

	it('returns false if KOMChronicleDueDate not date', function() {
		deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
			KOMChronicleDueDate: new Date('alfa'),
		})), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.KOMChronicleIsValid(kTesting.StubChronicleObjectValid()), true);
	});

	context('KOMChronicleIsLearning', function () {
		
		it('returns false if not boolean', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleIsLearning: 'true',
			})), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleIsLearning: true,
			})), true);
		});
	
	});

	context('KOMChronicleIsReadyToGraduate', function () {
		
		it('returns false if not boolean', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleIsReadyToGraduate: 'true',
			})), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleIsReadyToGraduate: true,
			})), true);
		});
	
	});

	context('KOMChronicleInterval', function () {

		it('returns false if KOMChronicleInterval not number', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleInterval: '1',
			})), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleInterval: 1,
			})), true);
		});
	
	});

	context('KOMChronicleMultiplier', function () {

		it('returns false if KOMChronicleMultiplier not number', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleMultiplier: '1',
			})), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleMultiplier: 1,
			})), true);
		});
	
	});

	context('KOMChronicleDidDrawMultipleTimes', function () {
		
		it('returns false if not boolean', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleDidDrawMultipleTimes: 'true',
			})), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleDidDrawMultipleTimes: true,
			})), true);
		});
	
	});

	context('KOMChronicleDidFlipMultipleTimes', function () {
		
		it('returns false if not boolean', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleDidFlipMultipleTimes: 'true',
			})), false);
		});

		it('returns true', function() {
			deepEqual(mainModule.KOMChronicleIsValid(Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleDidFlipMultipleTimes: true,
			})), true);
		});
	
	});

});

describe('KOMChronicleGenerateDraw', function test_KOMChronicleGenerateDraw() {
	
	it('throws if param1 not date', function () {
		throws(function () {
			mainModule.KOMChronicleGenerateDraw(new Date('alfa'), kTesting.StubSpacingObjectValid());
		}, /KOMErrorInputNotValid/);
	});

	it('throws if param2 not valid', function () {
		throws(function () {
			mainModule.KOMChronicleGenerateDraw(new Date(), {});
		}, /KOMErrorInputNotValid/);
	});

	it('returns object', function() {
		const item = new Date();
		deepEqual(mainModule.KOMChronicleGenerateDraw(item, kTesting.StubSpacingObjectValid()), {
			KOMChronicleDrawDate: item,
		});
	});

	context('KOMChronicleDidDrawMultipleTimes', function () {
		
		it('sets undefined if KOMSpacingDrawDate undefined', function () {
			deepEqual(mainModule.KOMChronicleGenerateDraw(new Date(), kTesting.StubSpacingObjectValid()).KOMChronicleDidDrawMultipleTimes, undefined);
		});
		
		it('sets undefined if KOMSpacingDrawDate past', function () {
			deepEqual(mainModule.KOMChronicleGenerateDraw(new Date(), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingDrawDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
			})).KOMChronicleDidDrawMultipleTimes, undefined);
		});
		
		it('sets undefined if KOMSpacingDrawDate today and unseen', function () {
			deepEqual(mainModule.KOMChronicleGenerateDraw(new Date(), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingDrawDate: new Date(),
			})).KOMChronicleDidDrawMultipleTimes, undefined);
		});
		
		it('sets undefined if KOMSpacingDrawDate today and learning', function () {
			deepEqual(mainModule.KOMChronicleGenerateDraw(new Date(), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingDrawDate: new Date(),
			})).KOMChronicleDidDrawMultipleTimes, undefined);
		});
		
		it('sets true if KOMSpacingDrawDate today and reviewing', function () {
			deepEqual(mainModule.KOMChronicleGenerateDraw(new Date(), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingDrawDate: new Date(),
				KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			})).KOMChronicleDidDrawMultipleTimes, true);
		});
	
	});

});

describe('KOMChronicleGenerateFlip', function test_KOMChronicleGenerateFlip() {
	
	it('throws if param1 not date', function () {
		throws(function () {
			mainModule.KOMChronicleGenerateFlip(new Date('alfa'), kTesting.StubSpacingObjectValid());
		}, /KOMErrorInputNotValid/);
	});

	it('throws if param2 not valid', function () {
		throws(function () {
			mainModule.KOMChronicleGenerateFlip(new Date(), {});
		}, /KOMErrorInputNotValid/);
	});

	it('returns object', function() {
		const item = new Date();
		deepEqual(mainModule.KOMChronicleGenerateFlip(item, kTesting.StubSpacingObjectValid()), {
			KOMChronicleFlipDate: item,
		});
	});

	context('KOMChronicleDidFlipMultipleTimes', function () {
		
		it('sets undefined if KOMSpacingFlipDate undefined', function () {
			deepEqual(mainModule.KOMChronicleGenerateFlip(new Date(), kTesting.StubSpacingObjectValid()).KOMChronicleDidFlipMultipleTimes, undefined);
		});
		
		it('sets undefined if KOMSpacingFlipDate past', function () {
			deepEqual(mainModule.KOMChronicleGenerateFlip(new Date(), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingFlipDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
			})).KOMChronicleDidFlipMultipleTimes, undefined);
		});
		
		it('sets undefined if KOMSpacingFlipDate today and unseen', function () {
			deepEqual(mainModule.KOMChronicleGenerateFlip(new Date(), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingFlipDate: new Date(),
			})).KOMChronicleDidFlipMultipleTimes, undefined);
		});
		
		it('sets undefined if KOMSpacingFlipDate today and learning', function () {
			deepEqual(mainModule.KOMChronicleGenerateFlip(new Date(), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingFlipDate: new Date(),
			})).KOMChronicleDidFlipMultipleTimes, undefined);
		});
		
		it('sets true if KOMSpacingFlipDate today and reviewing', function () {
			deepEqual(mainModule.KOMChronicleGenerateFlip(new Date(), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingFlipDate: new Date(),
				KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			})).KOMChronicleDidFlipMultipleTimes, true);
		});
	
	});

});

describe('KOMPlayRespond', function test_KOMPlayRespond() {

	const uState = function (param1, param2 = []) {
		return Object.assign(kTesting.StubStateObjectValid(), {
			KOMPlayStateQueue: [].concat(param2),
			KOMPlayStateCurrent: param1,
		});
	};
	
	const uChronicle = function (inputData = {}) {
		return Object.assign(kTesting.StubChronicleObjectPrepared(), inputData);
	};
	
	it('throws if param1 not valid', function () {
		throws(function () {
			mainModule.KOMPlayRespond({}, uChronicle());
		}, /KOMErrorInputNotValid/);
	});

	it('throws if param2 not prepared', function () {
		throws(function () {
			mainModule.KOMPlayRespond(uState(), Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleDrawDate: null,
			}));
		}, /KOMErrorInputNotValid/);
	});

	it('returns param1', function() {
		const item = uState(kTesting.StubSpacingObjectValid());
		deepEqual(mainModule.KOMPlayRespond(item, uChronicle()) === item, true);
	});

	context('param2', function () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const chronicle = uChronicle();

		before(function () {
			mainModule.KOMPlayRespond(uState(spacing), chronicle);
		});
		
		it('adds to KOMSpacingChronicles', function () {
			deepEqual(spacing.KOMSpacingChronicles[0] === chronicle, true);
		});

	});

	context('KOMPlayStateCurrent', function () {
		
		it('sets to null if queue empty', function () {
			deepEqual(mainModule.KOMPlayRespond(uState(kTesting.StubSpacingObjectValid()), uChronicle()), Object.assign(uState(), {
				KOMPlayStateCurrent: null,
			}));
		});

		it('sets to first in queue', function () {
			const item = kTesting.StubSpacingObjectValid();
			deepEqual(mainModule.KOMPlayRespond(uState(kTesting.StubSpacingObjectValid(), item), uChronicle()).KOMPlayStateCurrent === item, true);
		});
	
	});

	context('KOMPlayStateWait', function () {

		const uWait = function (inputData) {
			return Object.assign(uState(kTesting.StubSpacingObjectValid(), [kTesting.StubSpacingObjectValid()]), {
				KOMPlayStateWait: [Object.assign(kTesting.StubSpacingObjectValid(), {
					KOMSpacingDueDate: new Date(kTesting.StubChronicleObjectValid().KOMChronicleResponseDate.valueOf() + inputData),
				})],
			});
		};
		
		it('moves to queue if overdue', function () {
			const state = uWait(-1000);
			const queue = state.KOMPlayStateQueue.slice();
			const first = state.KOMPlayStateWait.slice()[0];
			deepEqual(mainModule.KOMPlayRespond(state, uChronicle()), Object.assign(uWait(-1000), {
				KOMPlayStateCurrent: first,
				KOMPlayStateQueue: queue,
				KOMPlayStateWait: [],
			}));
		});
		
		it('moves to queue if queue empty', function () {
			const state = Object.assign(uWait(1000), {
				KOMPlayStateQueue: [],
			});
			const wait = (state.KOMPlayStateWait = state.KOMPlayStateWait.concat(state.KOMPlayStateWait.slice())).slice();
			deepEqual(mainModule.KOMPlayRespond(state, uChronicle()), Object.assign(uWait(1000), {
				KOMPlayStateCurrent: wait[0],
				KOMPlayStateQueue: wait.slice(1),
				KOMPlayStateWait: [],
			}));
		});
		
		it('does nothing', function () {
			const state = uWait(1000);
			const first = state.KOMPlayStateQueue[0];
			deepEqual(mainModule.KOMPlayRespond(state, kTesting.StubChronicleObjectValid()), Object.assign(uWait(1000), {
				KOMPlayStateCurrent: first,
				KOMPlayStateQueue: [],
			}));
		});

	});

	context('KOMPlayStateShouldRandomize', function () {

		const uIntervals = function (param1, param2 = 0) {
			return kTesting.uRepeat(10, function () {
				const date = new Date();
				const spacing = kTesting.StubSpacingObjectValid();
				const state = Object.assign(uState(spacing), {
					KOMPlayStateShouldRandomize: true,
				});
				const chronicle = uChronicle({
					KOMChronicleResponseDate: date,
					KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
				});

				mainModule.KOMPlayRespond(state, chronicle);

				chronicle.KOMChronicleResponseType = mainModule.KOMPlayResponseTypeGood();

				for (var i = 0; i < param1; i++) {
					state.KOMPlayStateCurrent = spacing;
					mainModule.KOMPlayRespond(state, chronicle);
				}

				return Math.abs(spacing.KOMSpacingInterval - param2);
			});
		};

		it('randomizes KOMSpacingInterval', function() {
			deepEqual(uIntervals(1).filter(function (value, index, self) {
				return self.indexOf(value) === index;
			}).length > 1, true);
		});

		context('review_1', function () {

			const baseInterval = 10;

			it('deviates over 30 seconds', function() {
				deepEqual(uIntervals(2, baseInterval).filter(function (e) {
					return (e * 24 * 60 * 60) < 30;
				}), []);
			});

			it('deviates under 3 hours', function() {
				deepEqual(uIntervals(1, baseInterval).filter(function (e) {
					return (e * 24) > 3;
				}), []);
			});
		
		});

		context('review_2', function () {

			const baseInterval = 25;

			it.skip('deviates over 2 minutes', function() {
				deepEqual(uIntervals(2, baseInterval).filter(function (e) {
					return (e * 24 * 60) < 2;
				}), []);
			});
			
			it('deviates under 2 days', function() {
				deepEqual(uIntervals(2, baseInterval).filter(function (e) {
					return e > 2;
				}), []);
			});
		
		});

		context('review_3', function () {

			const baseInterval = 62.5;

			it('deviates over 3 hours', function() {
				deepEqual(uIntervals(3, baseInterval).filter(function (e) {
					return e * 24 < 3;
				}), []);
			});
			
			it('deviates under 4 days', function() {
				deepEqual(uIntervals(3, baseInterval).filter(function (e) {
					return e > 4;
				}), []);
			});
		
		});
	
	});

	context('unseen_and_Again', function test_unseen_and_Again () {

		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		const chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeAgain(),
		});

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);	
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + mainModule.KOMPlayResponseIntervalAgain()),
				KOMSpacingIsLearning: true,
				KOMSpacingChronicles: [uChronicle({
					KOMChronicleResponseType: mainModule.KOMPlayResponseTypeAgain(),
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleIsLearning: true,
				})],
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [spacing],
			}));
		});
	
	});

	context('unseen_and_Hard', function test_unseen_and_Hard () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		const chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
		});

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingIsLearning: true,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + mainModule.KOMPlayResponseIntervalLearn()),
				KOMSpacingChronicles: [uChronicle({
					KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleIsLearning: true,
				})],
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [spacing],
			}));
		});
	
	});

	context('unseen_and_Good', function test_unseen_and_Good () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		const chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
		});

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingIsLearning: true,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + mainModule.KOMPlayResponseIntervalLearn()),
				KOMSpacingChronicles: [uChronicle({
					KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleIsLearning: true,
				})],
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [spacing],
			}));
		});
	
	});

	context('unseen_and_Easy', function test_unseen_and_Easy () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing);
		const chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
		});

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault(),
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * mainModule.KOMPlayResponseIntervalGraduateEasy()),
				KOMSpacingChronicles: [uChronicle({
					KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})],
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, uState());
		});
	
	});

	context('learning_and_Again', function test_learning_and_Again () {

		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeAgain(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeAgain(),
			}));

		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + mainModule.KOMPlayResponseIntervalAgain()),
				KOMSpacingIsLearning: true,
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleIsLearning: true,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [spacing],
			}));
		});
	
	});

	context('learning_and_Hard', function test_learning_and_Hard () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
			}));	
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingIsLearning: true,
				KOMSpacingIsReadyToGraduate: true,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + mainModule.KOMPlayResponseIntervalLearn()),
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleIsLearning: true,
					KOMChronicleIsReadyToGraduate: true,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [spacing],
			}));
		});
	
	});

	context('learning_and_Good', function test_learning_and_Good () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
			}));	
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingIsLearning: true,
				KOMSpacingIsReadyToGraduate: true,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + mainModule.KOMPlayResponseIntervalLearn()),
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleIsLearning: true,
					KOMChronicleIsReadyToGraduate: true,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [spacing],
			}));
		});
	
	});

	context('learning_and_Easy', function test_learning_and_Easy () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
			}));	
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault(),
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * mainModule.KOMPlayResponseIntervalGraduateEasy()),
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
			}));
		});
	
	});

	context('learning_after_Again', function test_learning_after_Again () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeAgain(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
			}));	
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingIsLearning: true,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + mainModule.KOMPlayResponseIntervalLearn()),
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleIsLearning: true,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [spacing],
			}));
		});
	
	});

	context('graduate_Hard', function test_graduate_Hard () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
			}));

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
			}));	
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateDefault(),
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault(),
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * mainModule.KOMPlayResponseIntervalGraduateDefault()),
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
			}));
		});
	
	});

	context('graduate_Good', function test_graduate_Good () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
			}));

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
			}));	
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateDefault(),
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault(),
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * mainModule.KOMPlayResponseIntervalGraduateDefault()),
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
			}));
		});
	
	});

	context('graduate_Fail', function test_graduate_Fail () {
		
		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
			}));

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = state.KOMPlayStateWait.pop();

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeAgain(),
			}));
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + mainModule.KOMPlayResponseIntervalAgain()),
				KOMSpacingIsLearning: true,
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleIsLearning: true,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [spacing],
			}));
		});
	
	});

	context('reviewing_and_Again', function test_reviewing_and_Again () {

		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = spacing;

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeAgain(),
			}));	
		});
		
		it('updates spacing', function() {
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault() + mainModule.KOMPlayResponseMultiplierSummandFail(),
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + mainModule.KOMPlayResponseIntervalAgain()),
				KOMSpacingIsLearning: true,
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleIsLearning: true,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [spacing],
			}));
		});
	
	});

	context('reviewing_and_Hard', function test_reviewing_and_Hard () {

		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = spacing;

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
			}));	
		});
		
		it('updates spacing', function() {
			const interval = mainModule.KOMPlayResponseIntervalGraduateEasy() * mainModule.KOMPlayResponseMultiplierHard();
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault() + mainModule.KOMPlayResponseMultiplierSummandHard(),
				KOMSpacingInterval: interval,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * interval),
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [],
			}));
		});
	
	});

	context('reviewing_and_Good', function test_reviewing_and_Good () {

		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = spacing;

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
			}));	
		});
		
		it('updates spacing', function() {
			const interval = mainModule.KOMPlayResponseIntervalGraduateEasy() * mainModule.KOMPlayResponseMultiplierDefault();
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault() + mainModule.KOMPlayResponseMultiplierSummandGood(),
				KOMSpacingInterval: interval,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * interval),
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [],
			}));
		});
	
	});

	context('reviewing_and_Easy', function test_reviewing_and_Easy () {

		const spacing = kTesting.StubSpacingObjectValid();
		const state = uState(spacing, [kTesting.StubSpacingObjectValid()]);
		let chronicle = uChronicle({
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
		});
		const events = [];

		before(function () {
			mainModule.KOMPlayRespond(state, chronicle);

			events.push(uChronicle(chronicle));
		});
		
		before(function () {
			state.KOMPlayStateQueue.unshift(state.KOMPlayStateCurrent);
			state.KOMPlayStateCurrent = spacing;

			mainModule.KOMPlayRespond(state, chronicle = uChronicle({
				KOMChronicleResponseDate: state.KOMPlayStateCurrent.KOMSpacingDueDate,
				KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
			}));	
		});
		
		it('updates spacing', function() {
			const interval = mainModule.KOMPlayResponseIntervalGraduateEasy() * mainModule.KOMPlayResponseMultiplierDefault() * mainModule.KOMPlayResponseMultiplierMultiplicandEasy();
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault() + mainModule.KOMPlayResponseMultiplierSummandEasy(),
				KOMSpacingInterval: interval,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * interval),
				KOMSpacingChronicles: events.concat(uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})),
			}));
		});
		
		it('updates state', function() {
			deepEqual(state, Object.assign(uState(), {
				KOMPlayStateCurrent: kTesting.StubSpacingObjectValid(),
				KOMPlayStateWait: [],
			}));
		});
	
	});

	context('overdue_and_Hard', function test_overdue_and_Hard () {

		const date = new Date();
		const spacing = Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault(),
			KOMSpacingDueDate: date,
		});
		const chronicle = uChronicle({
			KOMChronicleResponseDate: new Date(date.valueOf() + 1000 * 60 * 60 * 24 * 10),
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
		});

		before(function () {
			mainModule.KOMPlayRespond(uState(spacing), chronicle);	
		});
		
		it('updates spacing', function() {
			const interval = (mainModule.KOMPlayResponseIntervalGraduateEasy() + 10 / mainModule.KOMPlayResponseIntervalOverdueDivisorHard()) * mainModule.KOMPlayResponseMultiplierHard();
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault() + mainModule.KOMPlayResponseMultiplierSummandHard(),
				KOMSpacingInterval: interval,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * interval),
				KOMSpacingChronicles: [uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})],
			}));
		});
		
	});

	context('overdue_and_Good', function test_overdue_and_Good () {

		const date = new Date();
		const spacing = Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault(),
			KOMSpacingDueDate: date,
		});
		const chronicle = uChronicle({
			KOMChronicleResponseDate: new Date(date.valueOf() + 1000 * 60 * 60 * 24 * 10),
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeGood(),
		});

		before(function () {
			mainModule.KOMPlayRespond(uState(spacing), chronicle);	
		});
		
		it('updates spacing', function() {
			const interval = (mainModule.KOMPlayResponseIntervalGraduateEasy() + 10 / mainModule.KOMPlayResponseIntervalOverdueDivisorGood()) * mainModule.KOMPlayResponseMultiplierDefault();
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault() + mainModule.KOMPlayResponseMultiplierSummandGood(),
				KOMSpacingInterval: interval,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * interval),
				KOMSpacingChronicles: [uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})],
			}));
		});
		
	});

	context('overdue_and_Easy', function test_overdue_and_Easy () {

		const date = new Date();
		const spacing = Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault(),
			KOMSpacingDueDate: date,
		});
		const chronicle = uChronicle({
			KOMChronicleResponseDate: new Date(date.valueOf() + 1000 * 60 * 60 * 24 * 10),
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeEasy(),
		});

		before(function () {
			mainModule.KOMPlayRespond(uState(spacing), chronicle);	
		});
		
		it('updates spacing', function() {
			const interval = (mainModule.KOMPlayResponseIntervalGraduateEasy() + 10 / mainModule.KOMPlayResponseIntervalOverdueDivisorEasy()) * mainModule.KOMPlayResponseMultiplierDefault() * mainModule.KOMPlayResponseMultiplierMultiplicandEasy();
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierDefault() + mainModule.KOMPlayResponseMultiplierSummandEasy(),
				KOMSpacingInterval: interval,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * interval),
				KOMSpacingChronicles: [uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})],
			}));
		});
		
	});

	context('minimum_multiplier', function test_minimum_multiplier () {

		const date = new Date();
		const spacing = Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingInterval: mainModule.KOMPlayResponseIntervalGraduateEasy(),
			KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierMin(),
			KOMSpacingDueDate: date,
		});
		const chronicle = uChronicle({
			KOMChronicleResponseDate: new Date(date.valueOf() + 1000 * 60 * 60 * 24 * 10),
			KOMChronicleResponseType: mainModule.KOMPlayResponseTypeHard(),
		});

		before(function () {
			mainModule.KOMPlayRespond(uState(spacing), chronicle);	
		});
		
		it('updates spacing', function() {
			const interval = (mainModule.KOMPlayResponseIntervalGraduateEasy() + 10 / mainModule.KOMPlayResponseIntervalOverdueDivisorHard()) * mainModule.KOMPlayResponseMultiplierHard();
			deepEqual(spacing, Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingMultiplier: mainModule.KOMPlayResponseMultiplierMin(),
				KOMSpacingInterval: interval,
				KOMSpacingDueDate: new Date(chronicle.KOMChronicleResponseDate.valueOf() + 1000 * 60 * 60 * 24 * interval),
				KOMSpacingChronicles: [uChronicle({
					KOMChronicleResponseDate: chronicle.KOMChronicleResponseDate,
					KOMChronicleResponseType: chronicle.KOMChronicleResponseType,
					KOMChronicleDueDate: spacing.KOMSpacingDueDate,
					KOMChronicleInterval: spacing.KOMSpacingInterval,
					KOMChronicleMultiplier: spacing.KOMSpacingMultiplier,
				})],
			}));
		});
		
	});

});

describe('KOMPlayUndo', function test_KOMPlayUndo() {

	it('throws if not valid', function () {
		throws(function () {
			mainModule.KOMPlayUndo({});
		}, /KOMErrorInputNotValid/);
	});

	it('throws if no KOMSpacingChronicles', function () {
		throws(function () {
			mainModule.KOMPlayUndo(kTesting.StubSpacingObjectValid());
		}, /KOMErrorInputNotValid/);
	});

	it('returns input', function () {
		const item = Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingChronicles: [kTesting.StubChronicleObjectValid()],
		});

		deepEqual(mainModule.KOMPlayUndo(item) === item, true);
	});

	it('removes last KOMSpacingChronicles item', function () {
		deepEqual(mainModule.KOMPlayUndo(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingChronicles: [kTesting.StubChronicleObjectValid(), kTesting.StubChronicleObjectValid()],
		})).KOMSpacingChronicles, [kTesting.StubChronicleObjectValid()]);
	});

	it('keeps KOMSpacingDrawDate', function () {
		deepEqual(mainModule.KOMPlayUndo(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingDrawDate: new Date('2019-02-23T12:00:00Z'),
			KOMSpacingIsLearning: true,
			KOMSpacingChronicles: [kTesting.StubChronicleObjectValid()],
		})), Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingDrawDate: new Date('2019-02-23T12:00:00Z'),
		}));
	});

	it('keeps KOMSpacingFlipDate', function () {
		deepEqual(mainModule.KOMPlayUndo(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingFlipDate: new Date('2019-02-23T12:00:00Z'),
			KOMSpacingIsLearning: true,
			KOMSpacingChronicles: [kTesting.StubChronicleObjectValid()],
		})), Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingFlipDate: new Date('2019-02-23T12:00:00Z'),
		}));
	});

	it('keeps relations', function () {
		deepEqual(mainModule.KOMPlayUndo(Object.assign(kTesting.StubSpacingObjectValid(), {
			KOMSpacingIsLearning: true,
			KOMSpacingChronicles: [kTesting.StubChronicleObjectValid()],
			$alfa: 'bravo',
		})), Object.assign(kTesting.StubSpacingObjectValid(), {
			$alfa: 'bravo',
		}));
	});
	
	context('with no history', function () {

		it('removes existing properties', function () {
			deepEqual(mainModule.KOMPlayUndo(Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingIsLearning: true,
				KOMSpacingIsReadyToGraduate: true,
				KOMSpacingChronicles: [kTesting.StubChronicleObjectValid()],
			})), kTesting.StubSpacingObjectValid());
		});
	
	});

	context('with history', function () {

		it('sets spacing properties', function () {
			const item = Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleIsLearning: true,
			});
			deepEqual(mainModule.KOMPlayUndo(Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingChronicles: [item, kTesting.StubChronicleObjectValid()],
			})), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingChronicles: [item],
				KOMSpacingIsLearning: true,
				KOMSpacingDrawDate: new Date('2019-02-23T12:00:00Z'),
				KOMSpacingFlipDate: new Date('2019-02-23T12:00:00Z'),
				KOMSpacingDueDate: new Date('2019-02-23T12:00:00Z'),
			}));
		});

		it('removes existing properties', function () {
			const item = Object.assign(kTesting.StubChronicleObjectValid(), {
				KOMChronicleIsLearning: true,
			});
			deepEqual(mainModule.KOMPlayUndo(Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingIsLearning: true,
				KOMSpacingIsReadyToGraduate: true,
				KOMSpacingChronicles: [item, kTesting.StubChronicleObjectValid()],
			})), Object.assign(kTesting.StubSpacingObjectValid(), {
				KOMSpacingChronicles: [item],
				KOMSpacingIsLearning: true,
				KOMSpacingDrawDate: new Date('2019-02-23T12:00:00Z'),
				KOMSpacingFlipDate: new Date('2019-02-23T12:00:00Z'),
				KOMSpacingDueDate: new Date('2019-02-23T12:00:00Z'),
			}));
		});
	
	});

});
