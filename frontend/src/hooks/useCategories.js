import { useState, useEffect } from 'react';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener categorías desde la base de datos
    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Aquí irá la llamada a tu API cuando conectes el backend
            // const response = await fetch('/api/categories');
            // const data = await response.json();
            
            // Por ahora usamos datos mock, pero esto se reemplazará con datos reales
            const mockCategories = [
                { id: 1, name: 'Collares', slug: 'collares', path: '/productos/categoria/collares', image: '/images/categories/collares.jpg' },
                { id: 2, name: 'Aretes', slug: 'aretes', path: '/productos/categoria/aretes', image: '/images/categories/aretes.jpg' },
                { id: 3, name: 'Conjuntos', slug: 'conjuntos', path: '/productos/categoria/conjuntos', image: '/images/categories/conjuntos.jpg' },
                { id: 4, name: 'Anillos', slug: 'anillos', path: '/productos/categoria/anillos', image: '/images/categories/anillos.jpg' },
                { id: 5, name: 'Pulseras', slug: 'pulseras', path: '/productos/categoria/pulseras', image: '/images/categories/pulseras.jpg' },
                { id: 6, name: 'Tobilleras', slug: 'tobilleras', path: '/productos/categoria/tobilleras', image: '/images/categories/tobilleras.jpg' }
            ];
            
            setCategories(mockCategories);
            setError(null);
        } catch (err) {
            setError('Error al cargar las categorías');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener una categoría específica por slug
    const getCategoryBySlug = (slug) => {
        return categories.find(category => category.slug === slug);
    };

    // Función para obtener una categoría específica por ID
    const getCategoryById = (id) => {
        return categories.find(category => category.id === id);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        getCategoryBySlug,
        getCategoryById
    };
};

export default useCategories; 