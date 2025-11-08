"use client";

import { useState, useMemo, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import { fetchProducts } from "@/app/utils/tools";
import { catalogData } from "@/app/catalog/data";

export default function CatalogPage(props) {
  const { categoryId } = use(props.params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = catalogData.find((el, id) => id + 1 === +categoryId)?.title || "";

  // Товары
  const [mockProducts, setMockProducts] = useState([]);
  const [caching, setCaching] = useState(false);

  // Динамические фильтры
  const [filters, setFilters] = useState({}); // { "Диаметр": [8,10,...], "Материал": ["EPDM", ...] }
  const [selectedFilters, setSelectedFilters] = useState({}); // { "Диаметр": [16], "Материал": ["EPDM"] }

  // Цена
  const [priceRange, setPriceRange] = useState([0, 0]); // текущий выбранный диапазон
  const [priceLimits, setPriceLimits] = useState([0, 0]); // [minPrice, maxPrice] всех товаров

  // Сортировка
  const [sortBy, setSortBy] = useState("");

  // Открытые фильтры
  const [openFilters, setOpenFilters] = useState({ price: true });

  const toggleFilter = (key) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };


  // === 🧠 Кэширование товаров ===
  useEffect(() => {
    const loadProducts = async () => {
      try {

        if(caching){ //Отключение кэширования
          // Проверяем sessionStorage
          const cached = sessionStorage.getItem("catalog_products");
          if (cached) {
            const parsed = JSON.parse(cached);
            setMockProducts(parsed);
            return;
          }
        }


        // Если кэша нет — грузим и сохраняем
        const products = await fetchProducts();
        setMockProducts(products);
        sessionStorage.setItem("catalog_products", JSON.stringify(products));
      } catch (err) {
        console.error("Ошибка загрузки товаров:", err);
      }
    };

    loadProducts();
  }, []);

// Формирование динамических фильтров — только для выбранной категории
  useEffect(() => {
    if (!mockProducts.length) return;

    // Берём только товары текущей категории
    const categoryProducts = mockProducts.filter(
        (p) => p.category?.trim()?.toLowerCase() === title.trim().toLowerCase()
    );

    if (!categoryProducts.length) return;

    const newFilters = {};

    categoryProducts.forEach((product) => {
      product.product_params.forEach((param) => {
        if (!param.value) return;

        const key = param.name.trim();
        let value = param.value.trim();

        const numeric = Number(value.replace(",", "."));
        if (!isNaN(numeric)) value = numeric;

        if (value === "" || value === null) return;

        if (!newFilters[key]) newFilters[key] = new Set();
        newFilters[key].add(value);
      });
    });

    const sortedFilters = {};
    Object.keys(newFilters).forEach((key) => {
      const arr = [...newFilters[key]];
      if (arr.every((v) => typeof v === "number")) arr.sort((a, b) => a - b);
      else arr.sort();
      sortedFilters[key] = arr;
    });

    setFilters(sortedFilters);

    const initialSelected = {};
    Object.keys(sortedFilters).forEach((key) => {
      initialSelected[key] = selectedFilters[key] || [];
    });
    setSelectedFilters(initialSelected);
  }, [mockProducts, title]);


  // Динамический диапазон цены
// Динамический диапазон цены (только для выбранной категории)
  useEffect(() => {
    if (!mockProducts.length) return;

    // Отбираем товары текущей категории
    const categoryProducts = mockProducts.filter(
        (p) => p.category?.trim()?.toLowerCase() === title.trim().toLowerCase()
    );

    if (!categoryProducts.length) {
      setPriceLimits([0, 0]);
      setPriceRange([0, 0]);
      return;
    }

    let minPrice = Infinity;
    let maxPrice = -Infinity;

    categoryProducts.forEach((product) => {
      const priceValue = Number(product.price.replace(/\D/g, ""));
      if (!isNaN(priceValue)) {
        if (priceValue < minPrice) minPrice = priceValue;
        if (priceValue > maxPrice) maxPrice = priceValue;
      }
    });

    if (minPrice === Infinity) minPrice = 0;
    if (maxPrice === -Infinity) maxPrice = 0;

    setPriceLimits([minPrice, maxPrice]);
    setPriceRange([minPrice, maxPrice]);
  }, [mockProducts, title]);


  // Синхронизация с query-параметрами
  useEffect(() => {
    const minPrice = Number(searchParams.get("minPrice")) || priceLimits[0];
    const maxPrice = Number(searchParams.get("maxPrice")) || priceLimits[1];

    const newSelected = { ...selectedFilters };
    Object.keys(filters).forEach((key) => {
      const param = searchParams.get(key);
      newSelected[key] = param
          ? param.split(",").map((v) => {
            const num = Number(v);
            return isNaN(num) ? v : num;
          })
          : [];
    });

    setPriceRange([minPrice, maxPrice]);
    setSelectedFilters(newSelected);

    const sort = searchParams.get("sort") || "";
    setSortBy(sort);
  }, [searchParams, filters, priceLimits]);

  // Обновление query-параметров при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();

    if (priceRange[0] > priceLimits[0]) params.set("minPrice", priceRange[0]);
    if (priceRange[1] < priceLimits[1]) params.set("maxPrice", priceRange[1]);

    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key].length) {
        params.set(key, selectedFilters[key].join(","));
      }
    });

    if (sortBy) params.set("sort", sortBy);

    router.replace(`/catalog/${categoryId}?${params.toString()}`);
  }, [priceRange, selectedFilters, sortBy, categoryId, router, priceLimits]);

  // Тогглер для значений фильтра
  const toggleFilterValue = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
    }));
  };

  // Фильтрация и сортировка
  const filteredProducts = useMemo(() => {
    let products = mockProducts.filter((product) => {
      // ✅ фильтруем по названию категории
      if (product.category?.trim()?.toLowerCase() !== title.trim().toLowerCase()) {
        return false;
      }

      const priceValue = Number(product.price.replace(/\D/g, ""));
      const inPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];

      let matchesAll = true;
      Object.keys(selectedFilters).forEach((key) => {
        if (!selectedFilters[key].length) return;

        const paramValueRaw = product.product_params.find((p) => p.name === key)?.value;
        if (!paramValueRaw) { matchesAll = false; return; }

        let paramValue = paramValueRaw.trim();
        const numeric = Number(paramValue.replace(",", "."));
        if (!isNaN(numeric)) paramValue = numeric;

        if (!selectedFilters[key].includes(paramValue)) matchesAll = false;
      });

      return inPrice && matchesAll;
    });

    if (sortBy === "price-asc") {
      products.sort((a, b) => Number(a.price.replace(/\D/g, "")) - Number(b.price.replace(/\D/g, "")));
    } else if (sortBy === "price-desc") {
      products.sort((a, b) => Number(b.price.replace(/\D/g, "")) - Number(a.price.replace(/\D/g, "")));
    } else if (sortBy === "title") {
      products.sort((a, b) => a.title.localeCompare(b.title));
    }

    return products;
  }, [mockProducts, priceRange, selectedFilters, sortBy]);

  return (
      <main className={styles.catalogPage}>
        {/* Фильтры */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Фильтры</h2>

          {/* Цена */}
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader} onClick={() => toggleFilter("price")}>
              Цена, ₽
              <span className={openFilters.price ? styles.arrowUp : styles.arrowDown}></span>
            </div>
            <div className={`${styles.filterContent} ${openFilters.price ? styles.open : ""}`}>
              <div className={styles.priceInputs}>
                <input
                    type="number"
                    min={priceLimits[0]}
                    max={priceLimits[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                />
                <span>—</span>
                <input
                    type="number"
                    min={priceLimits[0]}
                    max={priceLimits[1]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                />
              </div>
            </div>
          </div>

          {/* Динамические фильтры */}
          {Object.keys(filters).map((key) => (
              <div key={key} className={styles.filterBlock}>
                <div
                    className={`${styles.filterHeader} ${
                        selectedFilters[key]?.length ? styles.activeFilterTitle : ""
                    }`}
                    onClick={() => toggleFilter(key)}
                >
                  {key}
                  <span className={openFilters[key] ? styles.arrowUp : styles.arrowDown}></span>
                </div>
                <div className={`${styles.filterContent} ${openFilters[key] ? styles.open : ""}`}>
                  {filters[key].map((value) => {
                    const isActive = selectedFilters[key]?.includes(value);
                    return (
                        <label
                            key={value}
                            className={`${styles.filterOption} ${isActive ? styles.activeOption : ""}`}
                        >
                          <input
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleFilterValue(key, value)}
                          />
                          <span>{value}</span>
                        </label>
                    );
                  })}
                </div>
              </div>
          ))}

          <button
              className={styles.resetBtn}
              onClick={() => {
                setPriceRange([...priceLimits]);
                const resetSelected = {};
                Object.keys(selectedFilters).forEach((key) => (resetSelected[key] = []));
                setSelectedFilters(resetSelected);
                setSortBy("");
              }}
          >
            Сбросить
          </button>
        </aside>

        {/* Товары */}
        <main className={styles.main}>
          <div className={styles.catalogHeader}>
            <h1>{title}</h1>
            <div className={styles.sortWrapper}>
              <label>Сортировка:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">По умолчанию</option>
                <option value="price-asc">Цена ↑</option>
                <option value="price-desc">Цена ↓</option>
                <option value="title">Название (А–Я)</option>
              </select>
            </div>
          </div>

          <div className={styles.productsGrid}>
            {mockProducts.length === 0 ? (
                <div className="loader"></div>
            ) : (
                filteredProducts.map((p) => <ProductCard key={p.id} {...p} />)
            )}
          </div>
        </main>
      </main>
  );
}
