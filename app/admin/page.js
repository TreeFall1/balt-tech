'use client';
import s from './page.module.scss';
import Image from "next/image";
import { useState, useEffect } from "react";
import AddProductForm from "@/app/components/AddProcuct/AddProduct";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import {fetchProducts} from "@/app/utils/tools";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('add'); // 'add' | 'list'
  const [products, setProducts] = useState(null);

  const loadProducts = async () => {
    const products = await fetchProducts();
    setProducts(products);
  }

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin) setIsLoggedIn(true);

  }, []);

  const authHandler = async (e) => {
    e.preventDefault();
    setErrorVisible(false);

    const form = new FormData(e.target);
    const username = form.get("username");
    const password = form.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setErrorVisible(true);
        return;
      }

      sessionStorage.setItem("isAdmin", "true");
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Ошибка входа:", err);
      setErrorVisible(true);
    }
  };

  if (!isLoggedIn) {
    return (
        <main className={s.main}>
          <div className={s.authWindow}>
            <div className={s.logoContainer}>
              <Image src={'/logo.svg'} alt={'logo'} width={48} height={48} />
              <Image src={'/logo-text.svg'} alt={'logo'} width={256} height={256} />
            </div>

            <form onSubmit={authHandler} name={'authentication'}>
              <label htmlFor="username">Имя пользователя</label>
              <input
                  required
                  minLength={1}
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
              />
              <label htmlFor="password">Пароль</label>
              <input
                  required
                  minLength={1}
                  id="password"
                  type="password"
                  name="password"
              />

              <h2
                  id="error-text"
                  className={s.authError}
                  style={{ display: errorVisible ? "block" : "none" }}
              >
                Неверный логин или пароль
              </h2>

              <button id="login-button" type="submit">Войти</button>
            </form>
          </div>
        </main>
    );
  }

  return (
      <main className={s.main}>
        <div className={s.adminPanel}>
          {/* Вкладки */}
          <div className={s.tabs}>
            <button
                className={`${s.tabButton} ${activeTab === 'add' ? s.activeTab : ''}`}
                onClick={() => setActiveTab('add')}
            >
              Добавить товар
            </button>
            <button
                className={`${s.tabButton} ${activeTab === 'list' ? s.activeTab : ''}`}
                onClick={() => {
                  setActiveTab('list');
                  loadProducts();
                } }
            >
              Список товаров
            </button>
          </div>

          {/* Содержимое вкладок */}
          <div className={s.tabContent}>
            {activeTab === 'add' && <AddProductForm isEdit={false} />}
            {activeTab === 'list' && (
                <div className={s.list}>
                  {!products?.length ? (
                      <div className="loader"></div>
                  ) : (
                      products.map((p) => <ProductCard isAdmin={true} key={p.id} {...p} />)
                  )}
                </div>
            )}
          </div>
        </div>
      </main>
  );
}
