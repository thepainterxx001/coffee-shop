import ThemeProvider from "../context/theme/ThemeProvider"
import AuthProvider from "../context/auth/AuthProvider"
import ProductProvider from "../context/products/ProductProvider"
import OrderProvider from "../context/orders/OrderProvider"

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            { children }
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default Providers