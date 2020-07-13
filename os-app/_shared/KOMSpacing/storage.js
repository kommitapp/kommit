import KOMCardStorage from '../KOMCard/storage.js';
import KOMSpacingModel from './model.js';
import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;
import KOMDeckStorage from '../KOMDeck/storage.js';
import KOMDeckModel from '../KOMDeck/model.js';

const mod = {

	KOMSpacingStorageCollectionName () {
		return 'kom_spacings';
	},

	KOMSpacingStorageCollectionType () {
		return 'kom_spacing';
	},

	KOMSpacingStoragePathForward (param1, param2) {
		if (KOMDeckModel.KOMDeckModelErrorsFor(param2)) {
			throw new Error('KOMErrorInputNotValid');
		};

		return KOMCardStorage.KOMCardStorageObjectPath(param1, param2).replace('main', 'spacing-forward');
	},

	KOMSpacingStoragePathBackward (param1, param2) {
		if (KOMDeckModel.KOMDeckModelErrorsFor(param2)) {
			throw new Error('KOMErrorInputNotValid');
		};

		return KOMCardStorage.KOMCardStorageObjectPath(param1, param2).replace('main', 'spacing-backward');
	},

	KOMSpacingStorageMatch (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KOMErrorInputNotValid');
		}

		if (KOMDeckStorage.KOMDeckStorageMatch(inputData)) {
			return false;
		}

		if (KOMCardStorage.KOMCardStorageMatch(inputData)) {
			return false;
		}

		return [
			mod.KOMSpacingStoragePathForward(KOMCardStorage.uFakeCard(inputData), KOMCardStorage.uFakeDeck(inputData)),
			mod.KOMSpacingStoragePathBackward(KOMCardStorage.uFakeCard(inputData), KOMCardStorage.uFakeDeck(inputData)),
		].includes(inputData);
	},

	KOMSpacingStorageBuild (privateClient, publicClient, changeDelegate) {
		privateClient.on('change', function (event) {
			if (!changeDelegate) {
				return;
			}

			if (!mod.KOMSpacingStorageMatch(event.relativePath)) {
				return;
			}

			const delegateMethod = OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateProperty(event);

			if (!delegateMethod) {
				return;
			}

			if (typeof changeDelegate[delegateMethod] !== 'function') {
				return console.warn(`${ delegateMethod } not function`);
			}

			changeDelegate[delegateMethod](OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(event[OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateInput(delegateMethod)]));
		});

		const OLSKRemoteStorageCollectionExports = {

			async _KOMSpacingStorageWrite (param1, param2, param3) {
				if (typeof param1 !== 'object' || param1 === null) {
					return Promise.reject(new Error('KOMErrorInputNotValid'));
				}

				let errors = KOMSpacingModel.KOMSpacingModelErrorsFor(param1);
				if (errors) {
					return Promise.resolve({
						KOMErrors: errors,
					});
				}

				const param1Copy = OLSKRemoteStorage.OLSKRemoteStorageSafeCopy(param1);

				await privateClient.storeObject(mod.KOMSpacingStorageCollectionType(), (KOMSpacingModel.KOMSpacingModelIsBackward(param1Copy) ? mod.KOMSpacingStoragePathBackward : mod.KOMSpacingStoragePathForward)(param2, param3), OLSKRemoteStorage.OLSKRemoteStoragePreJSONSchemaValidate(param1Copy));

				return Object.assign(param1, OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(param1Copy));
			},

			async _KOMSpacingStorageList (param1, param2) {
				if (KOMDeckModel.KOMDeckModelErrorsFor(param2)) {
					throw new Error('KOMErrorInputNotValid');
				};

				const result = await privateClient.getAll(KOMCardStorage.KOMCardStorageFolderPath(param1, param2), false);

				for (let key in result) {
					if (result[key] === true) { // #remotestorage-cache-true
						delete result[key];
					}
				}

				return {
					KOMCardSpacingForward: OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(result['spacing-forward'] || {
						KOMSpacingID: `${ param1.KOMCardID }-forward`,
						KOMSpacingChronicles: [],
					}),
					KOMCardSpacingBackward: OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(result['spacing-backward'] || {
						KOMSpacingID: `${ param1.KOMCardID }-backward`,
						KOMSpacingChronicles: [],
					}),
				};
			},

			_KOMSpacingStorageDelete (param1, param2, param3) {
				if (KOMSpacingModel.KOMSpacingModelErrorsFor(param1)) {
					throw new Error('KOMErrorInputNotValid');
				}

				return privateClient.remove((KOMSpacingModel.KOMSpacingModelIsBackward(param1) ? mod.KOMSpacingStoragePathBackward : mod.KOMSpacingStoragePathForward)(param2, param3));
			},
			
		};

		return {
			OLSKRemoteStorageCollectionName: mod.KOMSpacingStorageCollectionName(),
			OLSKRemoteStorageCollectionType: mod.KOMSpacingStorageCollectionType(),
			OLSKRemoteStorageCollectionModelErrors: Object.entries(KOMSpacingModel.KOMSpacingModelErrorsFor({}, {
				KOMOptionValidateIfNotPresent: true,
			})).map(function (e) {
				if (Object.keys(KOMSpacingModel.KOMSpacingModelErrorsFor({})).indexOf(e[0]) === -1) {
					e[1].push('__RSOptional');
				}

				return e;
			}).reduce(function (coll, item) {
				coll[item[0]] = item[1];

				return coll;
			}, {}),
			OLSKRemoteStorageCollectionExports,
		};
	},

	KOMSpacingStorageWrite (storageClient, param1, param2, param3) {
		return storageClient.kommit[mod.KOMSpacingStorageCollectionName()]._KOMSpacingStorageWrite(param1, param2, param3);
	},

	KOMSpacingStorageList (storageClient, param1, param2) {
		return storageClient.kommit[mod.KOMSpacingStorageCollectionName()]._KOMSpacingStorageList(param1, param2);
	},

	KOMSpacingStorageDelete (storageClient, param1, param2, param3) {
		return storageClient.kommit[mod.KOMSpacingStorageCollectionName()]._KOMSpacingStorageDelete(param1, param2, param3);
	},

};

export default mod;
