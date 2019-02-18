import { types, flow, getParent } from "mobx-state-tree";
import { AccountInternalTransfersService } from "../services";

export const DisbursementsStore = types
  .model(`DisbursementsStore`, {
    page: types.number,
    size: types.number,
    total: types.number
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

    return { setPage, setSize, setTotal };
  });

export const initDisbursementsStore = req => {
  return {
    page: 1,
    size: 10,
    total: 0
  };
};

export const defaultDisbursementsStore = {
  page: 1,
  size: 10,
  total: 0
};
