// components/DeleteProductButton.jsx
"use client";
import axios from "axios";
import { useState } from "react";
import styles from './DeleteButton.module.scss'

export default function DeleteButton({ productId, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот товар?")) return;

    try {
      setLoading(true);

      const response = await axios.delete(`/api/products/delete?id=${productId}`, {
        headers: {
          "X-Username": "admin",
        },
      });

      if (response.status === 200) {
        alert("Товар успешно удалён!");
        onDeleted?.(productId); // коллбэк, если нужно обновить список на странице
      } else {
        alert("Ошибка при удалении товара");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка при удалении товара");
    } finally {
      setLoading(false);
    }
  };

  return (
      <button
          onClick={handleDelete}
          disabled={loading}
          className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 ${styles.button}`}
      >
        {loading ? "Удаление..." : "Удалить товар"}
      </button>
  );
}
