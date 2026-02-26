import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import useAdminAuth from '../hooks/useAdminAuth';
import useMenuItems from '../hooks/useMenuItems';
import useEvents from '../hooks/useEvents';
import useCategories from '../hooks/useCategories';
import { Coffee, Martini, Beer, Wine, Music, Star, Leaf, Droplet } from 'lucide-react';

export default function AdminPanel() {
  const { token, isAuthenticated, login, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { items: menuItems, createMenuItem, fetchMenuItems, deleteMenuItem, updateMenuItem, loading: menuLoading } = useMenuItems(token);
  const { items: eventsItems, createEvent, fetchEvents, deleteEvent, updateEvent, loading: eventLoading } = useEvents(token);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', imageFile: null, categoryId: '' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', imageFile: null });
  const [msg, setMsg] = useState(null);
  const [editingMenu, setEditingMenu] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const { items: categories, fetchCategories, createCategory, deleteCategory, updateCategory } = useCategories(token);
  const iconOptions = [
    { key: 'Martini', label: 'Cocktail', Comp: Martini },
    { key: 'Beer', label: 'Beer', Comp: Beer },
    { key: 'Wine', label: 'Wine', Comp: Wine },
    { key: 'Coffee', label: 'Coffee', Comp: Coffee },
    { key: 'Music', label: 'Music', Comp: Music },
    { key: 'Star', label: 'Star', Comp: Star },
    { key: 'Leaf', label: 'Leaf', Comp: Leaf },
    { key: 'Droplet', label: 'Droplet', Comp: Droplet },
  ];

  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'Martini' });
  const [editingCategory, setEditingCategory] = useState(null);
  const categorySuggestions = [
    { name: 'Cocktails', icon: 'Martini' },
    { name: 'Cervezas', icon: 'Beer' },
    { name: 'Vinos', icon: 'Wine' },
    { name: 'Cafés', icon: 'Coffee' },
    { name: 'Postres', icon: 'Star' },
    { name: 'Sin Alcohol', icon: 'Droplet' },
  ];

  // helper to resolve icon component robustly (case-insensitive key or label)
  function resolveIconComp(keyOrName) {
    if (!keyOrName) return Martini;
    if (typeof keyOrName === 'object') {
      if (keyOrName.key) keyOrName = keyOrName.key;
      else if (keyOrName.name) keyOrName = keyOrName.name;
    }
    const exact = iconOptions.find(o => o.key === keyOrName);
    if (exact) return exact.Comp || Martini;
    const ciKey = iconOptions.find(o => String(o.key).toLowerCase() === String(keyOrName).toLowerCase());
    if (ciKey) return ciKey.Comp || Martini;
    const byLabel = iconOptions.find(o => String(o.label).toLowerCase() === String(keyOrName).toLowerCase());
    if (byLabel) return byLabel.Comp || Martini;
    // Spanish aliases (and common variants)
    const ALIASES = {
      'cervezas': 'Beer', 'cerveza': 'Beer',
      'vinos': 'Wine', 'vino': 'Wine',
      'cafes': 'Coffee', 'cafés': 'Coffee', 'cafe': 'Coffee',
      'postres': 'Star', 'sin alcohol': 'Droplet',
      'cocteles': 'Martini', 'cocktails': 'Martini', 'cocktail': 'Martini'
    };
    const aliasKey = ALIASES[String(keyOrName).toLowerCase()];
    if (aliasKey) {
      const found = iconOptions.find(o => o.key === aliasKey);
      if (found) return found.Comp || Martini;
    }
    return Martini;
  }

  function getCanonicalIconKey(keyOrName) {
    if (!keyOrName) return 'Martini';
    if (typeof keyOrName === 'object') {
      if (keyOrName.key) keyOrName = keyOrName.key;
      else if (keyOrName.name) keyOrName = keyOrName.name;
    }
    const found = iconOptions.find(o => o.key === keyOrName);
    if (found) return found.key;
    const foundCi = iconOptions.find(o => String(o.key).toLowerCase() === String(keyOrName).toLowerCase());
    if (foundCi) return foundCi.key;
    const foundLabel = iconOptions.find(o => String(o.label).toLowerCase() === String(keyOrName).toLowerCase());
    if (foundLabel) return foundLabel.key;
    const ALIASES = {
      'cervezas': 'Beer', 'cerveza': 'Beer',
      'vinos': 'Wine', 'vino': 'Wine',
      'cafes': 'Coffee', 'cafés': 'Coffee', 'cafe': 'Coffee',
      'postres': 'Star', 'sin alcohol': 'Droplet',
      'cocteles': 'Martini', 'cocktails': 'Martini', 'cocktail': 'Martini'
    };
    const aliasKey = ALIASES[String(keyOrName).toLowerCase()];
    if (aliasKey) return aliasKey;
    return 'Martini';
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login(loginData);
      setMsg('Login exitoso');
    } catch (err) {
      setMsg(err?.message || 'Error en login');
    }
  }

  async function handleCreateMenu(e) {
    e.preventDefault();
    try {
      if (!menuForm.name || !String(menuForm.name).trim()) {
        setMsg('El nombre del item es obligatorio');
        return;
      }
      if (!menuForm.price || !String(menuForm.price).trim()) {
        setMsg('El precio del item es obligatorio');
        return;
      }
      await createMenuItem(menuForm);
      await fetchMenuItems();
      setMsg('Item de menú creado');
      setMenuForm({ name: '', description: '', price: '', imageFile: null, categoryId: '' });
    } catch (err) {
      setMsg(err?.message || 'Error creando item');
    }
  }

  async function handleCreateCategory(e) {
    e.preventDefault();
    try {
      if (!categoryForm.name || !String(categoryForm.name).trim()) {
        setMsg('El nombre de la categoría es obligatorio');
        return;
      }
      await createCategory(categoryForm);
      await fetchCategories();
      setCategoryForm({ name: '', icon: 'Martini' });
      setMsg('Categoría creada');
    } catch (e) {
      setMsg(e?.message || 'Error creando categoría');
    }
  }

  async function handleDeleteCategory(id) {
    try {
      await deleteCategory(id);
      await fetchCategories();
      setMsg('Categoría eliminada');
    } catch (e) {
      setMsg(e?.message || 'Error eliminando categoría');
    }
  }

  async function handleStartEditCategory(cat) {
    setEditingCategory({ ...cat });
  }

  async function handleSaveEditCategory(e) {
    e.preventDefault();
    try {
      await updateCategory(editingCategory.id || editingCategory._id, { name: editingCategory.name, icon: editingCategory.icon });
      setEditingCategory(null);
      await fetchCategories();
      setMsg('Categoría actualizada');
    } catch (e) {
      setMsg(e?.message || 'Error actualizando categoría');
    }
  }

  async function handleCreateEvent(e) {
    e.preventDefault();
    if (!eventForm.imageFile) {
      setMsg('La imagen del evento es obligatoria');
      return;
    }
    try {
      await createEvent(eventForm);
      await fetchEvents();
      setMsg('Evento creado');
      setEventForm({ title: '', description: '', date: '', imageFile: null });
    } catch (err) {
      setMsg(err?.message || 'Error creando evento');
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenuItems().catch(() => {});
      fetchEvents().catch(() => {});
      fetchCategories().catch(() => {});
    }
  }, [isAuthenticated]);

  async function handleDeleteMenu(id) {
    try {
      await deleteMenuItem(id);
      setMsg('Item eliminado');
    } catch (e) {
      setMsg(e?.message || 'Error eliminando item');
    }
  }

  async function handleDeleteEvent(id) {
    try {
      await deleteEvent(id);
      setMsg('Evento eliminado');
    } catch (e) {
      setMsg(e?.message || 'Error eliminando evento');
    }
  }

  async function handleStartEditMenu(item) {
    setEditingMenu({ ...item, imageFile: null });
  }

  async function handleSaveEditMenu(e) {
    e.preventDefault();
    try {
      if (!editingMenu.name || !String(editingMenu.name).trim()) {
        setMsg('El nombre del item es obligatorio');
        return;
      }
      if (!editingMenu.price || !String(editingMenu.price).trim()) {
        setMsg('El precio del item es obligatorio');
        return;
      }
      await updateMenuItem(editingMenu.id || editingMenu._id, editingMenu);
      setEditingMenu(null);
      await fetchMenuItems();
      setMsg('Item actualizado');
    } catch (e) {
      setMsg(e?.message || 'Error actualizando item');
    }
  }

  async function handleStartEditEvent(item) {
    setEditingEvent({ ...item, imageFile: null });
  }

  async function handleSaveEditEvent(e) {
    e.preventDefault();
    try {
      if (!editingEvent.title || !String(editingEvent.title).trim()) {
        setMsg('El título del evento es obligatorio');
        return;
      }
      await updateEvent(editingEvent.id || editingEvent._id, editingEvent);
      setEditingEvent(null);
      await fetchEvents();
      setMsg('Evento actualizado');
    } catch (e) {
      setMsg(e?.message || 'Error actualizando evento');
    }
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {msg && <div style={{ marginBottom: 12 }}>{msg}</div>}

      
      <div style={{ maxWidth: 800 }}>
        <div style={{ maxWidth: 800 }}>
          <div style={{ marginBottom: 20 }}>
            <strong>Autenticado</strong>
            <button onClick={() => { logout(); navigate('/admin/login'); }} style={{ marginLeft: 12 }}>Cerrar sesión</button>
          </div>

          <section style={{ marginBottom: 28 }}>
            <h3>Crear Item de Menú (imagen opcional)</h3>
            <form onSubmit={handleCreateMenu}>
              <div>
                <label>Nombre</label>
                <input required value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} />
              </div>
              <div>
                <label>Categoría</label>
                <select value={menuForm.categoryId || ''} onChange={e => setMenuForm({ ...menuForm, categoryId: e.target.value })}>
                  <option value="">-- Sin categoría --</option>
                  {categories && categories.map(c => (
                    <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Descripción</label>
                <textarea value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} />
              </div>
              <div>
                <label>Precio</label>
                <input value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} />
              </div>
              <div>
                <label>Imagen (opcional)</label>
                <input type="file" accept="image/*" onChange={e => setMenuForm({ ...menuForm, imageFile: e.target.files[0] })} />
              </div>
              <button type="submit" disabled={menuLoading}>Crear Item</button>
            </form>

            <div style={{ marginTop: 12 }}>
              <h4>Categorías</h4>
              <form onSubmit={handleCreateCategory} style={{ display:'flex', gap:8, alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                <input placeholder="Nombre" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {(() => {
                    const IconComp = resolveIconComp(categoryForm.icon);
                    return <IconComp size={20} />
                  })()}
                </div>
                <button type="submit">Crear</button>
              </form>

                <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:8 }} className="category-suggestions">
                  {(() => {
                    const existingNames = new Set((categories || []).map(c => String(c.name || '').toLowerCase()));
                    const existingIcons = new Set((categories || []).map(c => String(c.icon || '').toLowerCase()));
                    return categorySuggestions.map(s => {
                      const Comp = resolveIconComp(s.icon);
                      const exists = existingNames.has(String(s.name).toLowerCase()) || existingIcons.has(String(s.icon).toLowerCase());
                      return (
                        <button key={s.name} type="button" className={`suggestion-btn ${exists ? 'disabled' : ''}`} onClick={() => !exists && setCategoryForm({ name: s.name, icon: s.icon })} disabled={exists}>
                          <Comp size={16} />
                          <span style={{ marginLeft:6 }}>{s.name}</span>
                        </button>
                      )
                    })
                  })()}
                </div>

              {categories && categories.length ? (
                <div className="lists">
                  <ul>
                    {categories.map(cat => {
                        const IconComp = resolveIconComp(cat.icon || cat.name);
                      return (
                        <li key={cat.id || cat._id}>
                          <span style={{display:'flex', alignItems:'center', gap:8}}>
                            <IconComp size={18} />
                            <strong>{cat.name}</strong>
                          </span>
                          <span>
                            <button onClick={() => handleStartEditCategory(cat)} className="secondary">Editar</button>
                            <button onClick={() => handleDeleteCategory(cat.id || cat._id)} style={{ marginLeft:8 }}>Eliminar</button>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : <div className="no-items">No hay categorías</div>}
              {editingCategory && (
                <div style={{ marginTop:12 }}>
                  <h4>Editar Categoría</h4>
                  <form onSubmit={handleSaveEditCategory} style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
                    <input value={editingCategory.name || ''} onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                      {iconOptions.map(opt => {
                        const Comp = opt.Comp;
                        const currentKey = getCanonicalIconKey(editingCategory.icon);
                        return (
                          <button key={opt.key} type="button" className={`suggestion-btn ${currentKey === opt.key ? 'active' : ''}`} onClick={() => setEditingCategory({ ...editingCategory, icon: opt.key })}>
                            <Comp size={16} />
                            <span style={{ marginLeft:6 }}>{opt.label}</span>
                          </button>
                        )
                      })}
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button type="submit">Guardar</button>
                      <button type="button" className="secondary" onClick={() => setEditingCategory(null)}>Cancelar</button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <h4>Items existentes</h4>
              {menuItems && menuItems.length ? (
                <ul>
                  {menuItems.map(it => (
                    <li key={it.id || it._id} style={{ marginBottom: 8 }}>
                      <strong>{it.name}</strong> — {it.price} {' '}
                      <button onClick={() => handleStartEditMenu(it)} style={{ marginLeft: 8 }}>Editar</button>
                      <button onClick={() => handleDeleteMenu(it.id || it._id)} style={{ marginLeft: 8 }}>Eliminar</button>
                    </li>
                  ))}
                </ul>
              ) : <div>No hay items</div>}
            </div>
          </section>

          <section>
            <h3>Crear Evento (imagen obligatoria)</h3>
            <form onSubmit={handleCreateEvent}>
              <div>
                <label>Título</label>
                <input required value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} />
              </div>
              <div>
                <label>Descripción</label>
                <textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} />
              </div>
              <div>
                <label>Fecha</label>
                <input type="date" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} />
              </div>
              <div>
                <label>Imagen (obligatoria)</label>
                <input type="file" accept="image/*" onChange={e => setEventForm({ ...eventForm, imageFile: e.target.files[0] })} />
              </div>
              <button type="submit" disabled={eventLoading}>Crear Evento</button>
            </form>

            <div style={{ marginTop: 12 }}>
              <h4>Eventos existentes</h4>
              {eventsItems && eventsItems.length ? (
                <ul>
                  {eventsItems.map(ev => (
                    <li key={ev.id || ev._id} style={{ marginBottom: 8 }}>
                      <strong>{ev.title}</strong> — {ev.date} {' '}
                      <button onClick={() => handleStartEditEvent(ev)} style={{ marginLeft: 8 }}>Editar</button>
                      <button onClick={() => handleDeleteEvent(ev.id || ev._id)} style={{ marginLeft: 8 }}>Eliminar</button>
                    </li>
                  ))}
                </ul>
              ) : <div>No hay eventos</div>}
            </div>
          </section>

          {editingMenu && (
            <section style={{ marginTop: 18 }}>
              <h3>Editar Item</h3>
              <form onSubmit={handleSaveEditMenu}>
                <div>
                  <label>Nombre</label>
                  <input value={editingMenu.name || ''} onChange={e => setEditingMenu({ ...editingMenu, name: e.target.value })} />
                </div>
                <div>
                  <label>Descripción</label>
                  <textarea value={editingMenu.description || ''} onChange={e => setEditingMenu({ ...editingMenu, description: e.target.value })} />
                </div>
                <div>
                  <label>Precio</label>
                  <input value={editingMenu.price || ''} onChange={e => setEditingMenu({ ...editingMenu, price: e.target.value })} />
                </div>
                <div>
                  <label>Categoría</label>
                  <select value={editingMenu.categoryId || ''} onChange={e => setEditingMenu({ ...editingMenu, categoryId: e.target.value })}>
                    <option value="">-- Sin categoría --</option>
                    {categories && categories.map(c => (
                      <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Actualizar imagen (opcional)</label>
                  <input type="file" accept="image/*" onChange={e => setEditingMenu({ ...editingMenu, imageFile: e.target.files[0] })} />
                </div>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditingMenu(null)} style={{ marginLeft: 8 }}>Cancelar</button>
              </form>
            </section>
          )}

          {editingEvent && (
            <section style={{ marginTop: 18 }}>
              <h3>Editar Evento</h3>
              <form onSubmit={handleSaveEditEvent}>
                <div>
                  <label>Título</label>
                  <input value={editingEvent.title || ''} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} />
                </div>
                <div>
                  <label>Descripción</label>
                  <textarea value={editingEvent.description || ''} onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })} />
                </div>
                <div>
                  <label>Fecha</label>
                  <input type="date" value={editingEvent.date || ''} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                </div>
                <div>
                  <label>Actualizar imagen (obligatorio si reemplazas)</label>
                  <input type="file" accept="image/*" onChange={e => setEditingEvent({ ...editingEvent, imageFile: e.target.files[0] })} />
                </div>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditingEvent(null)} style={{ marginLeft: 8 }}>Cancelar</button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
