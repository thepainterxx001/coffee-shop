import AuthProvider from "../context/auth/AuthProvider"
import ProductProvider from "../context/products/ProductProvider"
import OrderProvider from "../context/orders/OrderProvider"

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          { children }
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  )
}

export default Providers