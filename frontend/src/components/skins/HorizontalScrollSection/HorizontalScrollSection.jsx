import React, { useRef } from 'react';
import styles from './HorizontalScrollSection.module.css';

const cards = [
  { id: 1, title: 'Коллекция 1' },
  { id: 2, title: 'Коллекция 2' },
  { id: 3, title: 'Коллекция 3' },
  { id: 4, title: 'Коллекция 4' },
  { id: 5, title: 'Коллекция 5' },
];

export default function HorizontalScrollSection() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstChild.offsetWidth + 16; // ширина карточки + gap
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstChild.offsetWidth + 16;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.scrollSectionWrapper}>
      <button onClick={scrollLeft} className={styles.scrollBtn}>◀</button>
      <div className={styles.scrollContainer} ref={scrollRef}>
        {cards.map(card => (
          <div key={card.id} className={styles.card}>
            {card.title}
          </div>
        ))}
      </div>
      <button onClick={scrollRight} className={styles.scrollBtn}>▶</button>
    </div>
  );
}