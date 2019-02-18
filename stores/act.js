import { types, flow, getParent } from "mobx-state-tree";

export const ACTStore = types
  .model(`ACTStore`, {
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
      self.size = size;
    };

    const setTotal = total => {
      self.total = total;
    };

    return { setPage, setSize, setTotal };
  });

export const initACTStore = req => {
  return {
    page: 1,
    size: 10,
    total: 0
  };
};

export const defaultACTStore = {
  page: 1,
  size: 10,
  total: 0
};
