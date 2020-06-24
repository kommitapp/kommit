const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();
const KOMReviewLogic = require('../../ui-logic.js').default;

const kTesting = {
	uSpacings (inputData) {
		return Array.from(new Array(2)).map(function (e, i) {
			return {
				KOMSpacingID: (i + 1).toString() + '-forward',
				KOMSpacingChronicles: [],
				$KOMSpacingCard: {
					KOMCardID: (i + 1).toString(),
					KOMCardDeckID: 'alfa',
					KOMCardFrontText: (i + 1).toString(),
					KOMCardRearText: 'charlie',
					KOMCardNotes: 'delta',
					KOMCardCreationDate: new Date('2019-02-23T13:56:36Z'),
					KOMCardModificationDate: new Date('2019-02-23T13:56:36Z'),
				},
			};
		}).map(function (e, i) {
			if (!inputData) {
				return e;
			}

			if (i) {
				return e;
			}

			return Object.assign(e, {
				KOMSpacingDueDate: new Date((new Date()).toJSON().slice(0, 10)),
			});
		});
	},
	uDeck (inputData = {}) {
		return Object.assign({
			KOMDeckName: 'alfa',
			$KOMDeckSpacings: [],
		}, inputData);
	},
};

describe('KOMReviewDetail_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KOMReviewDetailDeck: JSON.stringify(kTesting.uDeck()),
		});
	});

	describe('KOMReviewDetailToolbar', function test_KOMReviewDetailToolbar () {

		it('classes OLSKToolbar', function () {
			browser.assert.hasClass(KOMReviewDetailToolbar, 'OLSKToolbar');
		});

		it('classes OLSKToolbarJustify', function () {
			browser.assert.hasClass(KOMReviewDetailToolbar, 'OLSKToolbarJustify');
		});
	
	});

	describe('KOMReviewDetailToolbarBackButton', function test_KOMReviewDetailToolbarBackButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KOMReviewDetailToolbarBackButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KOMReviewDetailToolbarBackButton, 'OLSKLayoutElementTappable');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewDetailDispatchBack', '0');
			});
			
			before(function () {
				return browser.pressButton(KOMReviewDetailToolbarBackButton);
			});

			it('sends KOMReviewDetailDispatchBack', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchBack', '1');
			});
		
		});
	
	});

	describe('KOMReviewDetailToolbarBackButtonImage', function test_KOMReviewDetailToolbarBackButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KOMReviewDetailToolbarBackButtonImage } #_OLSKSharedBack`, 1);
		});
	
	});

	describe('KOMReviewDetailToolbarTitle', function test_KOMReviewDetailToolbarTitle () {
		
		it('sets text', function () {
			browser.assert.text(KOMReviewDetailToolbarTitle, kTesting.uDeck().KOMDeckName);
		});
	
	});

	describe('KOMReviewDetailToolbarCardsButton', function test_KOMReviewDetailToolbarCardsButton () {
		
		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewDetailDispatchBrowse', '0');
			});
			
			before(function () {
				return browser.pressButton(KOMReviewDetailToolbarCardsButton);
			});

			it('sends KOMReviewDetailDispatchBrowse', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchBrowse', '1');
			});
		
		});
	
	});

	describe('KOMReviewDetailDiscardButton', function test_KOMReviewDetailDiscardButton () {
		
		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewDetailDispatchDiscard', '0');
				browser.assert.text('#TestKOMReviewDetailDispatchDiscardData', 'undefined');
			});
			
			before(function () {
				return browser.pressButton(KOMReviewDetailDiscardButton);
			});

			it('sends KOMReviewDetailDispatchDiscard', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchDiscard', '1');
				browser.assert.text('#TestKOMReviewDetailDispatchDiscardData', JSON.stringify(kTesting.uDeck()));
			});
		
		});
	
	});

	describe('KOMReviewDetailRenameButton', function test_KOMReviewDetailRenameButton () {
		
		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '0');
				browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', 'undefined');
			});
			
			it('sets KOMReviewDetailRenameButtonPrompt response', function() {
				browser.assert.OLSKPromptResponse(function () {
					return browser.pressButton(KOMReviewDetailRenameButton);
				}, kTesting.uDeck().KOMDeckName);
			});

			context('edit', function () {
				
				before(function () {
					return browser.OLSKPrompt(function () {
						return browser.pressButton(KOMReviewDetailRenameButton);
					}, function (dialog) {
						dialog.response = 'bravo';

						return dialog;
					});
				});

				it('sends KOMReviewDetailDispatchUpdate', function () {
					browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '1');
					browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', JSON.stringify(Object.assign(kTesting.uDeck(), {
						KOMDeckName: 'bravo',
					})));
				});
			
			});
		
		});
	
	});

	describe('KOMReviewDetailFormAudioIsEnabledField', function test_KOMReviewDetailFormAudioIsEnabledField () {

		const item = {
			KOMDeckName: 'alfa',
			$KOMDeckSpacings: kTesting.uSpacings(true),
		};

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewDetailDeck: JSON.stringify(item),
			});
		});

		it('sets type', function () {
			browser.assert.attribute(KOMReviewDetailFormAudioIsEnabledField, 'type', 'checkbox');
		});
		
		it('binds KOMDeckIsForwardOnly', function () {
			browser.assert.OLSKIsChecked(KOMReviewDetailFormAudioIsEnabledField, false);
		});
		
		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '0');
				browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', 'undefined');
			});
			
			before(function () {
				return browser.check(KOMReviewDetailFormAudioIsEnabledField);
			});

			it('sends KOMReviewDetailDispatchUpdate', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '1');
				browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', JSON.stringify(Object.assign(item, {
					KOMDeckAudioIsEnabled: true,
				})));
			});
		
		});
	
	});

	describe('KOMReviewDetailFormFrontLanguageCode', function test_KOMReviewDetailFormFrontLanguageCode () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewDetailDeck: JSON.stringify(kTesting.uDeck({
					KOMDeckFrontLanguageCode: '',
					$KOMDeckSpacings: kTesting.uSpacings(true),
				})),
			});
		});

		it('binds KOMDeckFrontLanguageCode', function () {
			browser.assert.input(`${ KOMReviewDetailFormFrontLanguageCode } .KOMReviewDetailLanguageCodeField`, '');
		});
	
	});

	describe('KOMReviewDetailFormFrontSpeechIsEnabledField', function test_KOMReviewDetailFormFrontSpeechIsEnabledField () {

		const uItem = function () {
			return kTesting.uDeck({
				KOMDeckFrontLanguageCode: '',
				$KOMDeckSpacings: kTesting.uSpacings(true),
			})
		};

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewDetailDeck: JSON.stringify(uItem()),
			});
		});

		it('sets type', function () {
			browser.assert.attribute(KOMReviewDetailFormFrontSpeechIsEnabledField, 'type', 'checkbox');
		});
		
		it('binds KOMDeckFrontSpeechIsEnabled', function () {
			browser.assert.OLSKIsChecked(KOMReviewDetailFormRearSpeechIsEnabledField, false);
		});

		context('check', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '0');
				browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', 'undefined');
			});
			
			before(function () {
				return browser.check(KOMReviewDetailFormFrontSpeechIsEnabledField);
			});

			it('sends KOMReviewDetailDispatchUpdate', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '1');
				browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', JSON.stringify(Object.assign(uItem(), {
					KOMDeckFrontSpeechIsEnabled: true,
				})));
			});
		
		});

	});

	describe('KOMReviewDetailFormRearSpeechIsEnabledField', function test_KOMReviewDetailFormRearSpeechIsEnabledField () {

		const uItem = function () {
			return kTesting.uDeck({
				KOMDeckRearLanguageCode: '',
				$KOMDeckSpacings: kTesting.uSpacings(true),
			})
		};

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewDetailDeck: JSON.stringify(uItem()),
			});
		});

		it('sets type', function () {
			browser.assert.attribute(KOMReviewDetailFormRearSpeechIsEnabledField, 'type', 'checkbox');
		});
		
		it('binds KOMDeckRearSpeechIsEnabled', function () {
			browser.assert.OLSKIsChecked(KOMReviewDetailFormRearSpeechIsEnabledField, false);
		});

		context('check', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '0');
				browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', 'undefined');
			});
			
			before(function () {
				return browser.check(KOMReviewDetailFormRearSpeechIsEnabledField);
			});

			it('sends KOMReviewDetailDispatchUpdate', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '1');
				browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', JSON.stringify(Object.assign(uItem(), {
					KOMDeckRearSpeechIsEnabled: true,
				})));
			});
		
		});

	});

	describe('KOMReviewDetailFormIsForwardOnlyField', function test_KOMReviewDetailFormIsForwardOnlyField () {

		const item = {
			KOMDeckName: 'alfa',
			$KOMDeckSpacings: kTesting.uSpacings(true),
		};

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewDetailDeck: JSON.stringify(item),
			});
		});

		it('sets type', function () {
			browser.assert.attribute(KOMReviewDetailFormIsForwardOnlyField, 'type', 'checkbox');
		});
		
		it('binds KOMDeckIsForwardOnly', function () {
			browser.assert.OLSKIsChecked(KOMReviewDetailFormIsForwardOnlyField, false);
		});
		
		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '0');
				browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', 'undefined');
			});
			
			before(function () {
				return browser.check(KOMReviewDetailFormIsForwardOnlyField);
			});

			it('sends KOMReviewDetailDispatchUpdate', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchUpdate', '1');
				browser.assert.text('#TestKOMReviewDetailDispatchUpdateData', JSON.stringify(Object.assign(item, {
					KOMDeckIsForwardOnly: true,
				})));
			});
		
		});

		after(function () {
			return browser.uncheck(KOMReviewDetailFormIsForwardOnlyField);
		});
	
	});

	describe('KOMReviewDetailPlayButtonReviewing', function test_KOMReviewDetailPlayButtonReviewing () {

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewDetailDispatchPlay', '0');
				browser.assert.text('#TestKOMReviewDetailDispatchPlayData', 'undefined');
			});
			
			before(function () {
				return browser.pressButton(KOMReviewDetailPlayButtonReviewing);
			});

			it('sends KOMReviewDetailDispatchPlay', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchPlay', '1');
				browser.assert.text('#TestKOMReviewDetailDispatchPlayData', JSON.stringify({
					KOMReviewScheme: KOMReviewLogic.KOMReviewSchemeReviewing(),
				}));
			});
		
		});

	});

	describe('KOMReviewDetailPlayButtonUnseen', function test_KOMReviewDetailPlayButtonUnseen () {

		context('click', function () {
			
			before(function () {
				return browser.pressButton(KOMReviewDetailPlayButtonUnseen);
			});

			it('sends KOMReviewDetailDispatchPlay', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchPlay', '2');
				browser.assert.text('#TestKOMReviewDetailDispatchPlayData', JSON.stringify({
					KOMReviewScheme: KOMReviewLogic.KOMReviewSchemeUnseen(),
					KOMReviewMaxUnseenCards: 10,
				}));
			});
		
		});

	});

	describe('KOMReviewDetailPlayButtonMixed', function test_KOMReviewDetailPlayButtonMixed () {

		context('click', function () {
			
			before(function () {
				return browser.pressButton(KOMReviewDetailPlayButtonMixed);
			});

			it('sends KOMReviewDetailDispatchPlay', function () {
				browser.assert.text('#TestKOMReviewDetailDispatchPlay', '3');
				browser.assert.text('#TestKOMReviewDetailDispatchPlayData', JSON.stringify({
					KOMReviewScheme: KOMReviewLogic.KOMReviewSchemeMixed(),
					KOMReviewMaxUnseenCards: 10,
				}));
			});
		
		});

	});	

	describe('KOMReviewDetailStatsToday', function test_KOMReviewDetailStatsToday () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewDetailDeck: JSON.stringify({
					KOMDeckName: 'alfa',
					KOMDeckIsForwardOnly: true,
					$KOMDeckSpacings: kTesting.uSpacings().map(function (e, i) {
						return Object.assign(e, i ? {
							KOMSpacingDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
						} : {
							KOMSpacingID: e.KOMSpacingID.replace('forward', 'backward'),
							KOMSpacingChronicles: [{
								KOMChronicleDrawDate: new Date(),
								KOMChronicleFlipDate: new Date(),
								KOMChronicleResponseDate: new Date(),
								KOMChronicleResponseType: 'alfa',
							}],
						});
					}),
				}),
			});
		});

		it('sets KOMReviewTodaySpacings', function () {
			browser.assert.text(`${ KOMReviewDetailStatsToday } .KOMReviewTodayTotalCardsValue`, '1');
		});

	});

});
