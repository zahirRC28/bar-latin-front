export const MenuCard = ({ title, price, description, image, onViewImage }) => {
  return (
    <div className="menu-card">
      <div className="menu-card-header">
        <h4>{title}</h4>
        <span className="menu-price">{price}€</span>
      </div>
      <p className="menu-description">{description}</p>
      {image && (
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => onViewImage && onViewImage(image, title)} className="secondary">Ver imagen</button>
        </div>
      )}
    </div>
  )
}
