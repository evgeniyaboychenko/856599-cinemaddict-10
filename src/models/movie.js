export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.poster = data[`film_info.poster`];
    this.comments = data[`comments`];
    this.title = data[`film_info.title`];
    this.originalTitle = data[`film_info.alternative_title`];
    this.description = data[`film_info.description`];
    this.rating = data[`film_info.total_rating`];
    this.userRating = data[`user_details.personal_rating`];
    this.director = data[`film_info.director`];
    this.writers = data[`film_info.writers`];
    this.actors = data[`film_info.actors`];
    this.releaseDate = data[`film_info.release.date`];
    this.runtime = data[`film_info.runtime`];
    this.country = data[`film_info.release.release_country`];
    this.genres = data[`film_info.genre`];
    this.ageLimit = data[`film_info.age_rating`];
    this.isWatchlist = data[`user_details.watchlist`];
    this.isHistory = data[`user_details.already_watched`];
    this.isFavorites = data[`user_details.favorite`];
    this.watchingDate = data[`film_info.watching_date`];
  }

  toRAW() {
    return {
    'id': this.id,
    'posters': this.poster,
    'title': this.title,
    'originalTitle': this.description,
    'description': this.originalTitle,
    'rating': this.rating,
    'userRating': this.userRating,
    'director': this.director,
    'writers': this.writers,
    'actors': this.actors,
    'releaseDate': this.releaseDate,
    'runtime': this.runtime,
    'country': this.country,
    'genres':  this.genres,
    'ageLimit': this.ageLimit,
    'isWatchlist': this.isWatchlist,
    'isHistory': this.isHistory,
    'isFavorites': this.isFavorites,
    'watchingDate': this.watchingDate,
      // 'id': this.id,
      // 'description': this.description,
      // 'due_date': this.dueDate ? this.dueDate.toISOString() : null,
      // 'tags': Array.from(this.tags),
      // 'repeating_days': this.repeatingDays,
      // 'color': this.color,
      // 'is_favorite': this.isFavorite,
      // 'is_archived': this.isArchive,
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
