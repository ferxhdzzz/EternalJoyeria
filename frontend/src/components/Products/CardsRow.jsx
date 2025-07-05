import './CardsRow.css';
import { useNavigate } from 'react-router-dom';

const Card = ({ image, title, description, price, id }) => {
  const navigate = useNavigate();
  return (
    <div className="card-container">
      <div className="card-effect">
        <div className="card-inner">
          <div className="card__liquid"></div>
          <div className="card__shine"></div>
          <div className="card__glow"></div>
          <div className="card__content">
            <div className="card__badge">TRENDING</div>
            <div className="card__image">
              <img src={image} alt={title} />
            </div>
            <div className="card__text">
              <p className="card__title">{title}</p>
              <p className="card__description">{description}</p>
            </div>
            <div className="card__footer">
              <div className="card__price">{price}</div>
              <div className="card__button" onClick={() => navigate(`/detalle-producto/${id}`)} style={{ cursor: 'pointer' }}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M5 12H19M12 5V19"
                    stroke="currentColor"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CardsRow() {
  return (
    <div className="card-row">
      <Card 
        id="anillo-orquidea"
        image={'/Products/AnilloOrchid.png'}
        title="Anillo de Orquídea"
        description="Anillo artesanal con orquídea natural preservada en resina. Pieza única y elegante."
        price="$1,200.00"
      />
      <Card 
        id="collar-orquidea"
        image={'/Products/CollarOrchid.png'}
        title="Collar de Orquídea"
        description="Collar delicado con orquídea encapsulada, ideal para ocasiones especiales."
        price="$1,500.00"
      />
      <Card 
        id="peineta-orquidea"
        image={'/Products/PeinetaOrchid.png'}
        title="Peineta para el Pelo"
        description="Peineta decorativa con orquídea natural, perfecta para peinados elegantes."
        price="$950.00"
      />
      <Card 
        id="aretes-orquidea"
        image={'/Products/AretesOrchid.png'}
        title="Aretes de Orquídea"
        description="Aretes ligeros y sofisticados con orquídea natural en resina."
        price="$800.00"
      />
    </div>
  );
} 