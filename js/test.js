// All variables 

const elList = document.querySelector('.js-list');
const elRegionInput = document.querySelector('.js-region-input');
const elRegionName = document.querySelector('.js-region-name');
let region = "Toshkent";
const currentDate = new Date();
const current_date = new Date();
const monthMap = [
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
const elDateDesc = document.querySelector('.primary__desc');
const elDateTime = document.querySelector('.primary__date-time');
const elWeekTableBody = document.querySelector('.js-data-table-body');
const elTableTemp = document.querySelector('.js-table-temp').content;
const fragment = document.createDocumentFragment();
const elTableTitle = document.querySelector('.js-table-title');
const elTableWrapper = document.querySelector('.js-table-data-wrapper');
const elInfoWrapper = document.querySelector('.js-info-wrapper');
const elDayBtn = document.querySelector('.js-day');
const elWeekBtn = document.querySelector('.js-week');
const elMonthBtn = document.querySelector('.js-month');



// Region 

function change_region(time) {
    elRegionName.textContent = region;
    elRegionInput.addEventListener('change', (evt) => {
    if(elRegionInput.value.trim().length > 0) {
        region = elRegionInput.value.trim();
        elRegionName.textContent = region;
    }

    if(time === 'daily') {
        getDaily(`https://islomapi.uz/api/present/day?region=${region}`);
        return;
    }

    if(time === 'weekly') {
        getData(`https://islomapi.uz/api/present/week?region=${region}`);
        return;
    }

    if(time === 'monthly') {
        getData(`https://islomapi.uz/api/monthly?region=${region}&month=${currentDate.getMonth() + 1}`, true);
        return;
    }

    });
}




// Date information 

function update_time() {
    const currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = monthMap[currentDate.getMonth()];
    let day = currentDate.getDate();
    let hours = String(currentDate.getHours()).padStart(2, '0');
    let minutes = String(currentDate.getMinutes()).padStart(2, '0');
    let seconds = String(currentDate.getSeconds()).padStart(2, '0');
    elDateTime.textContent = `${hours}:${minutes}:${seconds}s`;
    elDateDesc.textContent = `Sana: ${year} yil ${day} ${month}`;
    elDateDesc.appendChild(elDateTime);
    
}
setInterval(update_time, 1000);


// Switch Btn Active Class

const elBtnWrapper = document.querySelector('.js-btn-wrapper');
const btns = Array.from(elBtnWrapper.childNodes).filter(item => item.classList);
elBtnWrapper.addEventListener('click', (evt) => {
  console.log(evt.target.classList);
  if(evt.target.classList.contains('primary__btn')) {
     btns.forEach(btn => {
        if(evt.target.classList != btn.classList) {
            btn.classList.remove('active-btn');
        }
     });
     evt.target.classList.add('active-btn');
  }
});



// Daily information

function renderDaily(data, list) {
    elItemTimes = list.querySelectorAll('.primary__item-time');
    data.forEach((item, index) => {
        elItemTimes[index].textContent = item;
    });
}

async function getDaily(url) {
    try {
        let res = await fetch(url);
        let data = await res.json();
        
        if(data && res.status == 200) {
            let new_data = Object.values(data.times);   
            renderDaily(new_data, elList);
        }
        
    }catch(err) {
        console.log(err);
    }
    
}

// Default function call 

getDaily(`https://islomapi.uz/api/present/day?region=${region}`);

change_region('daily');


// Weekly and Monthly Information

function renderAsTable(data, node, isMonthly = false) {
    node.innerHTML = ''; 
    data.forEach(item => {
     const temp = elTableTemp.cloneNode(true);
     let nodes = temp.querySelectorAll('.info-table__data');
     let date;
     
     if(!isMonthly) {
        date = item.date.slice(0, item.date.indexOf(',')).replaceAll('/', '.');
        nodes[0].textContent = `${item.weekday} (${date})`;
     }else {
        date = item.date.slice(0, item.date.indexOf('T')).replaceAll('-', '.').split('.').reverse().join('.');
        nodes[0].textContent = `${item.weekday} (${date})`;
     }

     nodes[1].textContent = item.times.tong_saharlik;
     nodes[1].datetime = date.replaceAll('.', '-');
     nodes[2].textContent = item.times.quyosh;
     nodes[2].datetime = date.replaceAll('.', '-');
     nodes[3].textContent = item.times.peshin;
     nodes[3].datetime = date.replaceAll('.', '-');
     nodes[4].textContent = item.times.asr;
     nodes[4].datetime = date.replaceAll('.', '-');
     nodes[5].textContent = item.times.shom_iftor;
     nodes[5].datetime = date.replaceAll('.', '-');
     nodes[6].textContent = item.times.hufton;
     nodes[6].datetime = date.replaceAll('.', '-');
     fragment.appendChild(temp);
    }); 
    elTableTitle.textContent = monthMap[currentDate.getMonth()];
    node.appendChild(fragment);
}



async function getData(url, isMonthly = false) {
    let res = await fetch(url);
    let data = await res.json();

    if(data && res.status == 200) {
        renderAsTable(data, elWeekTableBody, isMonthly); 
    }
}




// Daily, Weekly, Monthly Information 

elDayBtn.addEventListener('click', (evt) => {
    elTableWrapper.style.display = 'none';
    elInfoWrapper.style.display = 'block';
    getDaily(`https://islomapi.uz/api/present/day?region=${region}`);
    change_region('daily');
}); 

elWeekBtn.addEventListener('click' , (evt) => {
    elTableWrapper.style.display = 'flex';
    elInfoWrapper.style.display = 'none';
    getData(`https://islomapi.uz/api/present/week?region=${region}`);
    change_region('weekly');
});

elMonthBtn.addEventListener('click' , (evt) => {
    elTableWrapper.style.display = 'flex';
    elInfoWrapper.style.display = 'none';
    getData(`https://islomapi.uz/api/monthly?region=${region}&month=${currentDate.getMonth() + 1}`, true);
    change_region('monthly');
});



// const elSelect = document.querySelector(".site-header__select");
// const elTable = document.querySelector(".hero__table");
// const elTableBody = document.querySelector(".hero__table-body");
// const elTableHeader = document.querySelector(".hero__table-header");
// const elHeroTitle = document.querySelector(".hero__title-region");
// const elHeroDate = document.querySelector(".hero__date");
// const elHeroTime = document.querySelector(".hero__hour");
// const elFragment = document.querySelector(".hero__template").content;
// const fragment = document.createDocumentFragment();
// const elDayBtn = document.querySelector(".day-btn");
// const elWeekBtn = document.querySelector(".week-btn");
// const elMonthBtn = document.querySelector(".month-btn");
// const elListWrapper = document.querySelector(".hero__list-wrapper");
// const elList = document.querySelector(".hero__list");
// const monthArr = [
//   "Yanvar",
//   "Fevral",
//   "Mart",
//   "Aprel",
//   "May",
//   "Iyun",
//   "Iyul",
//   "August",
//   "Sentyabr",
//   "Oktyabr",
//   "Noyabr",
//   "Dekabr"
// ]
// function renderDayPrayerTime(arr,node) {
//   arr.forEach(element => {
//     elList.querySelector(".day-bomdod-time").textContent = element.times.tong_saharlik;
//     elList.querySelector(".day-quyosh-time").textContent = element.times.quyosh;
//     elList.querySelector(".day-peshin-time").textContent = element.times.peshin;
//     elList.querySelector(".day-asr-time").textContent = element.times.asr;
//     elList.querySelector(".day-shom-time").textContent = element.times.shom_iftor;
//     elList.querySelector(".day-hufton-time").textContent = element.times.hufton
//   });
// }

// function currentDate() {
//   const newDate = new Date();
//   const day = newDate.getDate();
//   const month = newDate.getMonth();
//   const year = newDate.getFullYear();
//   const hour = newDate.getHours().toString().padStart(2,0);
//   const minute = newDate.getMinutes().toString().padStart(2,0);
//   const second = newDate.getSeconds().toString().padStart(2,0);
//   elHeroDate.textContent = `${day} ${monthArr[month]} ${year} yil` 
//   elHeroTime.textContent = `${hour}:${minute}:${second}`;
// }
// currentDate()
// setInterval(currentDate,1000);

//   async function getPrayerTimes(url) {
//     try {
//       const response = await fetch(url)
//       const data = await response.json();
//       renderDayPrayerTime(data,elList);
//       renderTable(data,elTableBody);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// getPrayerTimes(`https://islomapi.uz/api/present/week?region=${elSelect.value}`); 

// function renderTable(arr,node) {
//   node.innerHTML = "";
//   arr.forEach(item => {
//     const fragmentClone = elFragment.cloneNode(true);
//     fragmentClone.querySelector(".table-current-day").textContent = item.weekday;
//     fragmentClone.querySelector(".table-date").textContent = item.date.slice(0,10).replaceAll("/",".");
//     fragmentClone.querySelector(".table-bomdod").textContent = item.times.tong_saharlik;
//     fragmentClone.querySelector(".table-quyosh").textContent = item.times.quyosh;
//     fragmentClone.querySelector(".table-peshin").textContent = item.times.peshin;
//     fragmentClone.querySelector(".table-asr").textContent = item.times.asr;
//     fragmentClone.querySelector(".table-shom").textContent = item.times.shom_iftor;
//     fragmentClone.querySelector(".table-hufton").textContent = item.times.hufton;

//     fragment.append(fragmentClone);
//   });
//   elTableBody.appendChild(fragment);
// }


// elSelect.addEventListener("change", (evt) => {
//   evt.preventDefault();
//   // elTable.innerHTML = "";
//   // elSelect.classList.toggle("select-bg-change"); 
//   const selectValue = elSelect.value.trim();
//   elHeroTitle.textContent = selectValue;
//   getPrayerTimes(`https://islomapi.uz/api/present/day?region=${selectValue}`);
// });

// elDayBtn.addEventListener("click", () => {
//   elListWrapper.style.display = "block";
//   elTable.style.display = "none";
//   getPrayerTimes(`https://islomapi.uz/api/present/day?region=${elSelect.value}`);
// })
// elWeekBtn.addEventListener("click", () => {
//   elTable.style.display = "inline-table";
//   elListWrapper.style.display = "none";
//   getPrayerTimes(`https://islomapi.uz/api/present/week?region=${elSelect.value}`);
// })
// elMonthBtn.addEventListener("click", () => {
//   elTable.style.display = "inline-table";
//   elListWrapper.style.display = "none";
//   getPrayerTimes(`https://islomapi.uz/api/monthly?region=${elSelect.value}&month=4`)
// })

// const elSelect = document.querySelector(".site-header__select");
// const elHeroTitle = document.querySelector(".hero__title-region");
// const elHeroDate = document.querySelector(".hero__date");
// const elHeroTime = document.querySelector(".hero__hour");
// const elDayBtn = document.querySelector(".day-btn");
// const elWeekBtn = document.querySelector(".week-btn");
// const elMonthBtn = document.querySelector(".month-btn");
// const elList = document.querySelector(".hero__list");
// const elTable = document.querySelector(".hero__table");
// const elTableBody = document.querySelector(".hero__table-body");
// const elMonthBtnSelect = document.querySelector(".hero__month-btn-select");
// const elCurrentMonthSelect = document.querySelector(".hero__current-month-option");
// const fragment = new DocumentFragment();
// const elFragment = document.querySelector(".hero__template").content;
// const newArr = [];
// const monthArr = [
//   "Yanvar",
//   "Fevral",
//   "Mart",
//   "Aprel",
//   "May",
//   "Iyun",
//   "Iyul",
//   "August",
//   "Sentyabr",
//   "Oktyabr",
//   "Noyabr",
//   "Dekabr"
// ]

// // bu yerda kunlik namoz vaqtlarini chizish uchun function yozdik 
// function renderDayPrayerTime(arr,node) {
//   arr.forEach(element => {
//     elList.querySelector(".day-bomdod-time").textContent = element.times.tong_saharlik;
//     elList.querySelector(".day-quyosh-time").textContent = element.times.quyosh;
//     elList.querySelector(".day-peshin-time").textContent = element.times.peshin;
//     elList.querySelector(".day-asr-time").textContent = element.times.asr;
//     elList.querySelector(".day-shom-time").textContent = element.times.shom_iftor;
//     elList.querySelector(".day-hufton-time").textContent = element.times.hufton;
//   });
// }

// function renderTable(arr,node) {
//   arr.forEach(function(item) {
//     const cloneFragment = elFragment.cloneNode(true);
//     cloneFragment.querySelector(".table-current-day").textContent = item.weekday;
//     cloneFragment.querySelector(".table-date").textContent = item.date.slice(0,10).replaceAll("/",".");
//     cloneFragment.querySelector(".table-bomdod").textContent = item.times.tong_saharlik;
//     cloneFragment.querySelector(".table-quyosh").textContent = item.times.quyosh;
//     cloneFragment.querySelector(".table-peshin").textContent = item.times.peshin;
//     cloneFragment.querySelector(".table-asr").textContent = item.times.asr;
//     cloneFragment.querySelector(".table-shom").textContent = item.times.shom_iftor;
//     cloneFragment.querySelector(".table-hufton").textContent = item.times.hufton;
//     elCurrentMonthSelect.textContent = item.month;
    
//     fragment.appendChild(cloneFragment);
//   })
//   elTable.appendChild(fragment);
// }

// async function getPrayerTimes(url) {
//   const response = await fetch(url);
//   const data = await response.json();
//   newArr.push(data);
//   renderDayPrayerTime(newArr,elList);
// }
// getPrayerTimes(`https://islomapi.uz/api/present/day?region=${elSelect.value}`);

// // bu yerda hozirgi vaqt korinadigan function yozildi 
// function currentDate() {
//   const newDate = new Date();
//   const currentDay = newDate.getDate();
//   const currentMonth = newDate.getMonth();
//   const currentYear = newDate.getFullYear();
//   const currentHour = newDate.getHours().toString().padStart(2,0);
//   const currentMinute = newDate.getMinutes().toString().padStart(2,0);
//   const currentSeconds = newDate.getSeconds().toString().padStart(2,0);
  
//   elHeroDate.textContent = `${currentDay} ${monthArr[currentMonth]} ${currentYear} yil`;
//   elHeroTime.textContent = `${currentHour}:${currentMinute}:${currentSeconds}`;
// }
// // setInterval bu BOM(Browser Object Model)nig ozida bor bolgan method hisoblanadi u vaqtni boshqaradi.
// window.setInterval(currentDate,1000);

// elSelect.addEventListener("click", (evt) => {
//   elHeroTitle.textContent = elSelect.value;
//   getPrayerTimes(`https://islomapi.uz/api/present/day?region=${elSelect.value}`);
// })

// elDayBtn.addEventListener("click", () => {
//   elTable.style.display = "none";
//   elList.style.display = "flex";
//   getPrayerTimes(`https://islomapi.uz/api/present/day?region=${elSelect.value}`);
//   console.log(elSelect.value);
  
//   async function getPrayerTimes(url) {
//     const response = await fetch(url);
//     const data = await response.json();
//     newArr.push(data);
//     renderDayPrayerTime(newArr,elList);
//   }
// })
// elWeekBtn.addEventListener("click", () => {
//   elList.style.display = "none";
//   elTable.style.display = "inline-table";
  
//   async function getPrayerTimes(url) {
//     const response = await fetch(url);
//     const data = await response.json();
//     renderTable(data,elTableBody)
//   }
//   getPrayerTimes(`https://islomapi.uz/api/present/week?region=${elSelect.value}`);
// })
// elMonthBtn.addEventListener("click", () => {
  
//   async function getPrayerTimes(url) {
//     const response = await fetch(url);
//     const data = await response.json();
//     renderTable(data,elTableBody);
//   }
//   getPrayerTimes(`https://islomapi.uz/api/monthly?region=${elSelect.value}&month=${elMonthBtnSelect.value.slice(0,1)}`);
// })
