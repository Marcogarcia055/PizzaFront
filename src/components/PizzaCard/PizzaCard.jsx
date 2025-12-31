import React from 'react';
import styles from './PizzaCard.module.css';
import { FaStar } from 'react-icons/fa';

const PizzaCard = ({ data, onAdd }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
          <img src={data.image} alt={data.name} />
      </div>
      <h3>{data.name}</h3>
      <p className={styles.desc}>{data.desc}</p>
      
      <div className={styles.footer}>
        <span className={styles.price}>${data.price}</span>
        {/* AQUÍ ESTÁ LA CLAVE: Llamar a onAdd cuando se hace click */}
        <button className={styles.addBtn} onClick={() => onAdd(data)}>+</button> 
      </div>
    </div>
  );
};

export default PizzaCard;