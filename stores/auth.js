import { types, flow, getParent } from "mobx-state-tree"
import { AuthService } from "../services"

export const AuthStore = types
  .model(`AuthStore`, {
    isAuthenticated: false,
    token: types.optional(types.string, ''),
  })
  .views(self => ({
    get parent() {
      return getParent(self)
    },
  }))
  .actions(self => {
    const logIn = flow(function *(email, password) {
      self.parent.ui.showLoading()
      const response = yield new AuthService().logIn(email, password)
      self.parent.ui.hideLoading()
      console.log(response)
      if (response.status) {
        self.authenticate({ token: response.data })
        return null
      }
      return response.error
    })

    const authenticate = (data) => {
      self.isAuthenticated = true;
      self.token = data.token;
    }

    const logOut = flow(function *() {
      self.parent.ui.showLoading()
      const response = yield new AuthService().logOut()
      self.parent.ui.hideLoading()
      console.log(response)
      if (response.status) {
        self.isAuthenticated = false;
        self.token = '';
        return true
      }
      return false
    })

    return { logIn, authenticate, logOut }
  });

export const initAuthStore = req => {
  if (req && req.session && req.session.token) {
    return {
      isAuthenticated: true,
      token: req.session.token
    }
  }
  return {
    isAuthenticated: false,
    token: '',
  }
}

export const defaultAuthStore = {
  user: null
}
