const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KOMPlayLogic = require('./ui-logic.js').default;
const KOMSpacingModel = require('../_shared/KOMSpacing/model.js').default;

const kTesting = {
	uDeck () {
		return {
			KOMDeckID: 'alfa',
			KOMDeckName: '',
			KOMDeckCreationDate: new Date('2019-02-23T13:56:36Z'),
			KOMDeckModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
	uSpacings (inputData) {
		return KOMPlayLogic._KOMPlaySortShuffle(Array.from(new Array(inputData)).map(function (e, i) {
			return {
				KOMSpacingID: (i + 1).toString() + '-forward',
				KOMSpacingChronicles: [],
				$KOMSpacingCard: {
					KOMCardID: (i + 1).toString(),
					KOMCardDeckID: 'alfa',
					KOMCardFront: (i + 1).toString(),
					KOMCardRear: 'charlie',
					KOMCardHint: 'delta',
					KOMCardCreationDate: new Date('2019-02-23T13:56:36Z'),
					KOMCardModificationDate: new Date('2019-02-23T13:56:36Z'),
				},
			};
		}));
	},
};

describe('KOMPlay_Misc', function () {

	const items = kTesting.uSpacings(5).map(function (e, i) {
		return Object.assign(e, i === 1 ? {
			KOMSpacingMultiplier: 2,
			KOMSpacingInterval: 1,
			KOMSpacingDueDate: new Date(),
		} : {});
	});

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KOMPlaySpacings: JSON.stringify(items),
			KOMPlayDeck: JSON.stringify(kTesting.uDeck()),
		});
	});

	describe('KOMPlayToolbarDoneButton', function test_KOMPlayToolbarDoneButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KOMPlayToolbarDoneButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KOMPlayToolbarDoneButton, 'OLSKLayoutElementTappable');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMPlayDispatchDone', '0');
			});
			
			before(function () {
				return browser.pressButton(KOMPlayToolbarDoneButton);
			});

			it('sends KOMPlayDispatchDone', function () {
				browser.assert.text('#TestKOMPlayDispatchDone', '1');
			});

		});
	
	});

	describe('KOMPlayCard', function test_KOMPlayCard () {

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KOMPlayCard, 'OLSKLayoutElementTappable');
		});

	});

	describe('KOMPlayCardQuestion', function test_KOMPlayCardQuestion () {

		it('sets text', function () {
			browser.assert.text(KOMPlayCardQuestion, items[0].$KOMSpacingCard.KOMCardFront);
		});

	});

	describe('KOMPlayFlipButton', function test_KOMPlayFlipButton () {

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KOMPlayFlipButton, 'OLSKLayoutButtonNoStyle');
		});

	});

	describe('KOMPlayCardAnswer', function test_KOMPlayCardAnswer () {

		before(function () {
			return browser.pressButton(KOMPlayFlipButton);
		});

		it('sets text', function () {
			browser.assert.text(KOMPlayCardAnswer, items[0].$KOMSpacingCard.KOMCardRear);
		});

	});

	describe('KOMPlayCardHint', function test_KOMPlayCardHint () {

		it('sets text', function () {
			browser.assert.text(KOMPlayCardHint, items[0].$KOMSpacingCard.KOMCardHint);
		});

	});

	describe('KOMPlayResponseButtonAgain', function test_KOMPlayResponseButtonAgain () {

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KOMPlayResponseButtonAgain, 'OLSKLayoutButtonNoStyle');
		});

		context('click', function () {

			before(function () {
				browser.assert.text('#TestKOMPlayStateQueueCount', '4');
			});

			before(function () {
				browser.assert.text('#TestKOMPlayStateWaitCount', '0');
			});

			before(function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '2');
				// browser.assert.text('#TestKOMPlayDispatchUpdateData', 'undefined');
			});

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonAgain);
			});
			
			it('updates KOMPlayStateQueue', function () {
				browser.assert.text('#TestKOMPlayStateQueueCount', '3');
			});

			it('updates KOMPlayStateWait', function () {
				browser.assert.text('#TestKOMPlayStateWaitCount', '1');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '4');
				// browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate', 'KOMSpacingIsLearning', 'KOMSpacingDueDate'])));
			});

			it('updates KOMPlayStateCurrent', function () {
				browser.assert.text(KOMPlayCardQuestion, items[1].$KOMSpacingCard.KOMCardFront);
			});
		
		});

	});

	describe('KOMPlayResponseButtonHard', function test_KOMPlayResponseButtonHard () {

		before(function () {
			return browser.pressButton(KOMPlayFlipButton);
		});

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KOMPlayResponseButtonHard, 'OLSKLayoutButtonNoStyle');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '5');
			});

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonHard);
			});

			it('updates KOMPlayStateQueue', function () {
				browser.assert.text('#TestKOMPlayStateQueueCount', '2');
			});

			it('updates KOMPlayStateWait', function () {
				browser.assert.text('#TestKOMPlayStateWaitCount', '1');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '7');
				// browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[1]).concat('KOMSpacingDrawDate', 'KOMSpacingFlipDate')));
			});

			it('updates KOMPlayStateCurrent', function () {
				browser.assert.text(KOMPlayCardQuestion, items[2].$KOMSpacingCard.KOMCardFront);
			});
		
		});

	});

	describe('KOMPlayResponseButtonGood', function test_KOMPlayResponseButtonGood () {

		before(function () {
			return browser.pressButton(KOMPlayFlipButton);
		});

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KOMPlayResponseButtonGood, 'OLSKLayoutButtonNoStyle');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '8');
			});

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonGood);
			});

			it('updates KOMPlayStateQueue', function () {
				browser.assert.text('#TestKOMPlayStateQueueCount', '1');
			});

			it('updates KOMPlayStateWait', function () {
				browser.assert.text('#TestKOMPlayStateWaitCount', '2');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '10');
			// 	browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[2]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate', 'KOMSpacingIsLearning', 'KOMSpacingDueDate'])));
			});

			it('updates KOMPlayStateCurrent', function () {
				browser.assert.text(KOMPlayCardQuestion, items[3].$KOMSpacingCard.KOMCardFront);
			});
		
		});

	});

	describe('KOMPlayResponseButtonEasy', function test_KOMPlayResponseButtonEasy () {

		before(function () {
			return browser.pressButton(KOMPlayFlipButton);
		});

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KOMPlayResponseButtonEasy, 'OLSKLayoutButtonNoStyle');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '11');
			});

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});

			it('updates KOMPlayStateQueue', function () {
				browser.assert.text('#TestKOMPlayStateQueueCount', '0');
			});

			it('updates KOMPlayStateWait', function () {
				browser.assert.text('#TestKOMPlayStateWaitCount', '2');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '13');
				// browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[3]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate', 'KOMSpacingInterval', 'KOMSpacingMultiplier', 'KOMSpacingDueDate'])));
			});

			it('updates KOMPlayStateCurrent', function () {
				browser.assert.text(KOMPlayCardQuestion, items[4].$KOMSpacingCard.KOMCardFront);
			});
		
		});

	});

	describe('Space', function test_Space () {

		before(function () {
			browser.assert.elements(KOMPlayResponseButtonAgain, 0);
		});

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Space');
		});

		it('flips card', function () {
			browser.assert.elements(KOMPlayResponseButtonAgain, 1);
		});

		context('flipped', function () {
			
			before(function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '14');
			});

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Space');
			});

			it('updates KOMPlayStateQueue', function () {
				browser.assert.text('#TestKOMPlayStateQueueCount', '2');
			});

			it('updates KOMPlayStateWait', function () {
				browser.assert.text('#TestKOMPlayStateWaitCount', '0');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '16');
				// browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[4]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate', 'KOMSpacingIsLearning', 'KOMSpacingDueDate'])));
			});

			it('updates KOMPlayStateCurrent', function () {
				browser.assert.text(KOMPlayCardQuestion, items[0].$KOMSpacingCard.KOMCardFront);
			});
		
		});

	});

	context('digits', function () {
		
		const items = kTesting.uSpacings(4);

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMPlaySpacings: JSON.stringify(items),
				KOMPlayDeck: JSON.stringify(kTesting.uDeck()),
			});
		});

		describe('Digit1', function test_Digit1 () {

			before(function () {
				browser.assert.elements(KOMPlayResponseButtonAgain, 0);
			});

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Digit1');
			});

			it('does nothing', function () {
				browser.assert.elements(KOMPlayResponseButtonAgain, 0);
			});

			context('flipped', function () {
				
				before(function () {
					return browser.pressButton(KOMPlayFlipButton);
				});

				before(function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '2');
				});

				before(function () {
					return browser.OLSKFireKeyboardEvent(browser.window, 'Digit1');
				});

				it('updates KOMPlayStateQueue', function () {
					browser.assert.text('#TestKOMPlayStateQueueCount', '2');
				});

				it('updates KOMPlayStateWait', function () {
					browser.assert.text('#TestKOMPlayStateWaitCount', '1');
				});

				it('sends KOMPlayDispatchUpdate', function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '4');
					// browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate', 'KOMSpacingIsLearning', 'KOMSpacingDueDate'])));
				});

				it('updates KOMPlayStateCurrent', function () {
					browser.assert.text(KOMPlayCardQuestion, items[1].$KOMSpacingCard.KOMCardFront);
				});
			
			});

		});

		describe('Digit2', function test_Digit2 () {

			before(function () {
				browser.assert.elements(KOMPlayResponseButtonAgain, 0);
			});

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Digit2');
			});

			it('does nothing', function () {
				browser.assert.elements(KOMPlayResponseButtonAgain, 0);
			});

			context('flipped', function () {
				
				before(function () {
					return browser.pressButton(KOMPlayFlipButton);
				});

				before(function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '5');
				});

				before(function () {
					return browser.OLSKFireKeyboardEvent(browser.window, 'Digit2');
				});

				it('updates KOMPlayStateQueue', function () {
					browser.assert.text('#TestKOMPlayStateQueueCount', '1');
				});

				it('updates KOMPlayStateWait', function () {
					browser.assert.text('#TestKOMPlayStateWaitCount', '2');
				});

				it('sends KOMPlayDispatchUpdate', function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '7');
					// browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[1]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate', 'KOMSpacingIsLearning', 'KOMSpacingDueDate'])));
				});

				it('updates KOMPlayStateCurrent', function () {
					browser.assert.text(KOMPlayCardQuestion, items[2].$KOMSpacingCard.KOMCardFront);
				});
			
			});

		});

		describe('Digit3', function test_Digit3 () {

			before(function () {
				browser.assert.elements(KOMPlayResponseButtonAgain, 0);
			});

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Digit3');
			});

			it('does nothing', function () {
				browser.assert.elements(KOMPlayResponseButtonAgain, 0);
			});

			context('flipped', function () {
				
				before(function () {
					return browser.pressButton(KOMPlayFlipButton);
				});

				before(function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '8');
				});

				before(function () {
					return browser.OLSKFireKeyboardEvent(browser.window, 'Digit3');
				});

				it('updates KOMPlayStateQueue', function () {
					browser.assert.text('#TestKOMPlayStateQueueCount', '0');
				});

				it('updates KOMPlayStateWait', function () {
					browser.assert.text('#TestKOMPlayStateWaitCount', '3');
				});

				it('sends KOMPlayDispatchUpdate', function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '10');
					// browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[2]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate', 'KOMSpacingIsLearning', 'KOMSpacingDueDate'])));
				});

				it('updates KOMPlayStateCurrent', function () {
					browser.assert.text(KOMPlayCardQuestion, items[3].$KOMSpacingCard.KOMCardFront);
				});
			
			});

		});

		describe('Digit4', function test_Digit4 () {

			before(function () {
				browser.assert.elements(KOMPlayResponseButtonAgain, 0);
			});

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Digit4');
			});

			it('does nothing', function () {
				browser.assert.elements(KOMPlayResponseButtonAgain, 0);
			});

			context('flipped', function () {
				
				before(function () {
					return browser.pressButton(KOMPlayFlipButton);
				});

				before(function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '11');
				});

				before(function () {
					return browser.OLSKFireKeyboardEvent(browser.window, 'Digit4');
				});

				it('updates KOMPlayStateQueue', function () {
					browser.assert.text('#TestKOMPlayStateQueueCount', '2');
				});

				it('updates KOMPlayStateWait', function () {
					browser.assert.text('#TestKOMPlayStateWaitCount', '0');
				});

				it('sends KOMPlayDispatchUpdate', function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '13');
					// browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate', 'KOMSpacingInterval', 'KOMSpacingMultiplier', 'KOMSpacingDueDate'])));
				});
			
			});

		});
	
	});

	describe('backwards', function test_backwards () {

		const items = kTesting.uSpacings(1).map(function (e, i) {
			return Object.assign(e, {
				KOMSpacingID: (i + 1).toString() + '-' + 'backward',
			});
		});

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMPlaySpacings: JSON.stringify(items),
				KOMPlayDeck: JSON.stringify(kTesting.uDeck()),
			});
		});

		context('KOMPlayCardQuestion', function () {

			it('sets text', function () {
				browser.assert.text(KOMPlayCardQuestion, items[0].$KOMSpacingCard.KOMCardRear);
			});

		});

		context('KOMPlayCardAnswer', function () {

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			it('sets text', function () {
				browser.assert.text(KOMPlayCardAnswer, items[0].$KOMSpacingCard.KOMCardFront);
			});

		});

	});

	describe('review', function test_review () {

		const items = kTesting.uSpacings(2);

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMPlaySpacings: JSON.stringify(items),
				KOMPlayDeck: JSON.stringify(kTesting.uDeck()),
			});
		});

		before(function () {
			return browser.pressButton(KOMPlayFlipButton);
		});

		before(function () {
			return browser.pressButton(KOMPlayResponseButtonGood);
		});

		before(function () {
			return browser.pressButton(KOMPlayFlipButton);
		});

		before(function () {
			browser.assert.text('#TestKOMPlayStateQueueCount', '0');
		});

		before(function () {
			browser.assert.text('#TestKOMPlayStateWaitCount', '1');
		});

		before(function () {
			return browser.pressButton(KOMPlayResponseButtonGood);
		});

		it('updates KOMPlayStateQueue', function () {
			browser.assert.text('#TestKOMPlayStateQueueCount', '1');
		});

		it('updates KOMPlayStateWait', function () {
			browser.assert.text('#TestKOMPlayStateWaitCount', '0');
		});

		it('updates KOMPlayStateCurrent', function () {
			browser.assert.text(KOMPlayCardQuestion, items[0].$KOMSpacingCard.KOMCardFront);
		});

	});

	describe('conclusion', function test_conclusion () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMPlaySpacings: JSON.stringify(kTesting.uSpacings(1)),
				KOMPlayDeck: JSON.stringify(kTesting.uDeck()),
			});
		});

		before(function () {
			return browser.pressButton(KOMPlayFlipButton);
		});

		before(function () {
			browser.assert.text('#TestKOMPlayDispatchDone', '0');
		});

		before(function () {
			return browser.pressButton(KOMPlayResponseButtonEasy);
		});
		
		it('sends KOMPlayDispatchDone', function () {
			browser.assert.text('#TestKOMPlayDispatchDone', '1');
		});

	});

	describe('KOMSpacingDrawDate', function test_KOMSpacingDrawDate () {

		const items = kTesting.uSpacings(3).map(function (e, i) {
			return !i ? e : Object.assign(e, {
				KOMSpacingDrawDate: new Date(Date.now() - (i === 1 ? 1000 * 60 * 60 * 24 * 3 : 0)),
			});
		});

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMPlaySpacings: JSON.stringify(items),
				KOMPlayDeck: JSON.stringify(kTesting.uDeck()),
			});
		});

		context('undefined', function () {

			// before(function () {
			// 	browser.assert.text('#TestKOMPlayDispatchUpdate', '0');
			// 	browser.assert.text('#TestKOMPlayDispatchUpdateData', 'undefined');
			// });

			it('sets KOMSpacingDrawDate', function () {
				browser.assert.text('#TestKOMSpacingDrawDate', KOMPlayLogic.KOMPlayDayGrouping(new Date()));
			});
			
			it('sets no KOMChronicleDidDrawMultipleTimes', function () {
				browser.assert.text('#TestKOMChronicleDidDrawMultipleTimes', 'undefined');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '1');
				browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingDrawDate'])));
			});
		
		});

		context('past', function () {

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});
			
			it('sets KOMSpacingDrawDate', function () {
				browser.assert.text('#TestKOMSpacingDrawDate', KOMPlayLogic.KOMPlayDayGrouping(new Date()));
			});
			
			it('sets no KOMChronicleDidDrawMultipleTimes', function () {
				browser.assert.text('#TestKOMChronicleDidDrawMultipleTimes', 'undefined');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '4');
				browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingDrawDate'])));
			});
		
		});

		context('today', function () {

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});

			it('sets KOMSpacingDrawDate', function () {
				browser.assert.text('#TestKOMSpacingDrawDate', KOMPlayLogic.KOMPlayDayGrouping(new Date()));
			});
			
			it('sets KOMChronicleDidDrawMultipleTimes', function () {
				browser.assert.text('#TestKOMChronicleDidDrawMultipleTimes', 'true');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '7');
				browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingDrawDate'])));
			});
		
		});

	});

	describe('KOMSpacingFlipDate', function test_KOMSpacingFlipDate () {

		const items = kTesting.uSpacings(3).map(function (e, i) {
			return !i ? e : Object.assign(e, {
				KOMSpacingFlipDate: new Date(Date.now() - (i === 1 ? 1000 * 60 * 60 * 24 * 3 : 0)),
			});
		});

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMPlaySpacings: JSON.stringify(items),
				KOMPlayDeck: JSON.stringify(kTesting.uDeck()),
			});
		});

		context('undefined', function () {

			before(function () {
				browser.assert.text('#TestKOMSpacingFlipDate', 'undefined');
			});

			before(function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '1');
				// browser.assert.text('#TestKOMPlayDispatchUpdateData', 'undefined');
			});

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			it('sets KOMSpacingFlipDate', function () {
				browser.assert.text('#TestKOMSpacingFlipDate', KOMPlayLogic.KOMPlayDayGrouping(new Date()));
			});
			
			it('sets no KOMChronicleDidFlipMultipleTimes', function () {
				browser.assert.text('#TestKOMChronicleDidFlipMultipleTimes', 'undefined');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '2');
				browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate'])));
			});	
		
		});

		context('past', function () {

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});
			
			before(function () {
				browser.assert.text('#TestKOMSpacingFlipDate', KOMPlayLogic.KOMPlayDayGrouping(items[1].KOMSpacingFlipDate));
			});

			before(function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '4');
				// browser.assert.text('#TestKOMPlayDispatchUpdateData', 'undefined');
			});

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});
			
			it('sets KOMSpacingFlipDate', function () {
				browser.assert.text('#TestKOMSpacingFlipDate', KOMPlayLogic.KOMPlayDayGrouping(new Date()));
			});
			
			it('sets no KOMChronicleDidFlipMultipleTimes', function () {
				browser.assert.text('#TestKOMChronicleDidFlipMultipleTimes', 'undefined');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '5');
				browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingFlipDate', 'KOMSpacingDrawDate'])));
			});	
		
		});

		context('today', function () {

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});
			
			before(function () {
				browser.assert.text('#TestKOMSpacingFlipDate', KOMPlayLogic.KOMPlayDayGrouping(items[2].KOMSpacingFlipDate));
			});

			before(function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '7');
				// browser.assert.text('#TestKOMPlayDispatchUpdateData', 'undefined');
			});

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});
			
			it('sets KOMSpacingFlipDate', function () {
				browser.assert.text('#TestKOMSpacingFlipDate', KOMPlayLogic.KOMPlayDayGrouping(new Date()));
			});
			
			it('sets KOMChronicleDidFlipMultipleTimes', function () {
				browser.assert.text('#TestKOMChronicleDidFlipMultipleTimes', 'true');
			});

			it('sends KOMPlayDispatchUpdate', function () {
				browser.assert.text('#TestKOMPlayDispatchUpdate', '8');
				browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingFlipDate', 'KOMSpacingDrawDate'])));
			});	
		
		});

	});

	describe('KOMPlayToolbarUndoButton', function test_KOMPlayToolbarUndoButton () {
	
		const items = kTesting.uSpacings(3);

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMPlaySpacings: JSON.stringify(items),
				KOMPlayDeck: JSON.stringify(kTesting.uDeck()),
			});
		});

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KOMPlayToolbarUndoButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KOMPlayToolbarUndoButton, 'OLSKLayoutElementTappable');
		});

		it('sets disabled', function () {
			browser.assert.attribute(KOMPlayToolbarUndoButton, 'disabled', '');
		});

		context('graduate', function () {

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});

			it('sets disabled', function () {
				browser.assert.attribute(KOMPlayToolbarUndoButton, 'disabled', null);
			});

			context('click', function () {

				before(function () {
					browser.assert.text('#TestKOMPlayStateQueueCount', '1');
				});

				before(function () {
					browser.assert.text('#TestKOMPlayStateWaitCount', '0');
				});

				before(function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '4');
					// browser.assert.text('#TestKOMPlayDispatchUpdateData', 'undefined');
				});
				
				before(function () {
					return browser.pressButton(KOMPlayToolbarUndoButton);
				});

				it('updates KOMPlayStateQueue', function () {
					browser.assert.text('#TestKOMPlayStateQueueCount', '2');
				});

				it('updates KOMPlayStateWait', function () {
					browser.assert.text('#TestKOMPlayStateWaitCount', '0');
				});

				it('sends KOMPlayDispatchUpdate', function () {
					browser.assert.text('#TestKOMPlayDispatchUpdate', '5');
					browser.assert.text('#TestKOMPlayDispatchUpdateData', JSON.stringify(Object.keys(items[0]).concat(['KOMSpacingDrawDate', 'KOMSpacingFlipDate'])));
				});

				it('updates KOMPlayStateCurrent', function () {
					browser.assert.text(KOMPlayCardQuestion, items[0].$KOMSpacingCard.KOMCardFront);
				});

				it('sets disabled', function () {
					browser.assert.attribute(KOMPlayToolbarUndoButton, 'disabled', '');
				});
				
			});

		});

	});

	describe('oral_front', function test_oral_front () {

		const items = kTesting.uSpacings(2).sort(function (a, b) {
			return a.KOMSpacingID > b.KOMSpacingID;
		}).map(function (e, i) {
			return Object.assign(e, i ? {
				KOMSpacingID: e.KOMSpacingID.replace('forward', 'backward')
			} : {})
		});

		const deck = Object.assign(kTesting.uDeck(), {
			KOMDeckFrontIsOral: true,
			KOMDeckFrontLanguageCode: 'en',
		});

		const _log = [];
		const uLog = function (inputData) {
			_log.push(inputData);
			return _log.join(',');
		};

		before(function () {
			browser.assert.text('#TestKOMPlayOralLog', '');
		});
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMPlaySpacings: JSON.stringify(items),
				KOMPlayDeck: JSON.stringify(deck),
			});
		});

		it('starts read', function () {
			browser.assert.text('#TestKOMPlayOralLog', uLog(`read:${ deck.KOMDeckFrontLanguageCode }:${ items[0].$KOMSpacingCard.KOMCardFront }`));
		});

		context('KOMPlayCardQuestionRepeatButton', function () {

			it('sets tabindex', function () {
				browser.assert.attribute(KOMPlayCardQuestionRepeatButton, 'tabindex', '-1');
			});

			context('click', function () {
				
				before(function () {
					return browser.pressButton(KOMPlayCardQuestionRepeatButton);
				});

				it('starts read', function () {
					browser.assert.text('#TestKOMPlayOralLog', uLog(`read:${ deck.KOMDeckFrontLanguageCode }:${ items[0].$KOMSpacingCard.KOMCardFront }`));
				});
			
			});

		});

		context('flip', function () {

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			it('stop read', function () {
				browser.assert.text('#TestKOMPlayOralLog', uLog('stop'));
			});

		});

		context('respond', function () {

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});

			it('does nothing', function () {
				browser.assert.text('#TestKOMPlayOralLog', _log.join(','));
			});

		});

		context('undo', function () {

			before(function () {
				return browser.pressButton(KOMPlayToolbarUndoButton);
			});

			it('starts read', function () {
				browser.assert.text('#TestKOMPlayOralLog', uLog(`read:${ deck.KOMDeckFrontLanguageCode }:${ items[0].$KOMSpacingCard.KOMCardFront }`));
			});
			
		});

		context('reverse', function () {

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			it('starts read', function () {
				browser.assert.text('#TestKOMPlayOralLog', uLog(`stop,read:${ deck.KOMDeckFrontLanguageCode }:${ items[1].$KOMSpacingCard.KOMCardFront }`));
			});

		});

		context('KOMPlayCardAnswerRepeatButton', function () {

			it('sets tabindex', function () {
				browser.assert.attribute(KOMPlayCardAnswerRepeatButton, 'tabindex', '-1');
			});

			context('click', function () {
				
				before(function () {
					return browser.pressButton(KOMPlayCardAnswerRepeatButton);
				});

				it('starts read', function () {
					browser.assert.text('#TestKOMPlayOralLog', uLog(`read:${ deck.KOMDeckFrontLanguageCode }:${ items[1].$KOMSpacingCard.KOMCardFront }`));
				});
			
			});

		});

	});

	describe('oral_rear', function test_oral_rear () {

		const items = kTesting.uSpacings(2).sort(function (a, b) {
			return a.KOMSpacingID > b.KOMSpacingID;
		}).map(function (e, i) {
			return Object.assign(e, i ? {
				KOMSpacingID: e.KOMSpacingID.replace('forward', 'backward')
			} : {})
		});

		const deck = Object.assign(kTesting.uDeck(), {
			KOMDeckRearIsOral: true,
			KOMDeckRearLanguageCode: 'en',
		});

		const _log = [];
		const uLog = function (inputData) {
			_log.push(inputData);
			return _log.join(',');
		};

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMPlaySpacings: JSON.stringify(items),
				KOMPlayDeck: JSON.stringify(deck),
			});
		});

		it('skips read', function () {
			browser.assert.text('#TestKOMPlayOralLog', '');
		});

		context('flip', function () {

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			it('starts read', function () {
				browser.assert.text('#TestKOMPlayOralLog', uLog(`read:${ deck.KOMDeckRearLanguageCode }:${ items[0].$KOMSpacingCard.KOMCardRear }`));
			});

		});

		context('KOMPlayCardAnswerRepeatButton', function () {

			before(function () {
				return browser.pressButton(KOMPlayCardAnswerRepeatButton);
			});

			it('starts read', function () {
				browser.assert.text('#TestKOMPlayOralLog', uLog(`read:${ deck.KOMDeckRearLanguageCode }:${ items[0].$KOMSpacingCard.KOMCardRear }`));
			});
			
		});

		context('respond', function () {

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});

			it('starts read', function () {
				browser.assert.text('#TestKOMPlayOralLog', uLog(`stop,read:${ deck.KOMDeckRearLanguageCode }:${ items[1].$KOMSpacingCard.KOMCardRear }`));
			});

		});

		context('undo', function () {

			before(function () {
				return browser.pressButton(KOMPlayToolbarUndoButton);
			});

			it('does nothing', function () {
				browser.assert.text('#TestKOMPlayOralLog', _log.join(','));
			});
			
		});

		context('reverse', function () {

			before(function () {
				return browser.pressButton(KOMPlayFlipButton);
			});

			before(function () {
				uLog(`read:${ deck.KOMDeckRearLanguageCode }:${ items[1].$KOMSpacingCard.KOMCardRear }`);
			});

			before(function () {
				return browser.pressButton(KOMPlayResponseButtonEasy);
			});

			it('starts read', function () {
				browser.assert.text('#TestKOMPlayOralLog', uLog(`stop,read:${ deck.KOMDeckRearLanguageCode }:${ items[1].$KOMSpacingCard.KOMCardRear }`));
			});

		});

		context('KOMPlayCardQuestionRepeatButton', function () {

			before(function () {
				return browser.pressButton(KOMPlayCardQuestionRepeatButton);
			});

			it('starts read', function () {
				browser.assert.text('#TestKOMPlayOralLog', uLog(`read:${ deck.KOMDeckRearLanguageCode }:${ items[1].$KOMSpacingCard.KOMCardRear }`));
			});
			
		});

	});

});
