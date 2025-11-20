import React, { useState } from "react";
import styles from '../Modal.module.css'; 
import ReactDOM from 'react-dom';

const Krit = ({ isOpen, onClose }) => {
  const [openSection, setOpenSection] = useState(null); // null или индекс открытого раздела

  const toggleSection = (sectionIndex) => {
    // Если кликаем на уже открытый раздел - закрываем его, иначе открываем новый
    setOpenSection(openSection === sectionIndex ? null : sectionIndex);
  };

  const criteriaData = [
    {
      title: "КОНЦЕПЦИЯ И ВИЗУАЛЬНАЯ ЦЕЛОСТНОСТЬ",
      content: "Оценка общей идеи коллекции и её исполнения. Простые тактические наборы оцениваются по четкости и утилитарности, тогда как сложные тематические коллекции — по глубине проработки лора и детализации. Высший балл требует полного раскрытия концепции во всех элементах коллекции."
    },
    {
      title: "АНИМАЦИИ И ВИЗУАЛЬНЫЕ ЭФФЕКТЫ",
      content: "• Сложность и плавность — качество анимаций перезарядки, инспекции и финишеров\n• Визуальная синхронизация — единство стиля эффектов across всей коллекции\n• Функциональность — читаемость прицела и отсутствие визуального шума"
    },
    {
      title: "ЗВУКОВОЕ ОФОРМЛЕНИЕ",
      content: "• Качество звукового дизайна — уникальность и четкость звуков стрельбы и перезарядки\n• Тематическое соответствие — гармония звукового сопровождения с визуальным стилем\n• Игровая ценность — информативность звуков для геймплея"
    },
    {
      title: "ДЕТАЛИЗАЦИЯ И КАЧЕСТВО ИСПОЛНЕНИЯ",
      content: "• Уровень проработки — сложность моделей, текстур и мелких деталей\n• Техническое совершенство — отсутствие багов и визуальных артефактов\n• Соответствие цене — оправданность стоимости уровнем качества"
    },
    {
      title: "ИГРОВАЯ АТМОСФЕРА И УНИКАЛЬНОСТЬ",
      content: "Субъективная оценка эмоционального воздействия коллекции: насколько она создает целостное впечатление, выделяется среди других и доставляет удовольствие от использования в игре."
    }
  ];

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.modalCloseBtn} onClick={onClose}>×</button>
        
        <div className={styles.modalBody}>
          <div className={styles.modalHeader}>
            <h2>Критерии 90-балльной системы оценивания</h2>
            <p>Раскройте каждый раздел для подробного ознакомления с критериями оценки</p>
          </div>

          <div className={styles.accordion}>
            {criteriaData.map((item, index) => (
              <div key={index} className={styles.accordionItem}>
                <div 
                  className={`${styles.accordionHeader} ${openSection === index ? styles.accordionHeaderActive : ''}`}
                  onClick={() => toggleSection(index)}
                >
                  <span className={styles.accordionNumber}>{index + 1}</span>
                  <span className={styles.accordionTitle}>{item.title}</span>
                  <span className={styles.accordionIcon}>
                    {openSection === index ? '−' : '+'}
                  </span>
                </div>
                {openSection === index && (
                  <div className={styles.accordionContent}>
                    {item.content.split('\n').map((line, i) => (
                      <p key={i} className={styles.criteriaLine}>
                        {line.startsWith('•') ? (
                          <>
                            <span className={styles.bullet}>•</span>
                            {line.slice(1)}
                          </>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.understandButton} onClick={onClose}>
              Понятно
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Krit;