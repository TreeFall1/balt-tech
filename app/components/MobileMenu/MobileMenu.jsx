'use client'
import s from './MobileMenu.module.scss'
import {Headset, House, Logs} from "lucide-react";
import {useState} from "react";
import {OrderModal} from "@/app/components/Modals/OrderModal/OrderModal";


export const MobileMenu = ()=>{
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const orderModalHandler = ()=>{
    setIsOrderModalOpen(!isOrderModalOpen)
  }

  return (
      <>
        {isOrderModalOpen && <OrderModal isOpen={isOrderModalOpen} closeModal={orderModalHandler} /> }
        <nav className={s.menu}>
          <a href={'/'}>
            <House size={20} color={"var(--orange)"}/> Главная
          </a>
          <a href={'/catalog'}>
            <Logs size={20} color={"var(--orange)"} /> Каталог
          </a>
          <a onClick={orderModalHandler} href={'#'}>
            <Headset size={20} color={"var(--orange)"}/> Заявка
          </a>
        </nav>
      </>

  )
}