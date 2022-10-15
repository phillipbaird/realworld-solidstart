import Footer from "./Footer"
import Header from "./Header"

export default function Page(props) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  )
}