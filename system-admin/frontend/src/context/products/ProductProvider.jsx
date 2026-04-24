import { useState } from "react";
import productContext from "./productContext"
import toast from "react-hot-toast";
import { axiosProduct } from "../../lib/axios";
import { useEffect } from "react";
import { useContext } from "react";
import authContext from "../auth/authContext";

const ProductProvider = ({children }) => {
  const { authenticated } = useContext(authContext);
  const [ loading, setLoading ] = useState(true); 
  const [ allProducts, setAllProducts ] = useState(null);
  
  const getAllProducts = async () => {
    setLoading(false);

    try {
      const res = await axiosProduct.get("/all-products");
      console.log(res.data.products);
      setAllProducts(res.data.products);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const updateProduct = async (file, form) => {

    try {
      const formData = new FormData();
      formData.append("product", file);
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);

      await axiosProduct.put(`/edit-product/${form.id}`, formData);
      await getAllProducts();
    } catch (err) {
      console.error(err.response?.data?.message);
    } 
  }

  useEffect(() => {
    if(authenticated)
      getAllProducts();
  }, [authenticated])

  return (
    <productContext.Provider value={{ allProducts, updateProduct }}>
      {children}
    </productContext.Provider>
  )
}

export default ProductProvider