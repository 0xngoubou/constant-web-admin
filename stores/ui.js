import { types, getParent } from "mobx-state-tree";

export const UIStore = types
  .model(`UIStore`, {
    loading: types.optional(types.boolean, false),
    primetrustDialog: types.optional(types.boolean, false),
    primetrustDialogData: types.optional(types.string, "")
  })
  .views(self => ({
    get parent() {
      return getParent(self);
    }
  }))
  .actions(self => {
    const showLoading = () => {
      self.loading = true;
    };
    const hideLoading = () => {
      self.loading = false;
    };
    const showPrimetrustDialog = data => {
      self.primetrustDialog = true;
      self.primetrustDialogData = JSON.stringify(data);
    };
    const hidePrimetrustDialog = () => {
      self.primetrustDialog = false;
      self.primetrustDialogData = "";
    };
    return {
      showLoading,
      hideLoading,
      showPrimetrustDialog,
      hidePrimetrustDialog
    };
  });

export const initUIStore = req => {
  return {
    loading: false
  };
};

export const defaultUIStore = {
  loading: false
};
