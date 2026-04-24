import { useContext, useRef, useState } from "react"
import { Pencil, Trash2, CirclePlus,
  X, Upload, PackagePlus, ChevronDown,
  Save, RefreshCcw, Image as ImageIcon
 } from 'lucide-react';
import Header from "../components/Header"
import productContext from "../context/products/productContext"
import toast from "react-hot-toast";
import { useEffect } from "react";

const Products = () => {
  const [ createProduct, setCreateProduct ] = useState(false); 
  const [ editProduct, setEditProduct ] = useState(null); 

  return (
    <div>
      <Header />
      <AllProducts setCreateProduct={setCreateProduct} setEditProduct={setEditProduct} />
      {editProduct && 
        <EditProduct editProduct={editProduct} onClose={() => setEditProduct(null)} />}
      {createProduct && 
        <CreateProduct createProduct={createProduct} onClose={() => setCreateProduct(false)} />
      }
    </div>
  )
}

const AllProducts = ({ setCreateProduct, setEditProduct }) => {
  const { allProducts } = useContext(productContext);

  return (
    <div className="flex flex-col gap-2">
      <h2>All Products</h2>
      <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="relative min-w-55 h-50 rounded-2xl overflow-hidden group border-2 border-dashed border-gray-200 hover:border-b1 hover:bg-b2/25 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md">
          <button className="flex flex-col items-center justify-center h-full w-full cursor-pointer text-gray-400 group-hover:text-b1 transition-colors group"
          onClick={() => setCreateProduct(true)}>
            <CirclePlus size={48} className="transform group-hover:scale-110 transition-transform duration-200 group-active:scale-100" />
            <span className="mt-2 text-sm font-medium">Add New</span>
          </button>
        </div>
        {allProducts?.map((product) => (
          <div 
            key={product.id} 
            className="relative min-w-55 h-50 rounded-2xl overflow-hidden group shadow-lg"
          >
            {/* Background Image */}
            <img 
              src={product.img} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Dark Overlay for text legibility */}
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
              <button className="hover:text-red-400 cursor-pointer"><Trash2 className="w-5 h-5" /></button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
              <p className="font-medium truncate pr-2 text-sm drop-shadow-md">
                {product.name}
              </p>
              <span className="font-bold text-lg drop-shadow-md">
                {product.price}$
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const CreateProduct = ({ createProduct, onClose }) => {
  if (!createProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-b1/40 backdrop-blur-[2px] p-4">
      {/* Modal Container */}
      <div className="bg-wh1 w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden border border-g1 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-g1/30">
          <h2 className="text-2xl font-bold text-b1">Create Product</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-g1/20 rounded-full transition-colors text-b2 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form className="p-8 space-y-5">
          
          {/* Name and Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Product Name</label>
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none transition-all text-b1 placeholder:text-g1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Price</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none transition-all text-b1 placeholder:text-g1"
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
            ></textarea>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Category</label>
            <div className="relative">
              <select className="w-full bg-white px-4 py-3 rounded-xl border border-g1 focus:border-b2 focus:ring-1 focus:ring-b2 outline-none appearance-none text-b1 cursor-pointer">
                <option value="" className="text-g1">Select Category</option>
                <option value="1">Coffee</option>
                <option value="2">Merch</option>
                <option value="3">Food</option>
                <option value="4">Gifts</option>
                <option value="5">Equipment</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-g2 pointer-events-none" />
            </div>
          </div>

          {/* Upload Image Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-g2 ml-1">Product Image</label>
            <div className="group relative border-2 border-dashed border-g1 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-b2 hover:bg-g1/10 transition-all cursor-pointer bg-white/50">
              <div className="p-3 bg-wh1 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <Upload className="text-b2" size={24} />
              </div>
              <p className="text-sm text-g2 group-hover:text-b1 font-medium transition-colors">Click to upload photo</p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className="w-full bg-b1 hover:bg-b2 text-wh1 font-bold py-4 rounded-xl shadow-lg shadow-b1/20 flex items-center justify-center gap-2 mt-4 transform active:scale-[0.98] transition-all cursor-pointer"
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
            className="p-2 hover:bg-g1/20 rounded-full transition-colors text-b2 cursor-pointer"
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