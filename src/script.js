// По кліку на кнопку Вхід відображаємо модальне вікно
const loginButton = document.getElementById("loginButton");
const loginModal = document.getElementById("loginModal");
const createVisitButton = document.getElementById("createVisitButton");

loginButton.addEventListener("click", () => {
  loginModal.classList.remove("hidden");
});

// Обробник відправки форми входу
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // Відправка запиту на отримання токена
  fetch("https://ajax.test-danit.com/api/v2/cards/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("Incorrect username or password");
      }
    })
    .then((token) => {
      // Збереження токена і приховування модального вікна
      localStorage.setItem("token", token);
      loginModal.classList.add("hidden");

      // Приховуємо кнопку "Вхід"
      loginButton.classList.add("hidden");

      // Показуємо кнопку "Створити візит"
      createVisitButton.classList.remove("hidden");

      // Завантаження списку візитів
      loadVisits();
    })
    .catch((error) => {
      console.error(error);
      // Вивід повідомлення про помилку
    });
});

// Функція для завантаження списку візитів
function loadVisits() {
  const token = localStorage.getItem("token");

  // Відправка запиту на отримання списку візитів
  fetch("https://ajax.test-danit.com/api/v2/cards", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((visits) => {
      const visitsList = document.getElementById("visitsList");

      if (visits.length === 0) {
        visitsList.textContent = "No items have been added";
      }
    })
    .catch((error) => {
      console.error(error);
      // Вивід повідомлення про помилку
    });
}

// Перевіряємо, чи збережений токен в localStorage
const token = localStorage.getItem("token");
if (token) {
  // Якщо токен є, завантажуємо список візитів
  loadVisits();
}
