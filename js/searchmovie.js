export class searchMovie {
  static search(moviename) {
    const endpoint = `https://www.omdbapi.com/?t=${moviename.replace(
      /\s/g,
      "+"
    )}&apikey=1520a166`;
    return fetch(endpoint)
      .then((data) => data.json())
      .then(({ Title, Year, Director, Plot }) => ({
        Title,
        Year,
        Director,
        Plot,
      }));
  }
}
