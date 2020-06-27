const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const kTesting = {
	StubDeckObjectValid() {
		return {
			KOMDeckID: 'alfa',
			KOMDeckName: '',
			KOMDeckCreationDate: new Date('2019-02-23T13:56:36Z'),
			KOMDeckModificationDate: new Date('2019-02-23T13:56:36Z'),
			$KOMDeckCards: [],
		};
	},
	uSerial (inputData) {
		return inputData.reduce(function (coll, e) {
			return coll.then(e);
		}, Promise.resolve());
	},
	uLaunch (inputData) {
		return kTesting.uSerial([
			function () {
				return browser.pressButton('.OLSKAppToolbarLauncherButton');
			},
			function () {
				return browser.fill('.LCHLauncherFilterInput', inputData);
			},
			function () {
				return browser.click('.LCHLauncherResultListItem');
			},
		]);
	},
};

describe('KOMBrowse_Sync', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KOMBrowseDeckSelected: JSON.stringify(kTesting.StubDeckObjectValid()),
		});
	});

	before(function () {
		return browser.pressButton('.KOMBrowseListToolbarCreateButton');
	});

	before(function () {
		return browser.fill('.KOMBrowseInfoFormFrontTextField', 'alfa');
	});

	before(function () {
		return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
	});

	describe('ChangeDelegateCreateCard', function test_ChangeDelegateCreateCard () {

		before(function () {
			browser.assert.elements('.KOMBrowseListItem', 1);
		});

		before(function () {
			return kTesting.uLaunch('FakeChangeDelegateCreateCard');
		});

		it('adds item', function () {
			browser.assert.elements('.KOMBrowseListItem', 2);
		});

		it('sorts list', function () {
			browser.assert.text('.KOMBrowseListItem', 'FakeChangeDelegateCreateCard alfa');
		});

		context('selected', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2) .KOMBrowseListItem');
			});

			before(function () {
				return browser.fill('.KOMBrowseInfoFormFrontTextField', 'alfa2');
			});

			before(function () {
				return kTesting.uLaunch('FakeChangeDelegateCreateCard');
			});

			it('adds item', function () {
				browser.assert.elements('.KOMBrowseListItem', 3);
			});

			it('skips sort', function () {
				browser.assert.text('.KOMBrowseListItem', 'FakeChangeDelegateCreateCard FakeChangeDelegateCreateCard alfa2');
			});
		
		});

	});

	describe('ChangeDelegateUpdateCard', function test_ChangeDelegateUpdateCard () {

		before(function () {
			return browser.OLSKFireKeyboardEvent(browser.window, 'Escape');
		});

		before(function () {
			browser.assert.text('.KOMBrowseListItem', 'FakeChangeDelegateCreateCard alfa2 FakeChangeDelegateCreateCard');
		});

		before(function () {
			return kTesting.uLaunch('FakeChangeDelegateUpdateCard');
		});

		it('updates item', function () {
			browser.assert.text('.OLSKResultsListItem:nth-child(1) .KOMBrowseListItem', 'FakeChangeDelegateUpdateCard');
		});

		it('sorts list', function () {
			browser.assert.text('.KOMBrowseListItem', 'FakeChangeDelegateUpdateCard FakeChangeDelegateCreateCard alfa2');
		});

		context('selected different', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(1) .KOMBrowseListItem');
			});

			before(function () {
				return browser.fill('.KOMBrowseInfoFormFrontTextField', 'bravo');
			});

			before(function () {
				browser.assert.text('.KOMBrowseListItem', 'bravo FakeChangeDelegateCreateCard alfa2');
			});

			before(function () {
				return kTesting.uLaunch('FakeChangeDelegateUpdateCard');
			});

			it('updates item', function () {
				browser.assert.elements('.OLSKResultsListItem:nth-child(3) .KOMBrowseListItem', 'FakeChangeDelegateUpdateCard');
			});

			it('skips sort', function () {
				browser.assert.text('.KOMBrowseListItem', 'bravo FakeChangeDelegateUpdateCard alfa2');
			});
		
		});

		context('selected same', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2) .KOMBrowseListItem');
			});

			before(function () {
				return browser.fill('.KOMBrowseInfoFormFrontTextField', 'FakeChangeDelegateCreateCard');
			});

			before(function () {
				return kTesting.uLaunch('FakeChangeDelegateUpdateCard');
			});

			it('updates detail', function () {
				browser.assert.input('.KOMBrowseInfoFormFrontTextField', 'FakeChangeDelegateUpdateCard');
			});

		});

	});

	describe('ChangeDelegateDeleteCard', function test_ChangeDelegateDeleteCard () {

		before(function () {
			return browser.click('.OLSKResultsListItem:nth-child(3) .KOMBrowseListItem');
		});

		before(function () {
			return browser.fill('.KOMBrowseInfoFormFrontTextField', 'alfa3');
		});

		before(function () {
			return kTesting.uLaunch('FakeEscapeWithoutSort');
		});

		before(function () {
			browser.assert.text('.KOMBrowseListItem', 'bravo FakeChangeDelegateUpdateCard alfa3');
		});

		before(function () {
			browser.assert.elements('.KOMBrowseListItem', 3);
		});

		before(function () {
			return kTesting.uLaunch('FakeChangeDelegateDeleteCard');
		});

		it('removes item', function () {
			browser.assert.elements('.KOMBrowseListItem', 2);
		});

		it('skips sort', function () {
			browser.assert.text('.KOMBrowseListItem', 'bravo alfa3');
		});

		context('selected different', function () {
			
			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(2) .KOMBrowseListItem');
			});

			before(function () {
				return browser.fill('.KOMBrowseInfoFormFrontTextField', 'alfa4');
			});

			before(function () {
				return kTesting.uLaunch('FakeChangeDelegateCreateCard');
			});

			before(function () {
				browser.assert.elements('.KOMBrowseListItem', 3);
			});

			before(function () {
				return kTesting.uLaunch('FakeChangeDelegateDeleteCard');
			});

			it('removes item', function () {
				browser.assert.elements('.KOMBrowseListItem', 2);
			});

			it('skips sort', function () {
				browser.assert.text('.KOMBrowseListItem', 'bravo alfa4');
			});
		
		});

		context('selected same', function () {
			
			before(function () {
				return kTesting.uLaunch('FakeChangeDelegateCreateCard');
			});

			before(function () {
				return browser.click('.OLSKResultsListItem:nth-child(1) .KOMBrowseListItem');
			});

			before(function () {
				browser.assert.text('.KOMBrowseListItem', 'FakeChangeDelegateCreateCard bravo alfa4');
			});

			before(function () {
				browser.assert.elements('.KOMBrowseListItem', 3);
			});

			before(function () {
				return kTesting.uLaunch('FakeChangeDelegateDeleteCard');
			});

			it('removes item', function () {
				browser.assert.elements('.KOMBrowseListItem', 2);
			});

			it('clear detail', function () {
				browser.assert.elements('.OLSKDetailPlaceholder', 1);
			});

			it('skips sort', function () {
				browser.assert.text('.KOMBrowseListItem', 'bravo alfa4');
			});
		
		});

	});

});
