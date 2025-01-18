let userList = document.getElementById("userList");
let userDetails = document.getElementById("userDetails");
let searchInput = document.getElementById("search");
let searchButton = document.querySelector(".search-btn");
let pagination = document.getElementById("pagination");
let prevButton = document.getElementById("prev");
let nextButton = document.getElementById("next");
let currentPageSpan = document.getElementById("currentPage");

let currentPage = 1;
let totalUsers = 0;

async function fetchUsers(query, page = 1) {
  let perPage = 30;
  let url = `https://api.github.com/search/users?q=${query}&per_page=${perPage}&page=${page}`;
  let response = await fetch(url);
  let data = await response.json();
  totalUsers = data.total_count;
  return data.items;
}

function renderUsers(users) {
  userList.innerHTML = users
    .map(
      (user) => `
      <div class="user-card" onclick="showUserDetails('${user.login}')">
        <img src="${user.avatar_url}" alt="${user.login}" />
        <div>
          <h2>${user.login}</h2>
          <p>ID: ${user.id}</p>
          <a class = "view-profile" href = "${user.html_url}">View Profile</a>
        </div>
      </div>
    `
    )
    .join("");
}
//
function updatePagination() {
  currentPageSpan.textContent = currentPage;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = totalUsers / 10 <= currentPage;
}

async function handleSearch() {
  let query = searchInput.value.trim();
  if (!query) return;
  let users = await fetchUsers(query, currentPage);
  renderUsers(users);
  updatePagination();
}

searchButton.addEventListener("click", () => {
  currentPage = 1;
  handleSearch();
});

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    handleSearch();
  }
});

nextButton.addEventListener("click", () => {
  currentPage++;
  handleSearch();
});
