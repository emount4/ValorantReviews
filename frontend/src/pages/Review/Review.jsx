import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Review.module.css";
import ReviewHeader from "./ReviewHeader";
import Krit from "../../components/common/Modals/Krit/Krit";

const ReviewsPage = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isKritOpen, setIsKritOpen] = useState(false);
  // Состояние формы для отслеживания всех вводимых данных
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    checkboxes: [false, false, false, false],
    ratings: {
      rhymes: 5,
      effects: 5, // изменено с structure
      animations: 5, // изменено с implementation
      sounds: 5, // изменено с individuality
      vibe: 1, // изменено с atmosphere
    },
  });

  const openKrit = () => {
    setIsKritOpen(true);
  };

  const closeKrit = () => {
    setIsKritOpen(false);
  };

  // Загрузка данных о коллекции и существующих отзывов при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем данные коллекции по ID из URL
        const collectionResponse = await fetch(
          `http://localhost:8000/crud_router/collections/${collectionId}`
        );
        const collectionData = await collectionResponse.json();
        setCollection(collectionData);

        // Получаем отзывы для этой коллекции
        const reviewsResponse = await fetch(
          `http://localhost:8000/crud_router/reviews?collection_id=${collectionId}`
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionId]);

  // Обработчик изменения ползунков (рейтингов)
  const handleRatingChange = (category, value) => {
    setFormData({
      ...formData,
      ratings: { ...formData.ratings, [category]: parseInt(value) },
    });
  };

  // Обработчик изменения текстовых полей (заголовок и текст)
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Функция очистки формы до начальных значений
  const handleClearDraft = () => {
    setFormData({
      title: "",
      text: "",
      checkboxes: [false, false, false, false],
      ratings: {
        rhymes: 5,
        effects: 5,
        animations: 5,
        sounds: 5,
        vibe: 1,
      },
    });
  };

  // Функция для расчета процента заполнения
  const calculateFillPercent = (value) => {
    return `${((value - 1) / 9) * 100}%`;
  };

  // Функция для подсчета общего балла по формуле
  const calculateTotalScore = () => {
    const { rhymes, effects, animations, sounds, vibe } = formData.ratings;

    // Линейный множитель для вайба: от 1 (при vibe=1) до 1.6 (при vibe=10)
    const vibeMultiplier = 1 + (vibe - 1) * (0.6 / 9); // (1.6 - 1) / (10 - 1) = 0.6/9

    // Формула: (сумма 4 параметров без вайба) * 1.4 * множитель_вайба
    const sumWithoutVibe = rhymes + effects + animations + sounds;
    const totalScore = sumWithoutVibe * 1.4 * vibeMultiplier;

    return Math.min(Math.round(totalScore), 90); // Ограничиваем максимум 90 баллами
  };

  const totalScore = calculateTotalScore();

  // Отображение индикатора загрузки или ошибки
  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (!collection)
    return <div className={styles.error}>Коллекция не найдена</div>;

  return (
    <div className={styles.container}>
      {/* Заголовок коллекции */}
      <ReviewHeader />

      {/* Форма для написания рецензии */}
      <div className={styles.reviewForm}>
        <div className={styles.leftSection}>
          {/* Правила написания рецензий */}
          <div className={styles.rulesSection}>
            <h2>Правила написания рецензий</h2>
            <ul>
              <li>• Без мата</li>
              <li>• Без оскорблений</li>
              <li>• Без рекламы и ссылок</li>
              <li>• Содержательные</li>
            </ul>
          </div>

          <div className={styles.smallInfo}>
            <h2> Информация </h2>
            <ul>
              <li> Дата выхода: 00.00.0000 </li>
              <li> Редкость: Standart </li>
              <li> Состоит из: Вандал, Фантом ... </li>

              {/* добавить иконку редкости */}
              <h2> Цены: </h2>
              <ul>
                <li> Стоимость коллекции: 5100 VP </li>
                <li> Стоимость оружия: 1275 VP</li>
                <li> Стоимость ножа: 4350 VP </li>
              </ul>

              {/* добавить иконку VP */}
            </ul>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.ratingsContainer}>
            <div className={styles.ratingsSection}>
              <div className={styles.ratingItem}>
                <label>Форма/Качество</label>
                <div className={styles.ratingControl}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.ratings.rhymes}
                    onChange={(e) =>
                      handleRatingChange("rhymes", e.target.value)
                    }
                    className={styles.ratingSlider}
                    style={{
                      "--fill-percent": calculateFillPercent(
                        formData.ratings.rhymes
                      ),
                    }}
                  />
                  <span className={styles.ratingValue}>
                    {formData.ratings.rhymes}
                  </span>
                </div>
              </div>

              <div className={styles.ratingItem}>
                <label>Эффекты/Анимации</label>
                <div className={styles.ratingControl}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.ratings.effects}
                    onChange={(e) =>
                      handleRatingChange("effects", e.target.value)
                    }
                    className={styles.ratingSlider}
                    style={{
                      "--fill-percent": calculateFillPercent(
                        formData.ratings.effects
                      ),
                    }}
                  />
                  <span className={styles.ratingValue}>
                    {formData.ratings.effects}
                  </span>
                </div>
              </div>

              <div className={styles.ratingItem}>
                <label>Импакт/Звуки</label>
                <div className={styles.ratingControl}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.ratings.animations}
                    onChange={(e) =>
                      handleRatingChange("animations", e.target.value)
                    }
                    className={styles.ratingSlider}
                    style={{
                      "--fill-percent": calculateFillPercent(
                        formData.ratings.animations
                      ),
                    }}
                  />
                  <span className={styles.ratingValue}>
                    {formData.ratings.animations}
                  </span>
                </div>
              </div>

              <div className={styles.ratingItem}>
                <label>Уникальность/Шарм</label>
                <div className={styles.ratingControl}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.ratings.sounds}
                    onChange={(e) =>
                      handleRatingChange("sounds", e.target.value)
                    }
                    className={styles.ratingSlider}
                    style={{
                      "--fill-percent": calculateFillPercent(
                        formData.ratings.sounds
                      ),
                    }}
                  />
                  <span className={styles.ratingValue}>
                    {formData.ratings.sounds}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ratingsContainer}>
            <div className={styles.ratingItem}>
              <label>Вайб</label>
              <div className={styles.ratingControl}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.ratings.vibe}
                  onChange={(e) => handleRatingChange("vibe", e.target.value)}
                  className={styles.ratingSlider}
                  style={{
                    "--fill-percent": calculateFillPercent(
                      formData.ratings.vibe
                    ),
                  }}
                />
                <span className={styles.ratingValue}>
                  {formData.ratings.vibe}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.reviewContent}>
            <label className={styles.reviewLabel}> Рецензия </label>
            <div className={styles.titleInput}>
              <input
                type="text"
                placeholder="Заголовок рецензии"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div className={styles.textInput}>
              <textarea
                placeholder="Текст рецензии (от 300 до 8500 символов)"
                value={formData.text}
                onChange={(e) => handleInputChange("text", e.target.value)}
                rows="8"
              />
              <div className={styles.bottomRow}>
                <div className={styles.leftButtons}>
                  <button
                    className={styles.clearButton}
                    onClick={handleClearDraft}
                  >
                    Очистить черновик
                  </button>
                  <button className={styles.clearButton} onClick={openKrit}>
                    Критерии 90-балльной системы оценивания
                  </button>
                </div>

                <div className={styles.charCount}>
                  {formData.text.length} / 8500
                </div>
              </div>
              <div className={styles.scoreSection}>
                <div className={styles.scoreCounter}>
                  <span className={styles.currentScore}>{totalScore}</span>
                  <span className={styles.totalScore}>/90</span>
                </div>
                <button className={styles.submitButton}>✓</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Krit
        isOpen={isKritOpen}
        onClose={closeKrit}
        onSwitchToLogin={() => {
          closeKrit();
        }}
      />
    </div>
  );
};

export default ReviewsPage;
