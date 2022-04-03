const fetchData = function(url) {
  return new Promise(resolve => {
    const XMLHttp = new XMLHttpRequest();
    if(XMLHttp) {
      XMLHttp.onreadystatechange = function() {
        if(XMLHttp.readyState == 4 && XMLHttp.status == 200) {
          resolve(XMLHttp.responseText);
        }
      }
      XMLHttp.open("GET", url);
      XMLHttp.send();
    }
  });
}

const creatorLeaderboard = document.getElementById("creatorLeaderboard");
const fillLeaderboard = async function() {
  const readableUserData = await fetchData("https://gdbrowser.com/api/leaderboard?creator&count=25");
  const userData = JSON.parse(readableUserData);
  
  userData.forEach(async (user, index) => {
    const userCard = document.createElement("div");
    userCard.classList.add("userCard");
    userCard.classList.add(((index + 1) % 2 !== 0) ? "userCard--odd" : "userCard--even");
    userCard.innerHTML = `
      <div class="userCard__y-container">
        <img class="userCard__icon" src="https://gdbrowser.com/icon/${user.accountID}?form=${user.icon.form}" alt="${user.username}">
        <p class="userCard__rank">${user.rank}</p>
      </div>
      <div class="userCard__y-container">
        <div class="userCard__x-container">
          <p class="userCard__username">${user.username}</p>
          <p class="userCard__stat">${user.stars}<span class="icon icon--star"></span></p>
        </div>
        <div class="userCard__x-container">
          <p class="userCard__stat">${user.diamonds}<span class="icon icon--diamond"</p>
          <p class="userCard__stat">${user.coins}<span class="icon icon--coin"></span></p>
          <p class="userCard__stat">${user.userCoins}<span class="icon icon--silvercoin"></span></p>
          <p class="userCard__stat">${user.demons}<span class="icon icon--demon"></span></p>
          <p class="userCard__stat">${user.cp}<span class="icon icon--cp"></span></p>
        </div>
      </div>
    `;
    creatorLeaderboard.appendChild(userCard);
  });
}
fillLeaderboard();
