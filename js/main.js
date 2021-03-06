
// Предупреждение
setTimeout(() => {
  document.getElementById('info').classList.add('info-open');
}, 5000);

// Кнопка закрытия уведомлений
document.getElementById('accept').addEventListener('click', () => {
  document.getElementById('info').classList.remove('info-open');
})
    