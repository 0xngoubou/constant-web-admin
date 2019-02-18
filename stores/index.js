import { types, applySnapshot } from "mobx-state-tree";
import { AuthStore, initAuthStore, defaultAuthStore } from "./auth";
import { UIStore, initUIStore, defaultUIStore } from "./ui";
import { ACTStore, initACTStore, defaultACTStore } from "./act";
import {
  ProfilesStore,
  initProfilesStore,
  defaultProfilesStore
} from "./profiles";
import {
  ContactsStore,
  initContactsStore,
  defaultContactsStore
} from "./contacts";
import {
  ContributionsStore,
  initContributionsStore,
  defaultContributionsStore
} from "./contributions";
import {
  DisbursementsStore,
  initDisbursementsStore,
  defaultDisbursementsStore
} from "./disbursements";
import {
  FundsTransfersStore,
  initFundsTransfersStore,
  defaultFundsTransfersStore
} from "./funds-transfers";

export const Store = types.model("Store", {
  name: "Primetrust",
  auth: types.optional(AuthStore, defaultAuthStore),
  ui: types.optional(UIStore, defaultUIStore),
  profiles: types.optional(ProfilesStore, defaultProfilesStore),
  act: types.optional(ACTStore, defaultACTStore),
  contacts: types.optional(ContactsStore, defaultContactsStore),
  contributions: types.optional(ContributionsStore, defaultContributionsStore),
  disbursements: types.optional(DisbursementsStore, defaultDisbursementsStore),
  fundsTransfers: types.optional(
    FundsTransfersStore,
    defaultFundsTransfersStore
  )
});

export default function initStore(req, snapshot = null) {
  let store = null;
  if (!!req) {
    store = Store.create({
      auth: initAuthStore(req),
      ui: initUIStore(),
      profiles: initProfilesStore(),
      act: initACTStore(),
      contacts: initContactsStore(),
      contributions: initContributionsStore(),
      disbursements: initDisbursementsStore(),
      fundsTransfers: initFundsTransfersStore()
    });
    return store;
  }
  if (store === null) {
    store = Store.create({
      auth: initAuthStore(),
      ui: initUIStore(),
      act: initACTStore(),
      profiles: initProfilesStore(),
      contacts: initContactsStore(),
      contributions: initContributionsStore(),
      disbursements: initDisbursementsStore(),
      fundsTransfers: initFundsTransfersStore()
    });
  }
  if (snapshot) {
    applySnapshot(store, snapshot);
  }
  return store;
}
