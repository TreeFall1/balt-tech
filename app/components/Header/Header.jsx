'use client'
import s from './Header.module.scss'
import Image from 'next/image'
import {Mail, MapPin, Phone} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {Search} from "@/app/components/Search/Search";
import {OrderModal} from "@/app/components/Modals/OrderModal/OrderModal";


export const Header = ()=>{
  const [iconsSize, setIconsSize] = useState(18);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    setIconsSize(window.innerWidth > 1024 ? 18 : 16)
  }, []);

  const headerClasses = useMemo(() => [
    s["search-container"],
    isSearchActive ? s.searchActive : ''
  ].join(' '), [isSearchActive]);

  const orderModalHandler = ()=>{
    setIsOrderModalOpen(!isOrderModalOpen)
  }

  return(
      <>
        {/*{(isSearchActive) && <div className={s.overlay} onClick={() => setIsSearchActive(false)} />}*/}
        {isOrderModalOpen && <OrderModal isOpen={isOrderModalOpen} closeModal={orderModalHandler} /> }
        <header className={s['header']}>
        <div className={s['info']}>
          <div className={s['container']}>
            <div className={'flex items-center'}>
              <nav className={'flex gap-4'}>
                <a href={'/'}>Главная</a>
                <a href={'/about'}>О нас</a>
                <a href={'/contacts'}>Контакты</a>
              </nav>
            </div>
            <div className={s['links']}>
              <a href={"tel:+78127080108"}><Phone size={iconsSize}/> +7 (812) 708-01-08</a>
              <a href={'mailto:bts-sbp@mail.ru'}><Mail size={iconsSize}/> bts-sbp@mail.ru</a>
              <a target={'_blank'} href={'https://yandex.ru/maps/-/CLQuFK05'} className={'mr-8'}><MapPin
                  size={iconsSize}/> Санкт-Петербург, &nbsp;ул. Коммуны, &nbsp;д. 61А</a>
            </div>
          </div>
        </div>
        <div className={`${s['main']} ${s['mobile']}`}>
            <div className={s['logo-container']}>
              <a href="/">
                <Image className={s['logo']} src={'/logo.svg'} width={32} height={32} alt='Балтех-Сервис'/>
                <Image className={s['logo-text']} style={{marginTop: '4px'}} src={'/logo-text.svg'}
                       alt={'Балтех-Сервис'}
                       height={28} width={220}/>
              </a>
            </div>
            <div className={headerClasses}>
              <Search onFocus={() => setIsSearchActive(true)} onBlur={() => setIsSearchActive(false)} />
            </div>
        </div>
        <div className={`${s['main']}`}>
          <div className={s['logo-container']}>
            <a href="/">
              <Image className={s['logo']} src={'/logo.svg'} width={32} height={32} alt='Балтех-Сервис'/>
              <Image className={s['logo-text']} style={{marginTop: '4px'}} src={'/logo-text.svg'} alt={'Балтех-Сервис'}
                     height={28} width={220}/>
            </a>
            <a href={'/catalog'} className={s['catalog-btn']}>
              <button>Каталог</button>
            </a>
          </div>
          <div className={`${headerClasses}`}>
            <Search onFocus={() => setIsSearchActive(true)} onBlur={() => setIsSearchActive(false)} />
          </div>
          <button onClick={orderModalHandler} className={`border ${s['application-btn']}`}>Заказать звонок</button>
        </div>
      </header>
      </>
  )
}