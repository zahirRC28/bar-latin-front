import "../styles/menu.css";
import { MenuCard } from "./MenuCard";
import { useState, useEffect } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import useMenuItems from "../hooks/useMenuItems";
import useCategories from "../hooks/useCategories";
import { Martini, Beer, Wine, Droplet, Coffee, Music, Star, Leaf } from 'lucide-react';

const ICON_MAP = { Martini, Beer, Wine, Droplet, Coffee, Music, Star, Leaf };
const ICON_OPTIONS = [
  { key: 'Martini', label: 'Cocktail', Comp: Martini },
  { key: 'Beer', label: 'Beer', Comp: Beer },
  { key: 'Wine', label: 'Wine', Comp: Wine },
  { key: 'Coffee', label: 'Coffee', Comp: Coffee },
  { key: 'Music', label: 'Music', Comp: Music },
  { key: 'Star', label: 'Star', Comp: Star },
  { key: 'Leaf', label: 'Leaf', Comp: Leaf },
  { key: 'Droplet', label: 'Droplet', Comp: Droplet },
];

function resolveIconComp(keyOrName) {
  if (!keyOrName) return Martini;
  // handle object shapes
  if (typeof keyOrName === 'object') {
    if (keyOrName.key) keyOrName = keyOrName.key;
    else if (keyOrName.name) keyOrName = keyOrName.name;
  }
  if (ICON_MAP[keyOrName]) return ICON_MAP[keyOrName];
  const foundKey = ICON_OPTIONS.find(o => String(o.key).toLowerCase() === String(keyOrName).toLowerCase());
  if (foundKey) return foundKey.Comp || Martini;
  const foundLabel = ICON_OPTIONS.find(o => String(o.label).toLowerCase() === String(keyOrName).toLowerCase());
  if (foundLabel) return foundLabel.Comp || Martini;
  // Spanish aliases (and common variants)
  const ALIASES = {
    'cervezas': 'Beer', 'cerveza': 'Beer',
    'vinos': 'Wine', 'vino': 'Wine',
    'cafes': 'Coffee', 'cafés': 'Coffee', 'cafe': 'Coffee',
    'postres': 'Star', 'sin alcohol': 'Droplet',
    'cocteles': 'Martini', 'cocktails': 'Martini', 'cocktail': 'Martini'
  };
  const aliasKey = ALIASES[String(keyOrName).toLowerCase()];
  if (aliasKey) return ICON_MAP[aliasKey] || Martini;
  return Martini;
}

export const MenuSection = () => {
  const ref = useIntersectionObserver({ threshold: 0.1 });
  const { items, fetchMenuItems } = useMenuItems();
  const { items: categories, fetchCategories } = useCategories();
  const [displayedItems, setDisplayedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchMenuItems().catch(() => {});
    fetchCategories().catch(() => {});
  }, []);

  useEffect(() => {
    const list = items || [];
    if (selectedCategory === 'all') setDisplayedItems(list);
    else setDisplayedItems(list.filter(i => String(i.categoryId || i.categoryId) === String(selectedCategory)));
  }, [items, selectedCategory]);

  return (
    <section className="menu-section" ref={ref}>
      <h2>Nuestra Carta</h2>
      <p>Sabores que encienden la noche</p>

      <div className="menu-categories">
        <button className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>Todos</button>
        {categories && categories.map(cat => {
          const IconComp = resolveIconComp(cat.icon || cat.name);
          return (
            <button key={cat.id || cat._id} className={`category-btn ${String(selectedCategory) === String(cat.id || cat._id) ? 'active' : ''}`} onClick={() => setSelectedCategory(cat.id || cat._id)}>
              <IconComp size={18} />
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>

      <div className="menu-grid">
        {displayedItems && displayedItems.length > 0 ? (
          displayedItems.map((item) => (
            <MenuCard
              key={item.id || item._id}
              title={item.name}
              price={item.price}
              description={item.description}
              image={item.imageUrl}
              onViewImage={(src, title) => setSelectedItem({ src, title })}
            />
          ))
        ) : (
          <div className="no-items">Sin menú por el momento</div>
        )}
      </div>

      {selectedItem && (
        <div className="item-modal" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>X</button>
            <img src={selectedItem.src} alt={selectedItem.title} />
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <h3>{selectedItem.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
