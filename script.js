// Titles:  https://omdbapi.com/?s=thor&page=1&apikey=26f8258f
// Details:  https://www.omdbapi.com/?i=tt3896198&apikey=26f8258f

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

// Load Movies From API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=26f8258f`;
  const res = await fetch(URL);
  const data = await res.json();
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") {
      moviePoster = movies[idx].Poster;
    } else moviePoster = "/image/image_not_found.png";

    movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
              <img src="${moviePoster}" alt="">
            </div>
            <div class="search-item-info">
              <h3>${movies[idx].Title}</h3>
              <p>${movies[idx].Year}</p>
            </div>
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=26f8258f`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
     <div class="movie-poster">
            <img src="${
              details.Poster != "N/A"
                ? details.Poster
                : "/image/image_not_found.png"
            }" alt="">
          </div>
          <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
              <li class="year">Year: ${details.Year}</li>
              <li class="rated">Rated: ${details.Rated}</li>
              <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Write:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="languange"><b>Languange:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${
              details.Awards
            }</p>
      </div>
  `;
}
