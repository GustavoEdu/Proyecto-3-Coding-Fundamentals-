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
        <img class="userCard__icon" src="https://gdbrowser.com/icon/icon?form=${user.icon.form}&icon=${user.icon.icon}&col1=${user.icon.col1}&col2=${user.icon.col2}&glow=${user.icon.glow}" alt="${user.username}">
        <p class="userCard__rank">${user.rank}</p>
      </div>
      <div class="userCard__y-container">
        <div class="userCard__x-container">
          <p class="account-hyperlink userCard__username" data-username="${user.username}">${user.username}</p>
          <p class="userCard__stat">${user.stars}<span class="icon icon--md icon--star icon--leaderboard"></span></p>
        </div>
        <div class="userCard__x-container">
          <p class="userCard__stat">${user.diamonds}<span class="icon icon--md icon--diamond icon--leaderboard"</p>
          <p class="userCard__stat">${user.coins}<span class="icon icon--md icon--coin icon--leaderboard"></span></p>
          <p class="userCard__stat">${user.userCoins}<span class="icon icon--md icon--silvercoin icon--leaderboard"></span></p>
          <p class="userCard__stat">${user.demons}<span class="icon icon--md icon--demon icon--leaderboard"></span></p>
          <p class="userCard__stat">${user.cp}<span class="icon icon--md icon--cp icon--leaderboard"></span></p>
        </div>
      </div>
    `;
    creatorLeaderboard.appendChild(userCard);
  });
  setHyperlinkToPersonalAccount();
}
fillLeaderboard();

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const setHyperlinkToPersonalAccount = function() {
  const accountHyperlinks = document.querySelectorAll(".account-hyperlink");
  accountHyperlinks.forEach(accountHyperlink => {
    accountHyperlink.addEventListener("click", async evt => {
      const userName = evt.target.textContent;
      const readableUserData = await fetchData(`https://gdbrowser.com/api/profile/${userName}`);
      const userData = JSON.parse(readableUserData);
      const baseUserIconURL = "https://gdbrowser.com/icon/";
      const baseUserStyle = `col1=${userData.col1}&col2=${userData.col2}&glow=${userData.glow}`;
      /* Fetching User Comments */
      const readableDataAmountPages = await fetchData(`https://gdbrowser.com/api/comments/${userData.accountID}?type=profile`);
      const dataAmountPages = JSON.parse(readableDataAmountPages);
      const amountPages = dataAmountPages[0].pages;
      const userComments = [];
      for(let i = 0; i < amountPages; i++) {
        const readablePartialUserComments= await fetchData(`https://gdbrowser.com/api/comments/${userData.accountID}?type=profile&page=${i}`);
        const partialUserComments = JSON.parse(readablePartialUserComments);
        partialUserComments.forEach(userComment => {userComments.push(userComment)});
      }
      let formattedUserComments = "";
      userComments.forEach((userComment, index) => {
        formattedUserComments += `
          <div class="user-panel__user-comment-wrapper ${((index + 1) % 2 !== 0)? 'user-panel__user-comment-wrapper--odd' : 'user-panel__user-comment-wrapper--even'}">
            <div class="user-panel__user-comment">
              <div class="user-panel__commenter-data-container">
                <p class="user-panel__commenter-username">${userData.username}</p>
                <div class="user-panel__likes-container">
                  <span class="icon icon--md icon--like"></span>
                  <p class="user-panel__likes">${userComment.likes}</p>
                </div>
              </div>
              <div class="user-panel__comment-content-container">
                <p class="user-panel__comment-content">${userComment.content}</p>
              </div>
              <div class="user-panel__comment-date-container">
                <p class="user-panel__comment-date">${userComment.date}</p>
              </div>
            </div>
          </div>
        `;
      });
      /* /Fetching User Comments */
      modalContent.innerHTML = `
        <div class="y-container">
          <div class="user-panel__header-container">
            <div class="user-panel__rank-container">
              <span class="icon icon--lg icon--trophy"></span>
              <p class="user-panel__rank">${userData.rank}</p>
            </div>
            <div class="user-panel__username-container">
              <span></span>
              <p class="user-panel__username">${userData.username}</p>
            </div>
          </div>
          <div class="user-panel__stats">
            <div class="user-panel__stat-container">
              <p class="user-panel__stat">${userData.stars}</p>
              <span class="icon icon--lg icon--star"></span>
            </div>
            <div class="user-panel__stat-container">
              <p class="user-panel__stat">${userData.diamonds}</p>
              <span class="icon icon--lg icon--diamond"></span>
            </div>
            <div class="user-panel__stat-container">
              <p class="user-panel__stat">${userData.coins}</p>
              <span class="icon icon--lg icon--coin"></span>
            </div>
            <div class="user-panel__stat-container">
              <p class="user-panel__stat">${userData.userCoins}</p>
              <span class="icon icon--lg icon--silvercoin"></span>
            </div>
            <div class="user-panel__stat-container">
              <p class="user-panel__stat">${userData.demons}</p>
              <span class="icon icon--lg icon--demon"></span>
            </div>
            <div class="user-panel__stat-container">
              <p class="user-panel__stat">${userData.cp}</p>
              <span class="icon icon--lg icon--cp"></span>
            </div>
          </div>
          <div class="user-panel__user-icons-container">
            <div class="user-panel__user-icons-wrapper">
              <img class="user-icon user-icon--cube" src="${baseUserIconURL}icon?form=cube&icon=${userData.icon}&${baseUserStyle}" alt="${userData.username}'s Cube">
              <img class="user-icon user-icon--ship" src="${baseUserIconURL}icon?form=ship&icon=${userData.ship}&${baseUserStyle}" alt="${userData.username}'s Ship">
              <img class="user-icon user-icon--ball" src="${baseUserIconURL}icon?form=ball&icon=${userData.ball}&${baseUserStyle}" alt="${userData.username}'s Ball">
              <img class="user-icon user-icon--ufo" src="${baseUserIconURL}icon?form=ufo&icon=${userData.ufo}&${baseUserStyle}" alt="${userData.username}'s UFO">
              <img class="user-icon user-icon--wave" src="${baseUserIconURL}icon?form=wave&icon=${userData.wave}&${baseUserStyle}" alt="${userData.username}'s Wave">
              <img class="user-icon user-icon--robot" src="${baseUserIconURL}icon?form=robot&icon=${userData.robot}&${baseUserStyle}" alt="${userData.username}'s Robot">
              <img class="user-icon user-icon--spider" src="${baseUserIconURL}icon?form=spider&icon=${userData.spider}&${baseUserStyle}" alt="${userData.username}'s Spider">
              <img class="user-icon user-icon--death-effect" src="https://gdbrowser.com/assets/deatheffects/${userData.deathEffect}.png" alt="${userData.username}'s Death Effect">
            </div>
          </div>
          <div class="user-panel__comments-container">
            <div class="user-panel__comments">${formattedUserComments}</div>
          </div>
          <div></div>
        </div>
        <aside class="user-panel__social-media-container">
          <a href="https://www.youtube.com/channel/${userData.youtube}" target="_blank" class="social-media social-media__youtube"></a>
          <a href="https://twitter.com/${userData.twitter}" target="_blank" class="social-media social-media__twitter"></a>
          <a href="https://www.twitch.tv/${userData.twitch}" target="_blank" class="social-media social-media__twitch"></a>
        </aside>
      `;
      modal.classList.add("modal__content--show");
    });
  });
}
modal.addEventListener("click", evt => {
  if(evt.target.classList.contains("modal__content--show")) {
    modal.classList.remove("modal__content--show");
  }
});
