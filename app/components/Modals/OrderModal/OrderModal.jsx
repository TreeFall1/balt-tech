"use client";

import s from './OrderModal.module.scss'
import ModalTemplate from "@/app/components/Modals/ModalTemplate/ModalTemplate";
import styles from "@/app/HomePage.module.scss";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { submitOrderForm } from "@/app/utils/tools";

export const OrderModal = (props) => {
  const [loading, setLoading] = useState(false);

  const formHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await submitOrderForm(e.target);

      if (result.ok) {
        alert("Заявка отправлена! Ожидайте звонка 📞");
        e.target.reset();
        props.closeModal();
      } else {
        alert(result.error || "Ошибка отправки 😢");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <ModalTemplate
          isOpen={props.isOpen}
          onClose={props.closeModal}
          title={"Оставьте заявку"}
      >
        <form onSubmit={formHandler} className={s.form}>
          <input name="name" type="text" placeholder="Ваше имя" required />
          <input name="email" type="email" placeholder="Email" />
          <input name="phone" type="tel" placeholder="Телефон" required />

          {props.product && (
              <>
                <input
                    readOnly
                    defaultValue={props.product}
                    name="product"
                    type="text"
                    placeholder="Товар"
                />
                <input
                    readOnly
                    defaultValue={props.id}
                    name="id"
                    type="text"
                    placeholder="ID Товара"
                />
              </>
          )}

          <textarea name="message" placeholder="Сообщение"></textarea>

          <button className={styles.primaryButton} disabled={loading}>
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </form>

        <div className={s.contacts}>
          <a href="tel:+78127080108">
            <Phone color="#e46221" /> +7 (812) 708-01-08
          </a>
          <a href="mailto:bts-sbp@mail.ru">
            <Mail color="#e46221" /> bts-sbp@mail.ru
          </a>
        </div>
      </ModalTemplate>
  );
};
