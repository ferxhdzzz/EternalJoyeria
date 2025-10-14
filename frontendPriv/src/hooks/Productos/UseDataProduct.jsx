import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API_URL = "https://eternaljoyeria-cg5d.onrender.com/api/products";

export const useDataProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Helper: agrega pares al FormData respetando tipos y convenciones del backend
  const appendDataToForm = (formData, data = {}) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return; // no agregamos nulos/indefinidos
      }

      // Imágenes nuevas (archivos)
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => {
          // solo File/Blob
          if (file && typeof file === "object" && ("name" in file || file instanceof Blob)) {
            formData.append("images", file);
          }
        });
        return;
      }

      // URLs de imágenes existentes que se conservan
      if (key === "existingImages") {
        // backend espera string JSON
        const arr = Array.isArray(value) ? value : [];
        formData.append("existingImages", JSON.stringify(arr));
        return;
      }

      // measurements: si viene objeto lo serializamos
      if (key === "measurements" && typeof value === "object" && !Array.isArray(value)) {
        formData.append("measurements", JSON.stringify(value));
        return;
      }

      // booleans a "true"/"false" porque el backend (multer) lo recibe como string
      if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
        return;
      }

      // números/strings u otros casos simples
      formData.append(key, value);
    });
  };

  // Obtener productos (admin: ve todo; público: usar ?hideFlagged=true en su propio hook)
  const fetchProducts = async (opts = {}) => {
    try {
      const { hideFlagged = false } = opts;
      const url = hideFlagged ? `${API_URL}?hideFlagged=true` : API_URL;

      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al obtener productos");

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al obtener productos",
        text: error.message || "Error desconocido",
        confirmButtonColor: "#d6336c",
      });
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al eliminar producto");

      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El producto se eliminó correctamente.",
        confirmButtonColor: "#d6336c",
      });

      fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error.message || "Error desconocido",
        confirmButtonColor: "#d6336c",
      });
    }
  };

  /**
   * Update flexible:
   * - Soporta:
   *   - images: File[]
   *   - existingImages: string[] (URLs que se mantienen)
   *   - isDefectiveOrDeteriorated: boolean
   *   - defectType: "defective" | "deteriorated"
   *   - defectNote: string
   *   - measurements: { ... } (objeto -> JSON)
   *   - otros campos (name, description, price, discountPercentage, stock, category_id)
   */
  const updateProduct = async (id, updatedData = {}) => {
    try {
      const formData = new FormData();
      appendDataToForm(formData, updatedData);

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.message || "Error al actualizar producto");
      }

      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "El producto se actualizó correctamente.",
        confirmButtonColor: "#d6336c",
      });

      fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.message || "Error desconocido",
        confirmButtonColor: "#d6336c",
      });
    }
  };

  /**
   * Crear producto:
   * - Admite imágenes (images: File[])
   * - measurements como objeto (se serializa)
   * - opcionalmente puede incluir isDefectiveOrDeteriorated/defectType/defectNote
   */
  const createProduct = async (productData = {}) => {
    try {
      const formData = new FormData();
      appendDataToForm(formData, productData);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.message || "Error al crear producto");
      }

      Swal.fire({
        icon: "success",
        title: "Producto creado",
        text: "El producto se agregó correctamente.",
        confirmButtonColor: "#d6336c",
      });

      fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al crear producto",
        text: error.message || "Error desconocido",
        confirmButtonColor: "#d6336c",
      });
    }
  };

  /**
   * Atajo para marcar/actualizar estado defectuoso sin tocar el resto:
   * toggleDefective(id, { flag: boolean, type?: "defective"|"deteriorated", note?: string })
   */
  const toggleDefective = async (id, { flag, type = "defective", note = "" } = {}) => {
    return updateProduct(id, {
      isDefectiveOrDeteriorated: !!flag,
      defectType: flag ? type : undefined, // si se desactiva, backend lo limpia
      defectNote: flag ? note : undefined,
    });
  };

  useEffect(() => {
    fetchProducts(); // admin: sin filtro, ve todo
  }, []);

  return {
    products,
    selectedProduct,
    setSelectedProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    toggleDefective,
  };
};
