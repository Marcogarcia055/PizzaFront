import React from 'react';
import styles from './Banner.module.css';

const Banner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h1>Hacer pedido<br /></h1>
      </div>
      {/* En un proyecto real usarías la imagen de fondo en CSS o una etiqueta img aquí */}
      <div className={styles.overlay}></div>
    </div>
  );
};

export default Banner;