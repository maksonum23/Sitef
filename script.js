// ==========================================
// НАСТРОЙКИ БИЗНЕСА
// ==========================================
const MY_EMAIL = "3d.tisk.prototype@gmail.com";  // ⚠️ ТВОЙ EMAIL
const WA_NUMBER = "420722246590";         // ⚠️ ТВОЙ НОМЕР (БЕЗ ПЛЮСА!)
const BASE_SETUP_FEE = 60;        
const MIN_ORDER_PRICE = 120;       

// ==========================================
// ПЕРЕМЕННЫЕ
// ==========================================
const elWeight = document.getElementById('weight');
const elMaterial = document.getElementById('material');
const elExpress = document.getElementById('express');
const wTxt = document.getElementById('wTxt');
const elPrice = document.getElementById('totalPrice');

const sendBtn = document.getElementById('sendBtn');
const waBtn = document.getElementById('waBtn');
const popup = document.getElementById('successPopup');

// ==========================================
// КАЛЬКУЛЯТОР ЦЕНЫ
// ==========================================
function updatePrice() {
  let weight = parseFloat(elWeight.value);
  let matPrice = parseFloat(elMaterial.value);
  let isExpress = elExpress.checked;

  wTxt.innerText = weight + " g";
  let rawPrice = BASE_SETUP_FEE + (weight * matPrice);
  let roundedPrice = Math.round(rawPrice / 10) * 10;
  let finalPrice = Math.max(MIN_ORDER_PRICE, roundedPrice);
  
  if (isExpress) {
    finalPrice = Math.round(finalPrice * 1.2);
  }
  elPrice.innerText = finalPrice + " Kč";
}

// ==========================================
// 1. ОТПРАВКА НА EMAIL
// ==========================================
function sendEmailOrder(e) {
  e.preventDefault(); 
  
  let rawName = document.getElementById('customerName').value.trim();
  let rawContact = document.getElementById('customerContact').value.trim();
  let rawNotes = document.getElementById('orderNotes').value.trim();

  // Защита от пустых форм
  if (rawName === "" || rawContact === "" || rawNotes === "") {
    alert("⚠️ Prosím, vyplňte povinné údaje: Jméno, Kontakt a Popis zadání.");
    return;
  }

  const originalText = sendBtn.innerText;
  sendBtn.innerText = "⏳ Odesílání...";
  sendBtn.disabled = true;

  let materialText = elMaterial.options[elMaterial.selectedIndex].text;
  let expressText = elExpress.checked ? "ANO (Expres do 24h)" : "Ne (Standard)";
  let link = document.getElementById('modelLink').value.trim() || "Nemám odkaz";
  let price = elPrice.innerText;

  fetch(`https://formsubmit.co/ajax/${MY_EMAIL}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
        "Jméno": rawName,
        "Kontakt": rawContact,
        "Materiál": materialText,
        "Expres": expressText,
        "Odkaz na model": link,
        "Zadání": rawNotes,
        "Odhad ceny": price,
        "_subject": "🔥 Nová poptávka z webu Prototype3D!"
    })
  })
  .then(response => response.json())
  .then(data => {
    popup.style.display = "flex";
    sendBtn.innerText = originalText;
    sendBtn.disabled = false;

    document.getElementById('customerName').value = "";
    document.getElementById('customerContact').value = "";
    document.getElementById('modelLink').value = "";
    document.getElementById('orderNotes').value = "";
  })
  .catch(error => {
    alert("Chyba při odesílání. Zkontrolujte připojení k internetu.");
    sendBtn.innerText = originalText;
    sendBtn.disabled = false;
  });
}

// ==========================================
// 2. ОТПРАВКА В WHATSAPP
// ==========================================
function sendWhatsAppOrder(e) {
  e.preventDefault();

  // Собираем данные (если клиент что-то не заполнил, подставляем заглушки)
  let name = document.getElementById('customerName').value.trim() || "Neuvedeno";
  let contact = document.getElementById('customerContact').value.trim() || "Neuvedeno";
  let notes = document.getElementById('orderNotes').value.trim() || "Bez detailů";
  
  let materialText = elMaterial.options[elMaterial.selectedIndex].text;
  let expressText = elExpress.checked ? "🔥 ANO (Expres do 24h)" : "⏳ Ne (Standard)";
  let link = document.getElementById('modelLink').value.trim() || "Nemám odkaz";
  let price = elPrice.innerText;

  // Формируем текст
  let msg = `Dobrý den, mám zájem o 3D tisk:\n\n👤 Jméno: ${name}\n📧 Kontakt: ${contact}\n🧪 Materiál: ${materialText}\n⚡ Expres: ${expressText}\n🔗 Model: ${link}\n📝 Zadání: ${notes}\n💰 Odhad ceny: ${price}`;
  
  // Открываем WhatsApp
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И ЗАПУСК
// ==========================================
function closePopup() {
  popup.style.display = "none";
}

// Триггеры
elWeight.addEventListener('input', updatePrice);
elMaterial.addEventListener('change', updatePrice);
elExpress.addEventListener('change', updatePrice);

// Подключаем кнопки к их функциям
sendBtn.addEventListener('click', sendEmailOrder);
waBtn.addEventListener('click', sendWhatsAppOrder);

// Запуск калькулятора при загрузке
updatePrice();