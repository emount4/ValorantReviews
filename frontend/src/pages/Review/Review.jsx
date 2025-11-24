import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./Review.module.css";
import ReviewHeader from "./ReviewHeader";
import Krit from "../../components/common/Modals/Krit/Krit";
import ErrorModal from "../../components/common/Modals/ErrorModal/ErrorModal";

const ReviewsPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isKritOpen, setIsKritOpen] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  
  // Состояние формы для отслеживания всех вводимых данных
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    ratings: {
      design: 5,
      sfx: 5,
      animations: 5,
      sound: 5,
      vibe: 1,
    },
  });

  // 🔥 ФУНКЦИИ ПЕРЕМЕЩЕНЫ ВВЕРХ ДО ИХ ИСПОЛЬЗОВАНИЯ
  // Проверка авторизации
  const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    return !!token;
  };

  // Проверка валидности формы
  const isFormValid = () => {
    return (
      formData.text.length >= 300 && 
      formData.text.length <= 8500 && 
      formData.title.trim().length > 0
    );
  };

  // Проверка, активна ли кнопка отправки
  const isSubmitButtonActive = () => {
    return isAuthenticated() && isFormValid();
  };

  const openKrit = () => {
    setIsKritOpen(true);
  };

  const closeKrit = () => {
    setIsKritOpen(false);
  };

  const showError = (title, message) => {
    setErrorModal({ isOpen: true, title, message });
  };

  const closeError = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  // Загрузка данных о коллекции и существующих отзывах при монтировании компонента
  useEffect(() => {
    console.log("🚀 ReviewsPage component MOUNTED");
    console.log("collectionId:", collectionId);
    console.log("isAuthenticated:", isAuthenticated());
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Пытаемся получить данные из state навигации
        const navigationData = location.state?.collectionData;
        
        if (navigationData) {
          // Если данные пришли из navigate - используем их
          setCollection(navigationData);
        } else {
          // Иначе загружаем по API
          const collectionResponse = await fetch(
            `http://localhost:8000/crud_router/table-data/Collections/column/${collectionId}?column=id&limit=1`
          );
          
          if (collectionResponse.ok) {
            const collectionData = await collectionResponse.json();
            if (collectionData.data && collectionData.data.length > 0) {
              setCollection(collectionData.data[0]);
            } else {
              throw new Error("Коллекция не найдена");
            }
          } else {
            throw new Error("Ошибка загрузки коллекции");
          }
        }

        // Проверяем, есть ли уже рецензия от текущего пользователя
        if (isAuthenticated()) {
          const token = localStorage.getItem("access_token");
          const reviewsResponse = await fetch(
            `http://localhost:8000/reviews/user/me`,
            {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            }
          );
          
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            // Ищем рецензию для этой коллекции
            const userReview = reviewsData.data?.find(
              review => review.collection_id === parseInt(collectionId)
            );
            if (userReview) {
              setExistingReview(userReview);
              // Заполняем форму существующей рецензией
              setFormData({
                title: userReview.title || "",
                text: userReview.content || "",
                ratings: {
                  design: userReview.design || 5,
                  sfx: userReview.sfx || 5,
                  animations: userReview.animations || 5,
                  sound: userReview.sound || 5,
                  vibe: userReview.vibe || 1,
                },
              });
            }
          }
        }

      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        showError("Ошибка загрузки", "Не удалось загрузить данные коллекции");
      } finally {
        setLoading(false);
      }
    };

    if (collectionId) {
      fetchData();
    }
  }, [collectionId, location.state]);

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
      ratings: {
        design: 5,
        sfx: 5,
        animations: 5,
        sound: 5,
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
    const { design, sfx, animations, sound, vibe } = formData.ratings;

    // Линейный множитель для вайба: от 1 (при vibe=1) до 1.6 (при vibe=10)
    const vibeMultiplier = 1 + (vibe - 1) * (0.6 / 9);

    // Формула: (сумма 4 параметров без вайба) * 1.4 * множитель_вайба
    const sumWithoutVibe = design + sfx + animations + sound;
    const totalScore = sumWithoutVibe * 1.4 * vibeMultiplier;

    return Math.min(Math.round(totalScore), 90);
  };

  const totalScore = calculateTotalScore();

  // Обработчик клика по кнопке отправки
  const handleSubmitClick = (e) => {
    console.log("🖱️ Клик по кнопке отправки");
    console.log("📊 Состояние кнопки:", {
      isAuthenticated: isAuthenticated(),
      isFormValid: isFormValid(),
      isSubmitButtonActive: isSubmitButtonActive(),
      textLength: formData.text.length,
      title: formData.title
    });
    
    if (isSubmitButtonActive()) {
      submitReview();
    } else {
      console.log("❌ Кнопка неактивна, причины:");
      if (!isAuthenticated()) console.log("  - Пользователь не авторизован");
      if (!isFormValid()) console.log("  - Форма невалидна");
    }
  };

  // Функция отправки рецензии
  const submitReview = async () => {
    console.log("🟢 Начинаем отправку рецензии...");
    
    // Проверка авторизации
    if (!isAuthenticated()) {
      console.log("❌ Пользователь не авторизован");
      showError(
        "Требуется авторизация", 
        "Для отправки рецензии необходимо войти в систему"
      );
      return;
    }

    console.log("✅ Пользователь авторизован");

    // Валидация формы
    if (formData.text.length < 300) {
      console.log(`❌ Текст слишком короткий: ${formData.text.length} символов`);
      showError(
        "Слишком короткий текст", 
        "Текст рецензии должен содержать не менее 300 символов"
      );
      return;
    }

    if (formData.text.length > 8500) {
      console.log(`❌ Текст слишком длинный: ${formData.text.length} символов`);
      showError(
        "Слишком длинный текст", 
        "Текст рецензии не должен превышать 8500 символов"
      );
      return;
    }

    if (!formData.title.trim()) {
      console.log("❌ Отсутствует заголовок");
      showError(
        "Отсутствует заголовок", 
        "Пожалуйста, введите заголовок рецензии"
      );
      return;
    }

    console.log("✅ Все проверки пройдены");

    try {
      const token = localStorage.getItem("access_token");
      console.log("🔐 Токен:", token ? "есть" : "отсутствует");
      
      const reviewData = {
        collection_id: parseInt(collectionId),
        title: formData.title.trim(),
        content: formData.text,
        total_score: totalScore,
        design: formData.ratings.design,
        sfx: formData.ratings.sfx,
        animations: formData.ratings.animations,
        sound: formData.ratings.sound,
        vibe: formData.ratings.vibe
      };

      console.log("📤 Данные для отправки:", reviewData);

      const response = await fetch("http://localhost:8000/reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      console.log("📨 Получен ответ, статус:", response.status);

      // Получаем текст ответа для отладки
      const responseText = await response.text();
      console.log("📨 Текст ответа:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("❌ Ошибка парсинга JSON:", e);
        throw new Error(`Некорректный ответ от сервера: ${responseText}`);
      }

      if (!response.ok) {
        console.error("❌ Ошибка от сервера:", result);
        throw new Error(result.detail || result.message || `Ошибка HTTP: ${response.status}`);
      }

      console.log("✅ Успешный ответ от сервера:", result);
      
      // Обновляем данные о существующей рецензии
      if (result.review_id) {
        const newReview = { 
          ...reviewData, 
          id: result.review_id,
          is_approved: false,
          created_at: new Date().toISOString()
        };
        setExistingReview(newReview);
      }

      // Очищаем форму после успешной отправки
      handleClearDraft();
      
      // Показываем сообщение об успехе
      showError(
        "Успех!", 
        "Рецензия успешно отправлена на модерацию"
      );

      console.log("🎉 Рецензия успешно отправлена!");

    } catch (error) {
      console.error("❌ Ошибка отправки рецензии:", error);
      
      // Более детальные сообщения об ошибках
      let errorMessage = error.message;
      let errorTitle = "Ошибка отправки";
      
      if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
        errorTitle = "Ошибка сети";
        errorMessage = "Не удалось подключиться к серверу. Проверьте подключение к интернету и запущен ли сервер.";
      } else if (error.message.includes("401")) {
        errorTitle = "Ошибка авторизации";
        errorMessage = "Ваша сессия истекла. Пожалуйста, войдите заново.";
      } else if (error.message.includes("403")) {
        errorTitle = "Доступ запрещен";
        errorMessage = "У вас недостаточно прав для выполнения этого действия.";
      } else if (error.message.includes("404")) {
        errorTitle = "Ресурс не найден";
        errorMessage = "Эндпоинт /reviews/ не найден. Проверьте правильность URL.";
      } else if (error.message.includes("500")) {
        errorTitle = "Ошибка сервера";
        errorMessage = "Внутренняя ошибка сервера. Попробуйте позже.";
      }
      
      showError(errorTitle, errorMessage);
    }
  };

  // Отображение индикатора загрузки или ошибки
  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (!collection)
    return <div className={styles.error}>Коллекция не найдена</div>;

  return (
    <div className={styles.container}>
      {/* Заголовок коллекции */}
      <ReviewHeader />

      {/* Информация о авторизации */}
      {!isAuthenticated() && (
        <div className={styles.authWarning}>
          <p>⚠️ Для написания рецензии необходимо <button onClick={() => navigate("/login")} className={styles.authLink}>войти в систему</button></p>
        </div>
      )}

      {/* Форма для написания рецензии */}
      <div className={styles.reviewForm}>
        {/* Левая секция с информацией - всегда отображается */}
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
              <li> Дата выхода: {collection.release_date || "Не указана"} </li>
              <li> Редкость: {collection.rarity_id || "Не указана"} </li>
              <li> Цена: {collection.price || "Не указана"} VP </li>
              <li> Описание: {collection.description || "Не указано"} </li>
            </ul>
          </div>
        </div>

        {/* Правая секция - меняется в зависимости от наличия рецензии */}
<div className={`${styles.rightSection} ${
  existingReview ? `${styles.withReview} ${
    existingReview.is_approved ? styles.approved : styles.pending
  }` : ''
}`}>
  {existingReview ? (
    // Если рецензия уже существует - показываем только статус
    <div className={styles.reviewStatus}>
      <div className={`${styles.statusCard} ${
        existingReview.is_approved ? styles.approved : styles.pending
      }`}>
        <div className={styles.statusIcon}>
          {existingReview.is_approved ? '✅' : '⏳'}
        </div>
        <div className={styles.statusContent}>
          <h3 className={styles.statusTitle}>
            {existingReview.is_approved 
              ? 'Рецензия одобрена и опубликована' 
              : 'Рецензия на модерации'
            }
          </h3>
          <p className={styles.statusText}>
            {existingReview.is_approved
              ? 'Ваша рецензия прошла модерацию и теперь видна другим пользователям.'
              : 'Ваша рецензия отправлена на проверку модераторам. Обычно это занимает до 24 часов.'
            }
          </p>
        </div>
      </div>
    </div>
          ) : (
            // Если рецензии нет - показываем форму оценивания
            <>
              {/* Блок с рейтингами */}
              <div className={styles.ratingsContainer}>
                <div className={styles.ratingsSection}>
                  {/* Дизайн */}
                  <div className={styles.ratingItem}>
                    <label htmlFor="design-slider">Дизайн</label>
                    <div className={styles.ratingControl}>
                      <input
                        id="design-slider"
                        type="range"
                        min="1"
                        max="10"
                        value={formData.ratings.design}
                        onChange={(e) => handleRatingChange("design", e.target.value)}
                        className={styles.ratingSlider}
                        style={{
                          "--fill-percent": calculateFillPercent(formData.ratings.design),
                        }}
                      />
                      <span className={styles.ratingValue}>
                        {formData.ratings.design}
                      </span>
                    </div>
                  </div>

                  {/* Эффекты */}
                  <div className={styles.ratingItem}>
                    <label htmlFor="sfx-slider">Эффекты</label>
                    <div className={styles.ratingControl}>
                      <input
                        id="sfx-slider"
                        type="range"
                        min="1"
                        max="10"
                        value={formData.ratings.sfx}
                        onChange={(e) => handleRatingChange("sfx", e.target.value)}
                        className={styles.ratingSlider}
                        style={{
                          "--fill-percent": calculateFillPercent(formData.ratings.sfx),
                        }}
                      />
                      <span className={styles.ratingValue}>
                        {formData.ratings.sfx}
                      </span>
                    </div>
                  </div>

                  {/* Анимации */}
                  <div className={styles.ratingItem}>
                    <label htmlFor="animations-slider">Анимации</label>
                    <div className={styles.ratingControl}>
                      <input
                        id="animations-slider"
                        type="range"
                        min="1"
                        max="10"
                        value={formData.ratings.animations}
                        onChange={(e) => handleRatingChange("animations", e.target.value)}
                        className={styles.ratingSlider}
                        style={{
                          "--fill-percent": calculateFillPercent(formData.ratings.animations),
                        }}
                      />
                      <span className={styles.ratingValue}>
                        {formData.ratings.animations}
                      </span>
                    </div>
                  </div>

                  {/* Звук */}
                  <div className={styles.ratingItem}>
                    <label htmlFor="sound-slider">Звук</label>
                    <div className={styles.ratingControl}>
                      <input
                        id="sound-slider"
                        type="range"
                        min="1"
                        max="10"
                        value={formData.ratings.sound}
                        onChange={(e) => handleRatingChange("sound", e.target.value)}
                        className={styles.ratingSlider}
                        style={{
                          "--fill-percent": calculateFillPercent(formData.ratings.sound),
                        }}
                      />
                      <span className={styles.ratingValue}>
                        {formData.ratings.sound}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Вайб */}
              <div className={styles.ratingsContainer}>
                <div className={styles.ratingItem}>
                  <label htmlFor="vibe-slider">Вайб</label>
                  <div className={styles.ratingControl}>
                    <input
                      id="vibe-slider"
                      type="range"
                      min="1"
                      max="10"
                      value={formData.ratings.vibe}
                      onChange={(e) => handleRatingChange("vibe", e.target.value)}
                      className={styles.ratingSlider}
                      style={{
                        "--fill-percent": calculateFillPercent(formData.ratings.vibe),
                      }}
                    />
                    <span className={styles.ratingValue}>
                      {formData.ratings.vibe}
                    </span>
                  </div>
                </div>
              </div>

              {/* Текст рецензии */}
              <div className={styles.reviewContent}>
                <label className={styles.reviewLabel}>Рецензия</label>
                <div className={styles.titleInput}>
                  <input
                    type="text"
                    placeholder="Заголовок рецензии"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    disabled={!isAuthenticated()}
                  />
                </div>

                <div className={styles.textInput}>
                  <textarea
                    placeholder={isAuthenticated() ? "Текст рецензии (от 300 до 8500 символов)" : "Для написания рецензии необходимо авторизоваться"}
                    value={formData.text}
                    onChange={(e) => handleInputChange("text", e.target.value)}
                    rows="8"
                    disabled={!isAuthenticated()}
                  />
                  <div className={styles.bottomRow}>
                    <div className={styles.leftButtons}>
                      <button
                        className={styles.clearButton}
                        onClick={handleClearDraft}
                        disabled={!isAuthenticated()}
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
                    <button 
                      className={`${styles.submitButton} ${!isSubmitButtonActive() ? styles.disabled : ''}`}
                      onClick={handleSubmitClick}
                      disabled={!isSubmitButtonActive()}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Модалки */}
      <Krit
        isOpen={isKritOpen}
        onClose={closeKrit}
        onSwitchToLogin={() => {
          closeKrit();
          navigate("/login");
        }}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeError}
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  );
};

export default ReviewsPage;