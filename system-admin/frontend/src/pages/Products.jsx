import { useContext, useRef, useState, useEffect } from "react";
import { Pencil, Trash2, CirclePlus, AlertTriangle, X, Upload, PackagePlus, ChevronDown, RefreshCcw } from 'lucide-react';
import Header from "../components/Header";
import productContext from "../context/products/productContext";
import toast from "react-hot-toast";

const Products = () => {
  const { deleteProduct } = useContext(productContext);
  const [createProduct, setCreateProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  return (
    <div className="h-full w-full px-10 bg-app-bg transition-colors duration-300">
      <Header />
      <div className="flex flex-col h-[calc(100vh-80px)] rounded-lg w-full gap-5 pb-5 overflow-y-auto custom-scrollbar">
        <AllProducts setCreateProduct={setCreateProduct} setEditProduct={setEditProduct} setDelConfirm={setDelConfirm} />
        <CategoryProducts setCreateProduct={setCreateProduct} setEditProduct={setEditProduct} setDelConfirm={setDelConfirm} />
      </div>

      {delConfirm && (
        <DeleteProductModal 
          productName={delConfirm.name} 
          onDelete={async () => {
            await deleteProduct(delConfirm.id);
            setDelConfirm(null);
          }} 
          onCancel={() => setDelConfirm(null)} 
        />
      )}
      
      {editProduct && <EditProduct editProduct={editProduct} onClose={() => setEditProduct(null)} />}
      {createProduct && <CreateProduct createProduct={createProduct} onClose={() => setCreateProduct(false)} />}
    </div>
  );
};

const AllProducts = ({ setCreateProduct, setEditProduct, setDelConfirm }) => {
  const { allProducts } = useContext(productContext);

  return (
    <div className="flex flex-col justify-center w-full py-4 px-6 rounded-3xl gap-4 bg-app-card border border-app-border shadow-sm transition-colors">
      <h2 className="bg-app-bg text-app-text w-max py-1 px-3 rounded-lg text-sm font-bold border border-app-border">All Products</h2>
      <div className="flex gap-4 pb-4 overflow-x-auto flex-nowrap lg:flex-wrap scrollbar-hide">
        <div className="relative min-w-55 h-50 rounded-2xl overflow-hidden group border-2 border-dashed border-app-border hover:border-b1 hover:bg-b1/5 transition-all duration-300 shadow-sm hover:shadow-md shrink-0">
          <button className="flex flex-col items-center justify-center h-full w-full cursor-pointer text-app-text opacity-40 group-hover:opacity-100 transition-all"
            onClick={() => setCreateProduct(true)}>
            <CirclePlus size={48} className="transform group-hover:scale-110 transition-transform duration-200" />
            <span className="mt-2 text-sm font-medium">Add New</span>
          </button>
        </div>
        {allProducts?.map((product) => (
          <ProductCard key={product._id} product={product} setEditProduct={setEditProduct} setDelConfirm={setDelConfirm} />
        ))}
      </div>
    </div>
  );
};

const CategoryProducts = ({ setCreateProduct, setEditProduct, setDelConfirm }) => {
  const { catProducts } = useContext(productContext);
  const categories = ["Coffee", "Food", "Merch", "Gifts", "Equipment"];

  return (
    <>
      {categories?.map(cat => (
        <div key={cat} className="flex flex-col justify-center w-full py-4 px-6 rounded-3xl gap-4 bg-app-card border border-app-border shadow-sm transition-colors">
          <h2 className="bg-app-bg text-app-text w-max py-1 px-3 rounded-lg text-sm font-bold border border-app-border">{cat}</h2>
          <div className="flex gap-4 pb-4 overflow-x-auto flex-nowrap lg:flex-wrap scrollbar-hide">
            {catProducts?.[cat]?.map((product) => (
              <ProductCard key={product._id} product={product} setEditProduct={setEditProduct} setDelConfirm={setDelConfirm} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

const ProductCard = ({ product, setEditProduct, setDelConfirm }) => (
  <div className="relative min-w-55 h-50 rounded-2xl overflow-hidden group shadow-lg shrink-0 border border-app-border">
    <img src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    <div className="absolute inset-0 bg-linear-to-trom-black/80 via-black/20 to-transparent transition-opacity" />
    
    <div className="absolute top-3 right-3 flex gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:text-amber-400 cursor-pointer"
        onClick={() => setEditProduct({ id: product._id, name: product.name, price: product.price, description: product.description, category: product.category, image: product.img })}>
        <Pencil className="w-4 h-4" />
      </button>
      <button className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:text-red-400 cursor-pointer"
        onClick={() => setDelConfirm({ id: product._id, name: product.name })}>
        <Trash2 className="w-4 h-4" />
      </button>
    </div>

    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
      <div className="flex-1 min-w-0 pr-2">
        <p className="font-bold truncate text-sm drop-shadow-lg uppercase tracking-tight">{product.name}</p>
        <p className="text-[10px] opacity-70 uppercase font-medium">{product.category}</p>
      </div>
      <span className="font-semibold text-lg drop-shadow-lg text-white">₱{product.price}</span>
    </div>
  </div>
);

const DeleteProductModal = ({ productName, onDelete, onCancel }) => (
  <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-[2px] transition-all">
    <div className="w-full max-w-md overflow-hidden bg-app-card rounded-4xl shadow-2xl border border-app-border animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between px-6 py-5 bg-red-500/10 border-b border-app-border">
        <div className="flex items-center gap-3 text-red-500">
          <AlertTriangle size={24} />
          <h3 className="text-lg font-bold">Confirm Deletion</h3>
        </div>
        <button onClick={onCancel} className="text-app-text opacity-40 hover:opacity-100 transition-opacity cursor-pointer"><X size={24} /></button>
      </div>
      <div className="p-8 text-center">
        <p className="text-app-text opacity-70 leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-app-text">"{productName}"</span>?
          This action cannot be undone.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 px-8 py-6 bg-app-bg/50">
        <button onClick={onCancel} className="flex-1 px-5 py-3 text-sm font-bold text-app-text bg-app-card border border-app-border rounded-xl hover:bg-app-bg transition-all cursor-pointer">CANCEL</button>
        <button onClick={onDelete} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all cursor-pointer shadow-lg shadow-red-600/20">DELETE</button>
      </div>
    </div>
  </div>
);

const CreateProduct = ({ onClose }) => {
  const { addProduct } = useContext(productContext);
  const imgRef = useRef(null);
  const [prevImg, setPrevImg] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '' });
  const [loading, setLoading] = useState(false);

  const previewImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPrevImg(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastID = toast.loading("Adding product...");
    await addProduct(imgRef?.current?.files[0], form);
    onClose();
    toast.dismiss(toastID);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-4 transition-all">
      <div className="bg-app-card w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-app-border overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-app-border">
          <h2 className="text-2xl font-semibold text-app-text tracking-tighter">NEW PRODUCT</h2>
          <button onClick={onClose} className="p-2 hover:bg-app-bg rounded-full transition-colors text-app-text opacity-40 hover:opacity-100 cursor-pointer" disabled={loading}><X size={24} /></button>
        </div>
        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Product Name" placeholder="Kopiko" onChange={e => setForm({...form, name: e.target.value})} />
            <InputField label="Price (₱)" type="number" placeholder="150" onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-app-text opacity-40 ml-1">Description</label>
            <textarea rows="2" placeholder="Tell us more about this product..." className="w-full bg-app-bg px-4 py-3 rounded-2xl border border-app-border focus:ring-2 focus:ring-b1 outline-none text-app-text placeholder:opacity-70 resize-none" onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-app-text opacity-40 ml-1">Category</label>
            <select className="w-full bg-app-bg px-4 py-3 rounded-2xl border border-app-border text-app-text focus:ring-2 focus:ring-b1 outline-none appearance-none cursor-pointer" onChange={e => setForm({...form, category: e.target.value})}>
              <option value="">Select Category</option>
              {["Coffee", "Merch", "Food", "Gifts", "Equipment"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="group relative border-2 border-dashed border-app-border rounded-4xl p-4 flex flex-col items-center justify-center hover:border-b1 hover:bg-b1/5 transition-all cursor-pointer bg-app-bg/50 overflow-hidden min-h-37.5">
            {prevImg ? (
              <img src={prevImg} className="rounded-2xl w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
            ) : (
              <div className="flex flex-col items-center opacity-40 group-hover:opacity-100">
                <Upload className="text-b1 mb-2" size={32} />
                <p className="text-xs font-bold">UPLOAD PHOTO</p>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" ref={imgRef} onChange={previewImage} />
          </div>
          <button type="submit" className="w-full bg-b1 hover:bg-b2 text-white font-semibold py-4 rounded-2xl shadow-xl shadow-b1/20 flex items-center justify-center gap-2 mt-4 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer" disabled={loading}>
            <PackagePlus size={20} /> ADD TO MENU
          </button>
        </form>
      </div>
    </div>
  );
};

const EditProduct = ({ editProduct, onClose }) => {
  const { updateProduct } = useContext(productContext);
  const imgRef = useRef(null);
  const [prevImg, setPrevImg] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '', id: editProduct.id });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ name: editProduct.name, price: editProduct.price, category: editProduct.category, description: editProduct.description, id: editProduct.id });
  }, [editProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastID = toast.loading("Updating product...");
    await updateProduct(imgRef?.current?.files[0], form);
    onClose();
    toast.dismiss(toastID);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-4 transition-all">
      <div className="bg-app-card w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-app-border overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-app-border">
          <div>
            <h2 className="text-2xl font-semibold text-app-text tracking-tighter uppercase">Edit Product</h2>
            <p className="text-[10px] font-bold text-b1 opacity-80">ID: {editProduct.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-app-bg rounded-full transition-colors text-app-text opacity-40 hover:opacity-100 cursor-pointer" disabled={loading}><X size={24} /></button>
        </div>
        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 p-4 bg-app-bg/50 rounded-3xl border border-app-border">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-app-bg shrink-0">
              <img src={prevImg || editProduct.image} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-app-text opacity-40">PRODUCT PHOTO</p>
              <label className="inline-block mt-1 text-xs font-bold text-b1 cursor-pointer hover:underline uppercase tracking-tighter">
                Replace Image
                <input type="file" className="hidden" ref={imgRef} onChange={e => setPrevImg(URL.createObjectURL(e.target.files[0]))} />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <InputField label="Price (₱)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-app-text opacity-40 ml-1">Description</label>
            <textarea rows="2" value={form.description} className="w-full bg-app-bg px-4 py-3 rounded-2xl border border-app-border focus:ring-2 focus:ring-b1 outline-none text-app-text placeholder:opacity-70 resize-none" onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-app-text opacity-40 ml-1">Category</label>
            <select value={form.category} className="w-full bg-app-bg px-4 py-3 rounded-2xl border border-app-border text-app-text focus:ring-2 focus:ring-b1 outline-none appearance-none cursor-pointer" onChange={e => setForm({...form, category: e.target.value})}>
              {["Coffee", "Merch", "Food", "Gifts", "Equipment"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-5 py-4 text-xs font-semibold text-app-text bg-app-bg border border-app-border rounded-2xl hover:bg-app-card transition-all cursor-pointer">CANCEL</button>
            <button type="submit" className="flex-2 bg-b1 hover:bg-b2 text-white font-semibold py-4 rounded-2xl shadow-xl shadow-b1/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer" disabled={loading}>
              <RefreshCcw size={18} /> UPDATE MENU
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, type = "text", value, placeholder, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-semibold uppercase tracking-widest text-app-text opacity-40 ml-1">{label}</label>
    <input 
      type={type} 
      value={value}
      placeholder={placeholder}
      className="w-full bg-app-bg px-4 py-3 rounded-2xl border border-app-border focus:ring-2 focus:ring-b1 outline-none transition-all text-app-text placeholder:opacity-70 font-bold"
      onChange={onChange}
    />
  </div>
);

export default Products;