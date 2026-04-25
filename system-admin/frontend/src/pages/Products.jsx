import { useContext, useRef, useState } from "react"
import { Pencil, Trash2, CirclePlus, AlertTriangle,
  X, Upload, PackagePlus, ChevronDown,
  Save, RefreshCcw, Image as ImageIcon
 } from 'lucide-react';
import Header from "../components/Header"
import productContext from "../context/products/productContext"
import toast from "react-hot-toast";
import { useEffect } from "react";

const Products = () => {
  const { deleteProduct } = useContext(productContext);
  const [ createProduct, setCreateProduct ] = useState(false); 
  const [ editProduct, setEditProduct ] = useState(null); 
  const [ delConfirm, setDelConfirm ] = useState(null);

  return (
    <div className="h-full w-full">
      <Header />
      <AllProducts setCreateProduct={setCreateProduct} setEditProduct={setEditProduct} setDelConfirm={setDelConfirm} />
      {delConfirm &&
        <DeleteProductModal productName={delConfirm.name} onDelete={ async () => {
          await deleteProduct(delConfirm.id);
          setDelConfirm(null);
        }} onCancel={() => setDelConfirm(null)} />}
      {editProduct && 
        <EditProduct editProduct={editProduct} onClose={() => setEditProduct(null)} />}
      {createProduct && 
        <CreateProduct createProduct={createProduct} onClose={() => setCreateProduct(false)} />
      }
    </div>
  )
}

const AllProducts = ({ setCreateProduct, setEditProduct, setDelConfirm }) => {
  const { allProducts } = useContext(productContext);

  return (
    <div className="flex flex-col justify-center p-2 rounded-lg gap-4 bg-g1">
      <h2 className="bg-wh1 w-max py-1 px-2 rounded-md">All Products</h2>
      <div className="flex gap-4 pb-4 overflow-y-auto overflow-x-auto flex-wrap lg:flex-nowrap lg:flex-row scrollbar-hide">
        <div className="relative min-w-55 h-50 rounded-2xl overflow-hidden group border-2 border-dashed border-gray-200 hover:border-b1 hover:bg-b2/25 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md">
          <button className="flex flex-col items-center justify-center h-full w-full cursor-pointer text-gray-400 group-hover:text-b1 transition-colors group"
          onClick={() => setCreateProduct(true)}>
            <CirclePlus size={48} className="transform group-hover:scale-110 transition-transform duration-200 group-active:scale-100" />
            <span className="mt-2 text-sm font-medium">Add New</span>
          </button>
        </div>
        {allProducts?.map((product) => (
          <div 
            key={product._id} 
            className="relative min-w-55 h-50 rounded-2xl overflow-hidden group shadow-lg"
          >
            {/* productg image */}
            <img 
              src={product.img} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

            {/* Top Action Icons */}
            <div className="absolute top-3 right-3 flex gap-2 text-white opacity-90">
              <button className="hover:text-amber-200 cursor-pointer"
              onClick={() => setEditProduct({
                id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                image: product.img
              })}>
                <Pencil className="w-5 h-5" />
              </button>
              <button className="hover:text-red-400 cursor-pointer"
              onClick={() => setDelConfirm({
                id: product._id,
                name: product.name
              })}>
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
              <p className="font-medium truncate pr-2 text-sm drop-shadow-md">
                {product.name}
              </p>
              <span className="font-semibold text-lg drop-shadow-md">
                ₱{product.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const DeleteProductModal = ({ productName, onDelete, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 bg-red-50 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full text-red-600">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-bold text-red-900">Confirm Deletion</h3>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-gray-900">"{productName}"</span>? 
            This action is permanent and will remove all associated data from the system.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-4 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all cursor-pointer"
          >
            No, Keep Product
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-all cursor-pointer"
          >
            <Trash2 size={16} />
            Yes, Delete Permanently
          </button>
        </div>

      </div>
    </div>
  );
};

const CreateProduct = ({ createProduct, onClose }) => {
  const { addProduct } = useContext(productContext);

  const imgRef = useRef(null);
  const [ prevImg, setPrevImg ] = useState(null);
  const [ name, setName ] = useState(null);
  const [ price, setPrice ] = useState(null);
  const [ category, setCategory ] = useState(null);
  const [ description, setDescription ] = useState(null);
  const [ loading, setLoading ] = useState(false);

  const previewImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPrevImg(URL.createObjectURL(file));
    console.log(e.target.files);
  }

  const uploadProductDetails = async () => {
    setLoading(true);
    const toastID = toast.loading("Adding product...");

    const form = {
      name, price, category, description
    };
    await addProduct(imgRef?.current?.files[0], form)
    onClose();
    toast.dismiss(toastID);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-b1/40 backdrop-blur-[2px] p-4">
      {/* Modal Container */}
      <div className="bg-wh1 w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden border border-g1 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-g1/30">
          <h2 className="text-2xl font-bold text-b1">Create Product</h2>
          <button 
            onClick={onClose} 
            className={`p-2 hover:bg-g1/20 rounded-full transition-colors text-b2 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form className="p-8 space-y-5">
          
          {/* Name and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Product Name</label>
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none transition-all text-b1 placeholder:text-g1"
               onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Price</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none transition-all text-b1 placeholder:text-g1"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Description</label>
            <textarea 
              rows="3"
              placeholder="Describe the product details..." 
              className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none transition-all text-b1 placeholder:text-g1 resize-none"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Category</label>
            <div className="relative">
              <select className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none appearance-none text-b1 cursor-pointer"
              onChange={(e) => setCategory(e.target.value)}>
                <option value="" className="text-g1">Select Category</option>
                <option value="Coffee">Coffee</option>
                <option value="Merch">Merch</option>
                <option value="Food">Food</option>
                <option value="Gifts">Gifts</option>
                <option value="Equipment">Equipment</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-g2 pointer-events-none" />
            </div>
          </div>

          {/* Upload Image Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Product Image</label>
            <div className="group relative border-2 border-dashed border-g1 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-b2 hover:bg-g1/10 transition-all cursor-pointer bg-white/50">
              {prevImg
                ? (
                  <div className="relative w-max h-max rounded-lg">
                    <div className="absolute top-0 left-0 flex flex-col items-center justify-center h-full w-full group-hover:bg-black/50 transition-colors rounded-lg">
                      <div className="p-3 bg-wh1 w-max rounded-full opacity-0 group-hover:opacity-100 shadow-sm mb-2 transition-all">
                        <Upload className="text-b2" size={24} />
                      </div>
                      <p className="text-sm opacity-0 group-hover:opacity-100 text-wh1 font-medium transition-all">Replace product photo</p>
                    </div>
                    <img src={prevImg}
                    className="w-75 h-55 rounded-lg object-cover object-center" />
                  </div>
                )
                : (
                  <>
                    <div className="p-3 bg-wh1 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="text-b2" size={24} />
                    </div>
                    <p className="text-sm text-g2 group-hover:text-b1 font-medium transition-colors">Click to upload photo</p>
                  </>
                )
              }
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-50"
              ref={imgRef} onChange={(e) => previewImage(e)} />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className={`w-full bg-b1 hover:bg-b2 text-wh1 font-bold py-4 rounded-xl shadow-lg shadow-b1/20 flex items-center justify-center gap-2 mt-4 transform active:scale-[0.98] transition-all ${loading ? "cursor-wait" : "cursor-pointer"}`}
            disabled={loading}
            onClick={() => uploadProductDetails()}
          >
            <PackagePlus size={20} />
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};


const EditProduct = ({ editProduct, onClose }) => {
  const { updateProduct } = useContext(productContext);
  const imgRef = useRef(null);
  const [ prevImg, setPrevImg ] = useState(null);
  const [ name, setName ] = useState(null);
  const [ price, setPrice ] = useState(null);
  const [ category, setCategory ] = useState(null);
  const [ description, setDescription ] = useState(null);
  const [ loading, setLoading ] = useState(false);

  const previewImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPrevImg(URL.createObjectURL(file));
  }

  const updateProductDetails = async () => {
    setLoading(true);
    const toastID = toast.loading("Updating product...");

    const form = {
      name, price, category, description, id: editProduct.id
    };
    await updateProduct(imgRef.current.files[0], form)
    onClose();
    toast.dismiss(toastID);
    setLoading(false);
  }

  useEffect(() => {
    setName(editProduct.name);
    setPrice(editProduct.price);
    setCategory(editProduct.category);
    setDescription(editProduct.description);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-b1/40 backdrop-blur-[2px] p-4">
      <div className="bg-wh1 w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden border border-g1 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-g1/30">
          <div>
            <h2 className="text-2xl font-bold text-b1">Edit Product</h2>
            <p className="text-xs text-g2 font-medium">Product ID: {editProduct?.id || '#0000'}</p>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 hover:bg-g1/20 rounded-full transition-colors text-b2 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* edit product */}
        <div className="p-8 space-y-5">
          
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-g1/50">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-g1/20 shrink-0">
              {prevImg ? (
                <img src={prevImg} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <img src={editProduct.image} alt="Preview" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-b1">Product Photo</p>
              <label className="inline-block mt-1 text-xs font-semibold text-b2 cursor-pointer hover:underline">
                Replace Image
                <input type="file" className="hidden" ref={imgRef}
                onChange={(e) => previewImage(e)} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Product Name</label>
              <input 
                type="text" 
                defaultValue={name || editProduct?.name}
                className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none transition-all text-b1"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Price</label>
              <input 
                type="number" 
                defaultValue={price || editProduct?.price}
                className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none transition-all text-b1"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Description</label>
            <textarea 
              rows="3"
              defaultValue={description || editProduct?.description}
              className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none transition-all text-b1 resize-none"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Category</label>
            <select 
              defaultValue={category || editProduct?.category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none appearance-none text-b1"
            >
              <option value="Coffee">Coffee</option>
              <option value="Merch">Merch</option>
              <option value="Food">Food</option>
              <option value="Gifts">Gifts</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          {/* buttons */}
          <div className="flex gap-3 mt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-g1 text-b2 font-bold py-4 rounded-xl hover:bg-g1/10 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`flex-2 bg-b1 hover:bg-b2 text-wh1 font-bold py-4 rounded-xl shadow-lg shadow-b1/20 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all ${loading ? "cursor-wait" : "cursor-pointer"}`}
              onClick={() => updateProductDetails()}
              disabled={loading}
            >
              <RefreshCcw size={18} />
              Update Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products