import { types, flow, getParent } from "mobx-state-tree";
import {
  VERIFIED_LEVEL_SUBMITTED,
  VERIFIED_LEVEL_PENDING,
  VERIFIED_LEVEL_VERIFYING,
  VERIFIED_LEVEL_REJECTED,
  VERIFIED_LEVEL_PRIMETRUST
} from "../constants";

export const ProfilesStore = types
  .model(`ProfilesStore`, {
    page: types.number,
    size: types.number,
    total: types.number,
    verifiedLevels: types.array(types.string),
    keywords: types.string
  })
  .views(self => ({
    get parent() {
      return getParent(self);
    }
  }))
  .actions(self => {
    const setPage = page => {
      self.page = page;
    };

    const setSize = size => {
      self.page = 1;
      self.size = size;
    };

    const setTotal = total => {
      self.total = total;
    };

    const setVerifiedLevels = verifiedLevels => {
      self.verifiedLevels = verifiedLevels;
    };

    const setKeywords = keywords => {
      self.keywords = keywords;
    };

    return { setPage, setSize, setTotal, setVerifiedLevels, setKeywords };
  });

export const initProfilesStore = req => {
  return {
    page: 1,
    size: 10,
    total: 0,
    verifiedLevels: [
      VERIFIED_LEVEL_SUBMITTED.toString(),
      VERIFIED_LEVEL_PENDING.toString(),
      VERIFIED_LEVEL_VERIFYING.toString(),
      VERIFIED_LEVEL_REJECTED.toString(),
      VERIFIED_LEVEL_PRIMETRUST.toString()
    ],
    keywords: ""
  };
};

export const defaultProfilesStore = {
  page: 1,
  size: 10,
  total: 0,
  verifiedLevels: [
    VERIFIED_LEVEL_SUBMITTED.toString(),
    VERIFIED_LEVEL_PENDING.toString(),
    VERIFIED_LEVEL_VERIFYING.toString(),
    VERIFIED_LEVEL_REJECTED.toString(),
    VERIFIED_LEVEL_PRIMETRUST.toString()
  ],
  keywords: ""
};
