import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const kTesting = {
	uSpacings () {
		return Array.from(new Array(2)).map(function (e, i) {
			return {
				KOMSpacingID: (i + 1).toString() + '-forward',
				$KOMSpacingCard: {
					KOMCardID: (i + 1).toString(),
					KOMCardQuestion: (i + 1).toString(),
					KOMCardAnswer: 'charlie',
					KOMCardHint: 'delta',
					KOMCardCreationDate: new Date('2019-02-23T13:56:36Z'),
					KOMCardModificationDate: new Date('2019-02-23T13:56:36Z'),
				},
			};
		});
	},
};

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`KOMReviewDetail_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
				KOMReviewDetailDeck: JSON.stringify({
					KOMDeckName: 'alfa',
					$KOMDeckSpacings: [],
				}),
			});
		});

		it('localizes KOMReviewDetailToolbarBackButton', function () {
			browser.assert.text(KOMReviewDetailToolbarBackButton, uLocalized('KOMReviewDetailToolbarBackButtonText'));
		});

		it('localizes KOMReviewDetailToolbarDiscardButton', function () {
			browser.assert.text(KOMReviewDetailToolbarDiscardButton, uLocalized('KOMReviewDetailToolbarDiscardButtonText'));
		});

		it('localizes KOMReviewDetailToolbarRenameButton', function () {
			browser.assert.text(KOMReviewDetailToolbarRenameButton, uLocalized('KOMReviewDetailToolbarRenameButtonText'));
		});

		it('localizes KOMReviewDetailToolbarCardsButton', function () {
			browser.assert.text(KOMReviewDetailToolbarCardsButton, uLocalized('KOMReviewDetailToolbarCardsButtonText'));
		});

		it('localizes KOMReviewDetailStudyHeading', function () {
			browser.assert.text(KOMReviewDetailStudyHeading, uLocalized('KOMReviewDetailStudyHeadingText'));
		});

		it('localizes KOMReviewDetailNoCards', function () {
			browser.assert.text(KOMReviewDetailNoCards, uLocalized('KOMReviewDetailNoCardsText'));
		});

		context('on discard', function () {
		
			it('localizes KOMReviewDetailDiscardPrompt', async function() {
				deepEqual((await browser.OLSKConfirm(async function () {
					browser.pressButton(KOMReviewDetailToolbarDiscardButton);
				})).question, uLocalized('KOMReviewDetailToolbarDiscardPromptText'));
			});
		
		});

		context('on rename', function () {
		
			it('localizes KOMReviewDetailToolbarRenameButtonPrompt', function() {
				deepEqual(browser.OLSKPromptSync(function () {
					return browser.pressButton(KOMReviewDetailToolbarRenameButton);
				}).question, uLocalized('KOMReviewDetailToolbarRenameButtonPromptText'));
			});
		
		});

		context('$KOMDeckSpacings', function test_$KOMDeckSpacings () {

			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					KOMReviewDetailDeck: JSON.stringify({
						KOMDeckName: 'alfa',
						$KOMDeckSpacings: kTesting.uSpacings().map(function (e, i) {
							if (i) {
								return e;
							}

							return Object.assign(e, {
								KOMSpacingDueDate: new Date(),
							});
						}),
					}),
				});
			});

			it('localizes KOMReviewDetailIsForwardOnlyFieldLabel', function () {
				browser.assert.text(KOMReviewDetailIsForwardOnlyFieldLabel, uLocalized('KOMReviewDetailIsForwardOnlyFieldLabelText'));
			});

			it('localizes KOMReviewDetailPlayButtonReviewing', function () {
				browser.assert.text(KOMReviewDetailPlayButtonReviewing, uLocalized('KOMReviewDetailPlayButtonReviewingText'));
			});

			it('localizes KOMReviewDetailPlayButtonUnseen', function () {
				browser.assert.text(KOMReviewDetailPlayButtonUnseen, uLocalized('KOMReviewDetailPlayButtonUnseenText'));
			});

			it('localizes KOMReviewDetailPlayButtonMixed', function () {
				browser.assert.text(KOMReviewDetailPlayButtonMixed, uLocalized('KOMReviewDetailPlayButtonMixedText'));
			});

		});

		context('finished', function test_finished () {

			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					KOMReviewDetailDeck: JSON.stringify({
						KOMDeckName: 'alfa',
						$KOMDeckSpacings: kTesting.uSpacings().map(function (e) {
							return Object.assign(e, {
								KOMSpacingDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
							});
						}),
					}),
				});
			});

			it('localizes KOMReviewDetailNoSpacings', function () {
				browser.assert.text(KOMReviewDetailNoSpacings, uLocalized('KOMReviewDetailNoSpacingsText'));
			});

		});

	});

});
