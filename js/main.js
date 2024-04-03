const elSelect = document.querySelector(".site-header__select");
const elHeroTitle = document.querySelector(".hero__title-region");
const elHeroDate = document.querySelector(".hero__date");
const elHeroCurrentTime = document.querySelector(".hero__hour");
const elDayBtn = document.querySelector(".day-btn");
const elWeekBtn = document.querySelector(".week-btn");
const elMonthBtn = document.querySelector(".month-btn");
const elMonthBtnSelect = document.querySelector(".hero__month-btn-select");
const elList = document.querySelector(".hero__list");
const elTable = document.querySelector(".hero__table");
const elTableBody = document.querySelector(".hero__table-body");
const elFragment = document.querySelector(".hero__template").content;
const fragment = new DocumentFragment();
let dailyTimes = true;
let weeklyTimes = undefined;
let monthlyTimes = undefined;
const newDailyArr = [];
const monthArr = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr"
];

async function getPrayerTimes(url) {
  const response = await fetch(url);
  const data = await response.json();
  newDailyArr.push(data);
  renderDayPrayerTime(newDailyArr,elList);
}
getPrayerTimes(`https://islomapi.uz/api/present/day?region=Toshkent`);

function renderDayPrayerTime(array,node) {
  array.forEach(element => {
    elList.querySelector(".day-bomdod-time").textContent = element.times.tong_saharlik;
    elList.querySelector(".day-quyosh-time").textContent = element.times.quyosh;
    elList.querySelector(".day-peshin-time").textContent = element.times.peshin;
    elList.querySelector(".day-asr-time").textContent = element.times.asr;
    elList.querySelector(".day-shom-time").textContent = element.times.shom_iftor;
    elList.querySelector(".day-hufton-time").textContent = element.times.hufton;
  });
}

function renderTable(array,node) {
  node.innerHTML = "";
  array.forEach(element => {
    const cloneFragment = elFragment.cloneNode(true);
    
    cloneFragment.querySelector(".table-current-day").textContent = element.weekday;
    cloneFragment.querySelector(".table-date").textContent = element.date.slice(0,10).replaceAll("/",".");
    cloneFragment.querySelector(".table-bomdod").textContent = element.times.tong_saharlik;
    cloneFragment.querySelector(".table-quyosh").textContent = element.times.quyosh;
    cloneFragment.querySelector(".table-peshin").textContent = element.times.peshin;
    cloneFragment.querySelector(".table-asr").textContent = element.times.asr;
    cloneFragment.querySelector(".table-shom").textContent = element.times.shom_iftor;
    cloneFragment.querySelector(".table-hufton").textContent = element.times.hufton;
    
    fragment.appendChild(cloneFragment);
  });
  elTableBody.appendChild(fragment);
}

elDayBtn.addEventListener("click", () => {
  elList.style.display = "flex";
  elTable.style.display = "none";
  
  dailyTimes = true;
  weeklyTimes = false;
  monthlyTimes = false;
})

elWeekBtn.addEventListener("click", () => {
  elList.style.display = "none";
  elTable.style.display = "inline-table";
  
  dailyTimes = false;
  weeklyTimes = true;
  monthlyTimes = false;
  
  async function getPrayerTimes(url) {
    const response = await fetch(url);
    const data = await response.json();
    newDailyArr.push(data);
    renderTable(data,elTableBody);
  }
  getPrayerTimes(`https://islomapi.uz/api/present/week?region=${elSelect.value}`)
})

elMonthBtn.addEventListener("click", () => {
  
  elList.style.display = "none";
  elTable.style.display = "inline-table";
  
  dailyTimes = false;
  weeklyTimes = false;
  monthlyTimes = true;
  
  async function getPrayerTimes(url) {
    const response = await fetch(url);
    const data = await response.json();
    renderTable(data,elTableBody);
  }
  getPrayerTimes(`https://islomapi.uz/api/monthly?region=${elSelect.value}&month=${elMonthBtnSelect.value.slice(0,2)}`);
})

elSelect.addEventListener("change", () => {
  const selectValue = elSelect.value;
  elHeroTitle.textContent = selectValue;
  
  if(dailyTimes) {
    async function getPrayerTimes(url) {
      const response = await fetch(url);
      const data = await response.json();
      newDailyArr.push(data);
      renderDayPrayerTime(newDailyArr,elList);
    }
    getPrayerTimes(`https://islomapi.uz/api/present/day?region=${elSelect.value}`);
  }
  
  if(weeklyTimes) {
    async function getPrayerTimes(url) {
      const response = await fetch(url);
      const data = await response.json();
      renderTable(data,elTableBody);
    }
    getPrayerTimes(`https://islomapi.uz/api/present/week?region=${elSelect.value}`);
  }
  
  if(monthlyTimes) {
    async function getPrayerTimes(url) {
      const response = await fetch(url);
      const data = await response.json();
      renderTable(data,elTableBody);
    }
    getPrayerTimes(`https://islomapi.uz/api/monthly?region=${elSelect.value}&month=${elMonthBtnSelect.value.slice(0,2)}`);
  }
});

function currentTime() {
  const newDate = new Date();
  const currentDate = newDate.getDate().toString().padStart(2,0);
  const currentMonthName = newDate.getMonth();
  const currentYear = newDate.getFullYear();
  const currentHour = newDate.getHours().toString().padStart(2,0);
  const currentMinute = newDate.getMinutes().toString().padStart(2,0);
  const currentSeconds = newDate.getSeconds().toString().padStart(2,0);

  elHeroDate.textContent = `${currentDate} ${monthArr[currentMonthName]} ${currentYear} yil`;
  elHeroCurrentTime.textContent = `${currentHour}:${currentMinute}:${currentSeconds}`;
  elMonthBtnSelect.value = `${currentMonthName + 1} oy`;
}
window.setInterval(currentTime,1000);

elMonthBtnSelect.addEventListener("change", () => {
  if(monthlyTimes) { 
    async function getPrayerTimes(url) {
      const response = await fetch(url);
      const data = await response.json();
      renderTable(data,elTableBody);
    }
    getPrayerTimes(`https://islomapi.uz/api/monthly?region=${elSelect.value}&month=${elMonthBtnSelect.value.slice(0,2)}`);
  }
});



