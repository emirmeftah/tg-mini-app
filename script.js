// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Сообщаем Telegram, что приложение готово
    tg.ready();
    
    // Расширяем на весь экран
    tg.expand();
    
    // Устанавливаем цвет хедера
    tg.setHeaderColor('#0a0a0a');
    tg.setBackgroundColor('#0a0a0a');
    
    // Включаем кнопку закрытия
    tg.enableClosingConfirmation();
    
    // Добавляем анимации при скролле
    initScrollAnimations();
    
    // Добавляем эффекты на карточки
    initCardEffects();
    
    console.log('УРОК Mini App инициализирован!');
    console.log('Платформа:', tg.platform);
    console.log('Версия:', tg.version);
});

// Функция покупки товара
function buyProduct(productName, price) {
    // Визуальный фидбек - анимация кнопки
    const button = event.currentTarget;
    button.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    // Вибрация (если поддерживается)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    
    // Показываем уведомление
    showNotification(`${productName} - ${price}₽`);
    
    // Формируем данные для отправки
    const data = JSON.stringify({
        action: 'buy',
        product: productName,
        price: price,
        timestamp: Date.now()
    });
    
    console.log('Отправка данных:', data);
    
    // Отправляем данные боту через Telegram Web App SDK
    // Небольшая задержка для показа анимации
    setTimeout(() => {
        try {
            tg.sendData(data);
            console.log('Данные успешно отправлены!');
        } catch (error) {
            console.error('Ошибка отправки:', error);
            // Альтернативное уведомление для тестирования вне Telegram
            alert(`Товар: ${productName}\nЦена: ${price}₽\n\nДанные будут отправлены боту.`);
        }
    }, 500);
}

// Показать уведомление
function showNotification(text) {
    const notification = document.getElementById('notification');
    const notificationText = notification.querySelector('.notification-text');
    
    notificationText.textContent = text;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// Эффекты на карточках
function initCardEffects() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        // Эффект наведения с 3D
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
        
        // Эффект касания для мобильных
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// Обработка кнопки "Назад" в Telegram
tg.onEvent('backButtonClicked', function() {
    tg.close();
});

// Показываем кнопку "Назад"
if (tg.BackButton) {
    tg.BackButton.show();
}

// Дополнительные утилиты
const Utils = {
    // Форматирование цены
    formatPrice: (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    },
    
    // Получение данных пользователя
    getUserData: () => {
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            return tg.initDataUnsafe.user;
        }
        return null;
    },
    
    // Проверка темы
    isDarkTheme: () => {
        return tg.colorScheme === 'dark';
    }
};

// Логируем информацию о пользователе (если доступна)
const user = Utils.getUserData();
if (user) {
    console.log('Пользователь:', user.first_name, user.last_name || '');
}