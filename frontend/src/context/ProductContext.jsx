// Proveedor global para que componentes no relacionados (como el chatbot) 
// puedan acceder a la información del producto actual.

import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    // Almacena la información del producto actual que el chatbot debe conocer:
    // { name: string, price: number, stock: number }
    const [currentProduct, setCurrentProduct] = useState(null); 

    return (
        <ProductContext.Provider value={{ currentProduct, setCurrentProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
