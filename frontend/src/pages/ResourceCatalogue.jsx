import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import ResourceModal from '../components/ResourceModal';
import toast from 'react-hot-toast';
import './ResourceCatalogue.css';

const TYPE_ICONS = {
  LECTURE_HALL: '🏛️',
  LAB: '🔬',
  MEETING_ROOM: '🗓️',
  EQUIPMENT: '🎥',
  SMART_RESOURCE: '💡',
  OUTDOOR_EVENT_SPACE: '🌿',
  AUDITORIUM_STAGE: '🎤',
  LIBRARY_STUDY_AREA: '📚',
  PODCAST_RECORDING_ROOM: '🎙️',
  MEDIA_PRODUCTION_STUDIO: '🎬',
};

export default function ResourceCatalogue() {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState({
    type: '',
    keyword: '',
    minCapacity: '',
  });

  const [modal, setModal] = useState({
    open: false,
    resource: null,
  });

  const loadAllResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await resourceService.getAll();
      setResources(res.data);
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTypes = useCallback(async () => {
    try {
      const res = await resourceService.getTypes();
      setTypes(res.data);
    } catch (err) {
      toast.error('Failed to load resource types');
    }
  }, []);

  useEffect(() => {
    loadAllResources();
    loadTypes();
  }, [loadAllResources, loadTypes]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};

      if (search.type) params.type = search.type;
      if (search.keyword.trim()) params.keyword = search.keyword.trim();
      if (search.minCapacity !== '') params.minCapacity = Number(search.minCapacity);

      const res =
        Object.keys(params).length > 0
          ? await resourceService.search(params)
          : await resourceService.getAll();

      setResources(res.data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Search failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setSearch({
      type: '',
      keyword: '',
      minCapacity: '',
    });
    await loadAllResources();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;

    try {
      await resourceService.delete(id);
      toast.success('Resource deleted');
      loadAllResources();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Delete failed';
      toast.error(msg);
    }
  };

  const handleStatusToggle = async (resource) => {
    const nextStatus =
      resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';

    try {
      await resourceService.updateStatus(resource.id, nextStatus);
      toast.success(`Status updated to ${nextStatus}`);
      loadAllResources();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Status update failed';
      toast.error(msg);
    }
  };

  const handleBook = (resource) => {
  if (resource.status !== 'ACTIVE') {
    toast.error('This resource is currently out of service');
    return;
  }

  navigate(`/booking/${resource.id}`, {
    state: {
      resource: resource, // ✅ pass the full object, not just id/name
    },
  });
};

  return (
    <div className="catalogue-page">
      <div className="page-backdrop" />

      <div className="catalogue-inner">
        <div className="page-header">
          <div>
            <h1 className="page-title">Facilities &amp; Assets</h1>
            <p className="page-sub">Smart Campus Operations Hub</p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setModal({ open: true, resource: null })}
          >
            + Add Resource
          </button>
        </div>

        <div className="glass-card filter-bar">
          <input
            className="glass-input"
            placeholder="Search by location or building..."
            value={search.keyword}
            onChange={(e) =>
              setSearch((s) => ({ ...s, keyword: e.target.value }))
            }
          />

          <select
            className="glass-select"
            value={search.type}
            onChange={(e) =>
              setSearch((s) => ({ ...s, type: e.target.value }))
            }
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t.replaceAll('_', ' ')}
              </option>
            ))}
          </select>

          <input
            className="glass-input"
            type="number"
            placeholder="Min capacity"
            value={search.minCapacity}
            onChange={(e) =>
              setSearch((s) => ({ ...s, minCapacity: e.target.value }))
            }
          />

          <button className="btn-primary" onClick={handleSearch}>
            Search
          </button>

          <button className="btn-ghost" onClick={handleClear}>
            Clear
          </button>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="empty-state">
            <span>📭</span>
            <p>No resources found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="resource-grid">
            {resources.map((r) => (
              <div key={r.id} className="glass-card resource-card">
                {r.imageUrl && (
                  <img
                    src={r.imageUrl}
                    alt={r.name}
                    className="resource-image"
                  />
                )}

                <div className="resource-icon">
                  {TYPE_ICONS[r.type] || '🏢'}
                </div>

                <div className="resource-header">
                  <div>
                    <h3 className="resource-name">{r.name}</h3>
                    <p className="resource-type">
                      {r.type?.replaceAll('_', ' ')}
                    </p>
                  </div>

                  <span
                    className={`status-badge ${
                      r.status === 'ACTIVE' ? 'active' : 'inactive'
                    }`}
                  >
                    {r.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
                  </span>
                </div>

                <div className="resource-meta">
                  {r.location && (
                    <span>
                      📍 {r.location}
                      {r.building ? `, ${r.building}` : ''}
                    </span>
                  )}

                  {r.capacity && <span>👥 Capacity: {r.capacity}</span>}

                  {r.availabilityStart && (
                    <span>
                      🕐 {r.availabilityStart} – {r.availabilityEnd}
                    </span>
                  )}
                </div>

                {r.description && (
                  <p className="resource-desc">{r.description}</p>
                )}

                <div className="resource-actions">
                  <button
                    className="btn-icon"
                    onClick={() => setModal({ open: true, resource: r })}
                    title="Edit"
                  >
                    ✏️
                  </button>

                  <button
                    className="btn-icon"
                    onClick={() => handleBook(r)}
                    title="Book"
                  >
                    📅
                  </button>

                  <button
                    className="btn-icon"
                    onClick={() => handleStatusToggle(r)}
                    title="Toggle status"
                  >
                    {r.status === 'ACTIVE' ? '🔴' : '🟢'}
                  </button>

                  <button
                    className="btn-icon danger"
                    onClick={() => handleDelete(r.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <ResourceModal
          resource={modal.resource}
          types={types}
          onClose={() => setModal({ open: false, resource: null })}
          onSaved={() => {
            setModal({ open: false, resource: null });
            loadAllResources();
          }}
        />
      )}
    </div>
  );
}