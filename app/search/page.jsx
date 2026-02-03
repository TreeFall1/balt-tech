"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from "@/app/components/Search/Search";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import s from './page.module.scss';


// Separate the logic into a child component
function SearchPageContent() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 780);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
      <>
        <Search
            setResults={setResults}
            setLoading={setLoading}
            setSearched={setSearched}
            initialQuery={initialQuery}
        />
        <div className={s.listContainer}>
          {loading ? (
              <div className={s.loaderContainer}>
                <div className="loader"></div>
              </div>
          ) : searched && !results.length ? (
              <div className={s.noResults}>
                <h3>По вашему запросу ничего не найдено</h3>
                <p>Попробуйте изменить поисковый запрос или поищите что-нибудь другое.</p>
              </div>
          ) : (
              results.map((p) => <ProductCard isMobile={isMobile} key={p.id} {...p} />)
          )}
        </div>
      </>
  );
}

export default function SearchPage() {
  return (
      <main>
        <Suspense fallback={(<div className={'loader'}></div>)}>
          <SearchPageContent />
        </Suspense>
      </main>
  );
}
