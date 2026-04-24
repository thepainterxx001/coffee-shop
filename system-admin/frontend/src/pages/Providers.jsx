import AuthProvider from "../context/auth/AuthProvider"
import ProductProvider from "../context/products/ProductProvider"

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        { children }
      </ProductProvider>
    </AuthProvider>
  )
}

export default Providers