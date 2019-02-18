import { Component } from "react"
import { getSnapshot, applySnapshot } from "mobx-state-tree"
import { Provider } from "mobx-react"
import initStore from "../stores"

const __NEXT_MOBX_STORE__ = new Date().toUTCString()

function getOrCreateStore(req, initialState) {
  const isServer = typeof window === "undefined"
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initStore(req, initialState)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_MOBX_STORE__]) {
    window[__NEXT_MOBX_STORE__] = initStore(null, initialState)
  }
  return window[__NEXT_MOBX_STORE__]
}

export default Page =>
  class extends Component {
    static async getInitialProps(context) {
      let props
      if (Page && typeof Page.getInitialProps === "function") {
        props = await Page.getInitialProps(context)
      }

      const { req } = context
      const store = getOrCreateStore(req)

      return {
        ...props,
        initialState: getSnapshot(store)
      }
    }

    constructor(props) {
      super(props)
      this.store = getOrCreateStore(null, props.initialState)
    }

    render() {
      return (
        <Provider store={this.store}>
          <Page {...this.props} />
        </Provider>
      )
    }
  }
