import { Component } from "react"
import Layout from "../components/layout"

export default Page =>
  class extends Component {
    static async getInitialProps(context) {
      let props
      if (Page && typeof Page.getInitialProps === "function") {
        props = await Page.getInitialProps(context)
      }

      return {
        ...props
      }
    }

    render() {
      return (
        <Layout>
          <Page {...this.props} />
        </Layout>
      )
    }
  }
