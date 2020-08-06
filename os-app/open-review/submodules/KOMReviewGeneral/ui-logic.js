import KOMReviewLogic from '../../ui-logic.js';

const mod = {

	KOMReviewGeneralTableDays() {
		return 7;
	},

	KOMReviewGeneralUpcomingDates() {
		return Array.from(Array(mod.KOMReviewGeneralTableDays())).map(function (e, i) {
			return KOMReviewLogic.KOMReviewLogicDayGrouping(new Date(Date.now() + 1000 * 60 * 60 * 24 * i));
		});
	},

	KOMReviewGeneralUpcomingFilter(inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('KOMErrorInputNotValid');
		}

		return inputData.filter(function (e) {
			if (!e.KOMSpacingDueDate) {
				return false;
			}
			
			if (KOMReviewLogic.KOMReviewLogicDayGrouping(e.KOMSpacingDueDate) < KOMReviewLogic.KOMReviewLogicDayGrouping(new Date())) {
				return false;
			}

			if (KOMReviewLogic.KOMReviewLogicDayGrouping(e.KOMSpacingDueDate) >= KOMReviewLogic.KOMReviewLogicDayGrouping(new Date(Date.now() + 1000 * 60 * 60 * 24 * mod.KOMReviewGeneralTableDays()))) {
				return false;
			}

			return true;
		});
	},

	KOMReviewGeneralUpcomingGroupByDate(inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('KOMErrorInputNotValid');
		}

		return inputData.reduce(function (coll, item) {
			coll[KOMReviewLogic.KOMReviewLogicDayGrouping(item.KOMSpacingDueDate)] = (coll[KOMReviewLogic.KOMReviewLogicDayGrouping(item.KOMSpacingDueDate)] || []).concat(item);

			return coll;
		}, {});
	},

};

export default mod;
