import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './Admin.css';

const CATEGORIES = ['Shirts','T-Shirts','Hoodies','Jackets','Formal Wear','Track Pants','Cotton Pants','Trousers','Innerwear'];
const emptyProduct = { name:'', description:'', category:'Shirts', price:'', discountPrice:'', sizes:['M','L'], colors:['Black'], stock:'', material:'', images:[''], isFeatured:false, isTrending:false };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = 'Products – Admin';
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products?limit=50');
      setProducts(data.products);
    } catch {}
    setLoading(false);
  };

  const openCreate = () => { setForm(emptyProduct); setEditing(null); setModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, sizes: p.sizes || [], colors: p.colors || [], images: p.images || [''] });
    setEditing(p._id); setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice), stock: Number(form.stock),
        sizes: typeof form.sizes === 'string' ? form.sizes.split(',').map(s => s.trim()) : form.sizes,
        colors: typeof form.colors === 'string' ? form.colors.split(',').map(c => c.trim()) : form.colors,
        images: typeof form.images === 'string' ? form.images.split(',').map(i => i.trim()) : form.images,
      };
      if (editing) { await API.put(`/products/${editing}`, payload); toast.success('Product updated'); }
      else { await API.post('/products', payload); toast.success('Product created'); }
      setModal(false); fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await API.delete(`/products/${id}`); toast.success('Product deleted'); fetchProducts(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">
      <div className="page-header"><div className="container"><h1>Product Management</h1><p>Manage your product catalog</p></div></div>
      <div className="container admin-content">
        <div className="card admin-table-card">
          <div className="admin-table-header">
            <input className="form-control" style={{ maxWidth: '300px' }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Product</button>
          </div>
          {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(p => {
                    const price = p.discountPrice > 0 ? p.discountPrice : p.price;
                    return (
                      <tr key={p._id}>
                        <td><img src={p.images?.[0] || 'https://placehold.co/42x50/1a1a2e/white?text=MZ'} alt={p.name} className="product-thumb" /></td>
                        <td><strong>{p.name}</strong><br /><small style={{ color: 'var(--text-muted)' }}>⭐{p.ratings} ({p.numReviews})</small></td>
                        <td>{p.category}</td>
                        <td>₹{price.toLocaleString()}{p.discountPrice > 0 && <><br /><s style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>₹{p.price}</s></>}</td>
                        <td><span className={`badge ${p.stock > 10 ? 'badge-green' : p.stock > 0 ? 'badge-gold' : 'badge-accent'}`}>{p.stock}</span></td>
                        <td>{p.isFeatured && <span className="badge badge-accent" style={{ marginRight: '4px', fontSize: '0.72rem' }}>Featured</span>}{p.isTrending && <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>Trending</span>}</td>
                        <td>
                          <div className="action-btns">
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><FiEdit2 /></button>
                            <button className="btn btn-outline btn-sm" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }} onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {modal && (
        <div className="product-modal-overlay" onClick={() => setModal(false)}>
          <div className="product-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave}>
              {[['name','Product Name','text'],['description','Description','text'],['material','Material','text']].map(([key, label, type]) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label}</label>
                  <input className="form-control" type={type} required={key !== 'material'} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[['price','Price'],['discountPrice','Sale Price'],['stock','Stock']].map(([key, label]) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <input className="form-control" type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div className="form-group"><label className="form-label">Images (comma separated URLs)</label>
                <input className="form-control" value={Array.isArray(form.images) ? form.images.join(',') : form.images} onChange={e => setForm({ ...form, images: e.target.value })} />
              </div>
              <div className="form-group"><label className="form-label">Sizes (comma separated)</label>
                <input className="form-control" value={Array.isArray(form.sizes) ? form.sizes.join(',') : form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} />
              </div>
              <div className="form-group"><label className="form-label">Colors (comma separated)</label>
                <input className="form-control" value={Array.isArray(form.colors) ? form.colors.join(',') : form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '20px', margin: '8px 0' }}>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
                </label>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isTrending} onChange={e => setForm({ ...form, isTrending: e.target.checked })} /> Trending
                </label>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
