import { types, flow, getParent } from "mobx-state-tree";

export const ContactsStore = types
  .model(`ContactsStore`, {
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
      console.log("call store set page", page);
      self.page = page;
      console.log(self.page, self.size, self.total);
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

export const initContactsStore = req => {
  return {
    page: 1,
    size: 10,
    total: 0
  };
};

export const defaultContactsStore = {
  page: 1,
  size: 10,
  total: 0
};
