const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KOMReviewMaster_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	describe('KOMReviewMasterToolbar', function test_KOMReviewMasterToolbar () {

		it('classes OLSKToolbar', function () {
			browser.assert.hasClass(KOMReviewMasterToolbar, 'OLSKToolbar');
		});

		it('classes OLSKToolbarJustify', function () {
			browser.assert.hasClass(KOMReviewMasterToolbar, 'OLSKToolbarJustify');
		});
	
	});

	describe('KOMReviewMasterCreateButton', function test_KOMReviewMasterCreateButton () {

		it('sets accesskey', function () {
			browser.assert.attribute(KOMReviewMasterCreateButton, 'accesskey', 'n');
		});

		context('click', function () {

			before(function() {
				return browser.OLSKPromptSync(function () {
					browser.pressButton(KOMReviewMasterCreateButton);
				});
			});
			
			before(function () {
				browser.assert.text('#TestKOMReviewMasterDispatchCreate', '0');
				browser.assert.text('#TestKOMReviewMasterDispatchCreateData', 'undefined');
			});
			
			before(function () {
				return browser.OLSKPrompt(function () {
					return browser.pressButton(KOMReviewMasterCreateButton);
				}, function (dialog) {
					dialog.response = 'alfa';

					return dialog;
				});
			});

			it('sends KOMReviewMasterDispatchCreate', function () {
				browser.assert.text('#TestKOMReviewMasterDispatchCreate', '1');
				browser.assert.text('#TestKOMReviewMasterDispatchCreateData', 'alfa');
			});
		
		});
	
	});

	describe('KOMReviewMasterListItem', function test_KOMReviewMasterListItem() {

		const uFlatten = function (inputData) {
			return [].concat.apply([], inputData);
		};

		const item = {
			KOMDeckID: 'alfa',
			KOMDeckName: 'bravo',
			$KOMDeckSpacings: uFlatten(Array.from(new Array(3)).map(function (e, i) {
				return [true, false].map(function (forward) {
					return {
						KOMSpacingID: (i + 1).toString() + '-' + (forward ? 'forward' : 'backward'),
						KOMSpacingChronicles: [],
						KOMSpacingDueDate: !i ? new Date() : (i >= 2 ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) : undefined),
						$KOMSpacingCard: {
							KOMCardID: (i + 1).toString(),
							KOMCardDeckID: 'alfa',
							KOMCardFront: (i + 1).toString(),
							KOMCardRear: 'charlie',
							KOMCardNotes: 'delta',
							KOMCardCreationDate: new Date('2019-02-23T13:56:36Z'),
							KOMCardModificationDate: new Date('2019-02-23T13:56:36Z'),
						},
					};
				});
			})),
		};
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KOMReviewMasterItems: JSON.stringify([item]),
			});
		});
		
		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKOMReviewMasterDispatchSelect', '0');
				browser.assert.text('#TestKOMReviewMasterDispatchSelectData', 'undefined');
			});
			
			before(function () {
				return browser.click('.KOMReviewMasterListItem');
			});

			it('sends KOMReviewMasterDispatchSelect', function () {
				browser.assert.text('#TestKOMReviewMasterDispatchSelect', '1');
				browser.assert.text('#TestKOMReviewMasterDispatchSelectData', JSON.stringify(item));
			});
		
		});

		context('Enter', function () {
			
			before(function () {
				return browser.query('.KOMReviewMasterListItem').focus();
			});

			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
			});

			it.skip('sends KOMReviewMasterDispatchSelect', function () {
				browser.assert.text('#TestKOMReviewMasterDispatchSelect', '2');
			});
		
		});

		context('Space', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'Space');
			});

			it.skip('sends KOMReviewMasterDispatchSelect', function () {
				browser.assert.text('#TestKOMReviewMasterDispatchSelect', '3');
			});
		
		});
		
	});

});
