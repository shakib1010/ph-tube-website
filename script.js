// what do i need to do?

// Fetch all the category information from the api.
// Display it on the category section.
// By default make the All category active and render all cards.
// If clicked on any category tab then render that category cards.

const ui = {
  tabList: document.getElementById('tab-list'),
  cardContainer: document.getElementById('card-container'),
  activeCategory: null,
  formatTime(d) {
    d = Number(d)
    var h = Math.floor(d / 3600)
    var m = Math.floor((d % 3600) / 60)
    var s = Math.floor((d % 3600) % 60)

    var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
    var mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : ''
    var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
    return hDisplay + mDisplay
  },
  clearTab() {
    this.tabList.innerHTML = ''
  },
  clearCard() {
    this.cardContainer.innerHTML = ''
  },
  renderTab(tab) {
    // <a role="tab" class="tab tab-active">Tab 2</a>
    const a = document.createElement('a')
    a.setAttribute('role', 'tab')
    a.classList.add('tab')
    a.setAttribute('data-id', tab.category_id)
    a.innerText = tab.category
    this.tabList.appendChild(a)
  },
  activeTab(id) {
    this.activeCategory = id
    this.tabList.querySelectorAll('a').forEach((element) => {
      element.classList.remove('tab-active')
      if (element.getAttribute('data-id') == id)
        element.classList.add('tab-active')
    })
  },
  renderCard(data) {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
    <figure class="rounded-xl relative">
            <img
              src=${data.thumbnail}
              alt="Shoes"
            />
            <div
              class="bg-slate-600 bg-opacity-75 rounded-lg py-1 px-2 absolute bottom-2 right-2 text-white text-sm"
            >
              ${this.formatTime(data.others.posted_date)} ago
            </div>
          </figure>
          <div class="card-body flex-row gap-4 py-4 px-0">
            <div
              class="size-10 rounded-full overflow-hidden flex items-center justify-center relative"
            >
              <img src="${data.authors[0].profile_picture}" alt="" />
            </div>
            <div>
              <h2 class="card-title mb-2 leading-none">${data.title}</h2>
              <p class="flex gap-2 items-center mb-2">
                ${data.authors[0].profile_name}
                <span>${
                  data.authors[0].verified
                    ? '<img src="verified-badge.svg" alt="" />'
                    : ''
                }</span>
              </p>
              <p class="text-xs font-bold"><span>${
                data.others.views
              }</span> Views</p>
            </div>
          </div>
    `
    ui.cardContainer.appendChild(div)
  },
  sortView() {
    // How you are going to sort the ui based on view.
  },
}

async function getCategory() {
  const res = await fetch(
    'https://openapi.programming-hero.com/api/videos/categories'
  )
  const data = await res.json()
  ui.clearTab()
  data.data.forEach((category) => {
    ui.renderTab(category)
    if (category.category_id === '1000') {
      ui.activeTab(category.category_id)
      getCards(category.category_id)
    }
  })
  handleCategoryClick()
}

async function getCards(id) {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${id}`
  )
  const data = await res.json()
  console.log(data.data)
  ui.clearCard()
  data.data.forEach((card) => ui.renderCard(card))
}

function handleCategoryClick() {
  ui.tabList.querySelectorAll('a').forEach((el) => {
    el.addEventListener('click', (e) => {
      const attr = e.target.getAttribute('data-id')
      ui.activeTab(attr)
      getCards(attr)
    })
  })
}

;(function () {
  getCategory()
})()
