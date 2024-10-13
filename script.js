const API_KEY = "9f5d86ca8b09455ab05f1afc03fd372b"; // Your new API key
const url = "https://newsapi.org/v2/everything?q=";

// Automatically fetch news for "India" when the page loads
window.addEventListener("load", () => fetchNews("India"));

// Function to reload the default news
function reload() {
    fetchNews("India");
}

// Fetch news using the provided query
async function fetchNews(query) {
    try {
        // Construct the API request URL
        const fetchUrl = `${url}${encodeURIComponent(query)}&apiKey=${API_KEY}`;
        console.log("Fetching news from:", fetchUrl); // Log the URL

        const res = await fetch(fetchUrl);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        if (data.articles.length === 0) {
            alert("No news articles found for the given query.");
            return;
        }

        // Bind the fetched news data to the UI
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        alert("Failed to fetch news. Please try again later.");
    }
}

// Bind the fetched news articles to the HTML structure
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear previous news articles
    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        // Only add articles that contain an image, title, and description
        if (!article.urlToImage || !article.title || !article.description) return;

        // Clone the news card template
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);

        // Add the cloned card to the container
        cardsContainer.appendChild(cardClone);
    });
}

// Fill the cloned card with data from the article
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString();
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Add event listener to open the news article on click
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Handle navigation clicks for categories
let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
