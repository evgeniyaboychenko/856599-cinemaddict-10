export default class Movie {
  constructor(data) {
    this.id = data.id;
    const film_info = data.film_info;
    this.poster = film_info.poster;
    this.comments = data.comments;
    this.title = film_info.title;
    this.originalTitle = film_info.alternative_title;
    this.description = film_info.description;
    this.rating = film_info.total_rating;
    const user_details = data.user_details;
    this.userRating = user_details.personal_rating;
    this.director = film_info.director;
    this.writers = film_info.writers;
    this.actors = film_info.actors;
    this.releaseDate = film_info.release.date;
    this.runtime = film_info.runtime;
    this.country = film_info.release.release_country;
    this.genres = film_info.genre;
    this.ageLimit = film_info.age_rating;
    this.isWatchlist = user_details.watchlist;
    this.isHistory = user_details.already_watched;
    this.isFavorites = user_details.favorite;
    this.watchingDate = user_details.watching_date;
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
        'actors':this.actors,
        'release': {
          'date': this.releaseDate,
          'release_country': this.country
        },
        'runtime':this.runtime,
        'genre': this.genres,
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.userRating,
        'watchlist':this.isWatchlist,
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
