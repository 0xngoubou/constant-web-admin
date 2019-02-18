import withStore from "./withStore"
import withLayout from "./withLayout"

const pageWithoutLayout = Page => {
  let ComposedPage = withStore(Page)
  return ComposedPage
}

const page = Page => {
  let ComposedPage = withLayout(Page)
  ComposedPage = pageWithoutLayout(ComposedPage)
  return ComposedPage
}

export default page
export { pageWithoutLayout }
