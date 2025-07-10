import React from 'react';
import '../../styles/CardProd.css';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

const CategoriaCard = ({ categorie, onEdit, onDelete }) => {
  return (
    <div className="product-card-privates">
      <img
        src={categorie.image ? `${categorie.image}?t=${new Date().getTime()}` : "/karinaaaaaa.jpg"}
        alt={categorie.name}
        className="product-image-privates"
      />
      <h3 className="product-name-privates">{categorie.name}</h3>
      <p className="product-description-privates">
        {categorie.description}
      </p>
      <div className="product-actions-privates">
        <EditButton onClick={() => onEdit(categorie)} />
        <DeleteButton onClick={() => onDelete(categorie)} />
      </div>
    </div>
  );
};

export default CategoriaCard;
