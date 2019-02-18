import { types, flow, getParent } from "mobx-state-tree";

export const FundsTransfersStore = types
  .model(`FundsTransfersStore`, {
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

export const initFundsTransfersStore = req => {
  return {
    page: 1,
    size: 10,
    total: 0
  };
};

export const defaultFundsTransfersStore = {
  page: 1,
  size: 10,
  total: 0
};
