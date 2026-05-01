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
  const [ catProducts, setCatProducts ] = useState(null);
  
  const getAllProducts = async () => {
    setLoading(false);

    try {
      const res = await axiosProduct.get("/all-products");
      setAllProducts(res.data.allProducts);
      setCatProducts(res.data.byCategory);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const getCatProduct = async (category) => {
    setLoading(false);

    try {
      const res = await axiosProduct.get(`/all-products/${category}`);
      console.log(res.data.products);
      setCatProducts(prev => res.data.products);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const addProduct = async (file, form) => {
    try {
      const formData = new FormData();
      formData.append("product", file);
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);

      const res = await axiosProduct.post("/new-product", formData);
      await getAllProducts();
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
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

      const res = await axiosProduct.put(`/edit-product/${form.id}`, formData);
      await getAllProducts();
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } 
  }

  const deleteProduct = async (id) => {
    try {
      const res = await axiosProduct.delete(`/delete-product/${id}`);
      await getAllProducts();
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  }

  useEffect(() => {
    if(authenticated)
      getAllProducts();
  }, [authenticated])

  return (
    <productContext.Provider value={{ allProducts, catProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </productContext.Provider>
  )
}

export default ProductProvider