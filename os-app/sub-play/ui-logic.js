import KOMCardModel from '../_shared/KOMCard/model.js';

const kStepToLearnSeconds = 60;

const mod = {

	KOMPlaySort (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('KOMErrorInputNotValid');
		}

		const cardsReview = mod._KOMPlaySortShuffle(inputData.filter(function (e) {
			return e.KOMCardReviewDueDate;
		}));

		const cardsNew = inputData.filter(function (e) {
			return !e.KOMCardReviewDueDate;
		});
		const spacing = Math.floor(cardsReview.length / (cardsNew.length + 1));
		const cardsReviewLastIndex = cardsReview.length - 1;
		
		mod._KOMPlaySortShuffle(cardsNew).map(function (e, i) {
			return cardsReview.splice(cardsReviewLastIndex - spacing * (i + 1), 0, e);
		});

		return cardsReview;
	},

	//How to randomize (shuffle) a JavaScript array? - Stack Overflow https://stackoverflow.com/a/12646864
	_KOMPlaySortShuffle(inputData) {
		for (let i = inputData.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[inputData[i], inputData[j]] = [inputData[j], inputData[i]];
		}

		return inputData;
	},

	KOMPlayStateIsValid (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('KOMErrorInputNotValid');
		}

		if (KOMCardModel.KOMCardModelErrorsFor(inputData.KOMPlayStateCardCurrent)) {
			return false;
		}

		if (!Array.isArray(inputData.KOMPlayStateCardsQueue)) {
			return false;
		}

		if (!Array.isArray(inputData.KOMPlayStateCardsWait)) {
			return false;
		}

		return true;
	},

	KOMPlayResponseTypeAgain () {
		return 'kKOMPlayResponseTypeAgain';
	},

	KOMPlayResponseTypeHard () {
		return 'kKOMPlayResponseTypeHard';
	},

	KOMPlayResponseTypeGood () {
		return 'kKOMPlayResponseTypeGood';
	},

	KOMPlayResponseTypeEasy () {
		return 'kKOMPlayResponseTypeEasy';
	},

	KOMPlayResponseTypes () {
		return [
			mod.KOMPlayResponseTypeAgain(),
			mod.KOMPlayResponseTypeHard(),
			mod.KOMPlayResponseTypeGood(),
			mod.KOMPlayResponseTypeEasy(),
		];
	},

	KOMPlayResponseIsValid (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('KOMErrorInputNotValid');
		}

		if (mod.KOMPlayResponseTypes().indexOf(inputData.KOMPlayResponseType) === -1) {
			return false;
		}

		if (!(inputData.KOMPlayResponseDate instanceof Date) || Number.isNaN(inputData.KOMPlayResponseDate.getTime())) {
			return false
		}

		return true;
	},

	KOMPlayResponseStepToLearn () {
		return 1000 * kStepToLearnSeconds;
	},

	KOMPlayRespond (state, response) {
		if (!mod.KOMPlayStateIsValid(state)) {
			throw new Error('KOMErrorInputNotValid');
		}

		if (!mod.KOMPlayResponseIsValid(response)) {
			throw new Error('KOMErrorInputNotValid');
		}

		const card = state.KOMPlayStateCardCurrent;

		if (!card.KOMCardReviewInterval && response.KOMPlayResponseType !== mod.KOMPlayResponseTypeEasy()) {
			state.KOMPlayStateCardsWait.push(Object.assign(state.KOMPlayStateCardsQueue.splice(state.KOMPlayStateCardsQueue.indexOf(card), 1).pop(), {
				KOMCardReviewDueDate: new Date(response.KOMPlayResponseDate + mod.KOMPlayResponseStepToLearn()),
			}, response.KOMPlayResponseType === mod.KOMPlayResponseTypeAgain() ? {} : {
				KOMCardReviewIsLearning: true,
			}))
		}

		return state;
	},

};

Object.assign(exports, mod);