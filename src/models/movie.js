export default class Movie {
  constructor(data) {
    this.id = data.id;
    const filmInfo = data.film_info;
    this.poster = filmInfo.poster;
    this.comments = data.comments;
    this.title = filmInfo.title;
    this.originalTitle = filmInfo.alternative_title;
    this.description = filmInfo.description;
    this.rating = filmInfo.total_rating;
    const userDetails = data.user_details;
    this.userRating = userDetails.personal_rating;
    this.director = filmInfo.director;
    this.writers = filmInfo.writers;
    this.actors = filmInfo.actors;
    this.releaseDate = filmInfo.release.date;
    this.runtime = filmInfo.runtime;
    this.country = filmInfo.release.release_country;
    this.genres = filmInfo.genre;
    this.ageLimit = filmInfo.age_rating;
    this.isWatchlist = userDetails.watchlist;
    this.isHistory = userDetails.already_watched;
    this.isFavorites = userDetails.favorite;
    this.watchingDate = userDetails.watching_date;
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.title,
        'alternative_title': this.originalTitle,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.ageLimit,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': this.releaseDate,
          'release_country': this.country
        },
        'runtime': this.runtime,
        'genre': this.genres,
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.userRating,
        'watchlist': this.isWatchlist,
        'already_watched': this.isHistory,
        'watching_date': this.watchingDate,
        'favorite': this.isFavorites
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.toRAW());
  }
}
