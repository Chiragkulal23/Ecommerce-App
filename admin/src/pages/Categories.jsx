import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Grid3X3,
  Image as ImageIcon
} from 'lucide-react';
import { authAPI, CategoriesAPI } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', imageUrl: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const categoriesAPI = new CategoriesAPI(authAPI.api);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Fetch categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (category = null) => {
    setEditingCategory(category);
    setFormData({
      name: category?.name || '',
      imageUrl: category?.imageUrl || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', imageUrl: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }
    
    if (!formData.imageUrl.trim()) {
      errors.imageUrl = 'Image URL is required';
    } else if (!formData.imageUrl.startsWith('http')) {
      errors.imageUrl = 'Please enter a valid image URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      
      await fetchCategories();
      closeModal();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      setFormErrors({ submit: message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await categoriesAPI.delete(categoryId);
      await fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Category Management</h1>
          <p>Manage your product categories</p>
        </div>
        <button 
          className="btn btn-primary glow"
          onClick={() => openModal()}
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="search-section">
        <div className="search-input">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="results-count">
          {filteredCategories.length} categories found
        </span>
      </div>

      <div className="categories-grid">
        {filteredCategories.length === 0 ? (
          <div className="empty-state">
            <Grid3X3 size={48} />
            <h3>No categories found</h3>
            <p>Get started by creating your first category</p>
            <button 
              className="btn btn-primary glow"
              onClick={() => openModal()}
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-image">
                {category.imageUrl ? (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz4KICA8cGF0aCBkPSJNODAgNzBMMTIwIDExMEwxNjAgNzAiIHN0cm9rZT0iIzlDQTNGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                    }}
                  />
                ) : (
                  <div className="image-placeholder">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-slug">{category.slug}</p>
              </div>

              <div className="category-actions">
                <button
                  className="btn-icon"
                  onClick={() => openModal(category)}
                  title="Edit category"
                >
                  <Edit size={16} />
                </button>
                <button
                  className="btn-icon danger"
                  onClick={() => handleDelete(category._id)}
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
                {formErrors.name && (
                  <span className="error">{formErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formErrors.imageUrl && (
                  <span className="error">{formErrors.imageUrl}</span>
                )}
              </div>

              {formData.imageUrl && (
                <div className="image-preview">
                  <label className="form-label">Image Preview</label>
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="preview-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {formErrors.submit && (
                <div className="error-message">{formErrors.submit}</div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .categories-page {
          padding: 2rem 0;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .header-content p {
          color: #6b7280;
        }

        .search-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-input {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-input svg {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-input input {
          width: 100%;
          padding: 0.5rem 0.75rem 0.5rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .search-input input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .results-count {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }

        .empty-state svg {
          margin-bottom: 1rem;
          color: #9ca3af;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .category-card {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border-radius: 0.75rem;
          box-shadow: 0 12px 30px -12px rgba(99, 102, 241, 0.25);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .category-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px -16px rgba(99, 102, 241, 0.35);
        }

        .category-image {
          height: 200px;
          overflow: hidden;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fce7f3, #e0f2fe);
          color: #6b7280;
        }

        .category-content {
          padding: 1rem;
        }

        .category-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .category-slug {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .category-actions {
          padding: 1rem;
          border-top: 1px solid #f3f4f6;
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          background: white;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background: #f9fafb;
          color: #374151;
        }

        .btn-icon.danger {
          color: #ef4444;
          border-color: #fecaca;
        }

        .btn-icon.danger:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: rgba(255,255,255,0.9);
          border-radius: 0.75rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 12px 30px -12px rgba(99, 102, 241, 0.25);
          backdrop-filter: blur(8px);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(226,232,240,0.7);
        }

        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;
        }

        .modal-close:hover {
          background: rgba(99,102,241,0.12);
          color: #111827;
        }

        .modal-form {
          padding: 1.5rem;
        }

        .image-preview {
          margin-bottom: 1rem;
        }

        .preview-image {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 0.375rem;
          border: 1px solid #e5e7eb;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .error-message {
          background: #fef2f2;
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          border: 1px solid #fecaca;
        }

        @media (max-width: 640px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .search-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-input {
            max-width: none;
          }
          
          .categories-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;
