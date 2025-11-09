'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AddProduct.module.scss";
import { fetchProducts, getProductImages } from "@/app/utils/tools";
import DeleteButton from "@/app/components/DeleteButton/DeleteButton";

export default function AddProductForm({ isEdit = false, productId = null }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [params, setParams] = useState([{ name: "", value: "" }]);

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // === загрузка данных при редактировании ===
  useEffect(() => {
    if (!isEdit || !productId) return;

    const fetchProduct = async () => {
      try {
        const data = await fetchProducts({ id: productId });
        const imageUrls = await getProductImages(productId);

        const allParams = data.product_params || [];
        const descParam = allParams.find((p) => p.name === "Описание");
        const otherParams = allParams.filter((p) => p.name !== "Описание");

        setTitle(data.title || "");
        setPrice(data.price || "");
        setCategory(data.category || "");
        setTag(data.tag || "");
        setDescription(descParam?.value || "");
        setParams(otherParams.length ? otherParams : [{ name: "", value: "" }]);
        setExistingImages(imageUrls || []);
        setMainImage(
            data.main_image
                ? imageUrls.find((url) => url.endsWith(data.main_image))
                : imageUrls[0] || null
        );
      } catch (err) {
        console.error("Ошибка загрузки товара:", err);
        setMessage("❌ Ошибка загрузки данных товара");
      }
    };

    fetchProduct();
  }, [isEdit, productId]);

  // ==== характеристики ====
  const handleParamChange = (index, field, value) => {
    const updated = [...params];
    updated[index][field] = value;
    setParams(updated);
  };
  const addParam = () => setParams([...params, { name: "", value: "" }]);
  const removeParam = (index) => setParams(params.filter((_, i) => i !== index));

  // ==== изображения ====
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (index) => {
    const removed = newImages[index];
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    if (mainImage === removed) setMainImage(null);
  };

  const removeExistingImage = (index) => {
    const imgToRemove = existingImages[index];
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setDeletedImages((prev) => [...prev, imgToRemove]);
    if (mainImage === imgToRemove) setMainImage(null);
  };

  const setAsMain = (img) => {
    setMainImage(img);
  };

  // ==== отправка ====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fullParams = description
          ? [{ name: "Описание", value: description }, ...params]
          : [...params];

      const formData = new FormData();
      formData.append("name", title);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("tag", tag);
      formData.append("params", JSON.stringify(fullParams));

      // 👇 Главная картинка (только имя)
      if (mainImage) {
        const mainName =
            mainImage instanceof File
                ? mainImage.name
                : mainImage.split("/").pop();
        formData.append("mainImage", mainName);
      }

      // 👇 Удалённые изображения
      if (deletedImages.length > 0) {
        const toDelete = deletedImages.map((url) => url.split("/").pop());
        formData.append("deleteImages", JSON.stringify(toDelete));
      }

      // 👇 Новые изображения
      newImages.forEach((file) => formData.append("images", file));

      const response = isEdit
          ? await axios.put(`/api/products/edit/${productId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "X-Username": "admin",
            },
          })
          : await axios.post("/api/products/add", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "X-Username": "admin",
            },
          });

      if (response.status === 200 && !response.data.error) {
        setMessage(isEdit ? "✅ Товар обновлён!" : "✅ Товар добавлен!");
        if (!isEdit) {
          setTitle("");
          setPrice("");
          setCategory("");
          setTag("");
          setDescription("");
          setParams([{ name: "", value: "" }]);
          setNewImages([]);
          setExistingImages([]);
          setPreviewUrls([]);
          setMainImage(null);
          setDeletedImages([]);
        } else{
          sessionStorage.removeItem(`product_images_${productId}`)
        }
      } else {
        setMessage("❌ Ошибка при сохранении товара");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Ошибка при сохранении товара (ОШИБКА)");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>
          {isEdit ? "Редактировать товар" : "Добавить товар"}
        </h2>

        {isEdit && (<DeleteButton productId={productId} onDeleted={() => window.location.reload()} />)}

        <form onSubmit={handleSubmit} className={styles.form} >
          <input
              type="text"
              placeholder="Название товара"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
          />

          <input
              type="text"
              placeholder="Цена"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className={styles.input}
          />

          <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={styles.select}
          >
            <option value="">Выберите категорию</option>
            <option value="Клапана">Клапана</option>
            <option value="Конденсатоотводчики">Конденсатоотводчики</option>
            <option value="Краны">Краны</option>
            <option value="Отводы">Отводы</option>
            <option value="Трубы">Трубы</option>
            <option value="Задвижки">Задвижки</option>
          </select>

          <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className={styles.select}
          >
            <option value="">Без тега</option>
            <option value="new">Новинка</option>
            <option value="sale">Акция</option>
            <option value="hit">Хит</option>
          </select>

          <textarea
              placeholder="Описание товара"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              rows={4}
          />

          <div>
            <h3 className={styles.subtitle}>Характеристики</h3>
            {params.map((param, index) => (
                <div key={index} className={styles.paramRow}>
                  <input
                      type="text"
                      placeholder="Название"
                      value={param.name}
                      onChange={(e) => handleParamChange(index, "name", e.target.value)}
                      className={styles.input}
                  />
                  <input
                      type="text"
                      placeholder="Значение"
                      value={param.value}
                      onChange={(e) => handleParamChange(index, "value", e.target.value)}
                      className={styles.input}
                  />
                  <button
                      type="button"
                      onClick={() => removeParam(index)}
                      className={styles.removeBtn}
                  >
                    ×
                  </button>
                </div>
            ))}
            <button type="button" onClick={addParam} className={styles.addBtn}>
              + Добавить характеристику
            </button>
          </div>

          {/* Изображения */}
          <div>
            <h3 className={styles.subtitle}>Изображения</h3>
            <p className={styles.imgDescription}>
              Для правильного отображения используйте квадратные фото
            </p>

            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className={styles.fileInput}
            />

            {(existingImages.length > 0 || previewUrls.length > 0) && (
                <div className={styles.previewGrid}>
                  {/* существующие */}
                  {existingImages.map((url, index) => {
                    const isMain = mainImage === url;
                    return (
                        <div
                            key={`ex-${index}`}
                            className={`${styles.previewItem} ${isMain ? styles.mainSelected : ""}`}
                            onClick={() => setAsMain(url)}
                        >
                          <img src={url} alt={`existing-${index}`} />
                          <button
                              type="button"
                              className={styles.removeImgBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeExistingImage(index);
                              }}
                          >
                            ✕
                          </button>
                          {isMain && <span className={styles.mainBadge}>Главная</span>}
                        </div>
                    );
                  })}

                  {/* новые */}
                  {previewUrls.map((url, index) => {
                    const file = newImages[index];
                    const isMain = mainImage === file;
                    return (
                        <div
                            key={`new-${index}`}
                            className={`${styles.previewItem} ${isMain ? styles.mainSelected : ""}`}
                            onClick={() => setAsMain(file)}
                        >
                          <img src={url} alt={`preview-${index}`} />
                          <button
                              type="button"
                              className={styles.removeImgBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNewImage(index);
                              }}
                          >
                            ✕
                          </button>
                          {isMain && <span className={styles.mainBadge}>Главная</span>}
                        </div>
                    );
                  })}
                </div>
            )}
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading
                ? "Сохраняется..."
                : isEdit
                    ? "Сохранить изменения"
                    : "Добавить товар"}
          </button>

          {message && (
              <p
                  className={`${styles.message} ${
                      message.startsWith("✅") ? styles.success : styles.error
                  }`}
              >
                {message}
              </p>
          )}
        </form>
      </div>
  );
}
