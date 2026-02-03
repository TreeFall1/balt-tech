'use client'
import s from './Search.module.scss'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";


export const Search = ({ setResults, setLoading, setSearched, onFocus, onBlur, initialQuery = '', onSearch, queryValue })=>{
  const [query, setQuery] = useState(initialQuery || queryValue || '');
  const router = useRouter();
  const isSearchPage = !!(setResults && setLoading && setSearched);

  async function search() {
    const trimmedQuery = query.trim();

    // Режим локального поиска
    if (onSearch) {
      onSearch(trimmedQuery);
      return;
    }
    if (!trimmedQuery) return; // Не выполнять поиск, если запрос пустой (для других режимов)

    if (isSearchPage) {
      // Логика для страницы /search
      setLoading(true);
      setSearched(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
        const data = await res.json();
        setResults(data.items || []);
      } catch (error) {
        console.error("Ошибка при поиске:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Логика для хедера и других мест - редирект
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  }

  useEffect(() => {
    if (initialQuery && isSearchPage) {
      search();
    }
  }, [initialQuery, isSearchPage]); // Запускаем поиск при изменении initialQuery

  useEffect(() => {
    // Синхронизируем внутреннее состояние с внешним, если оно передано (для сброса)
    if (queryValue !== undefined && query !== queryValue) {
      setQuery(queryValue);
    }
  }, [queryValue]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search();
    }
  }

  return (
      <div className={s['search-container']}>
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            className={s.search} type="text" placeholder={'Поиск по товарам'}
        />
        <button onClick={search}>Найти</button>
      </div>
  )
}