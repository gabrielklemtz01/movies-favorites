import { searchMovie } from "./searchmovie.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();

    // searchMovie.search("harry+potter").then((movie) => console.log(movie));
  }
  load() {
    this.entries = JSON.parse(localStorage.getItem("@movie-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@movie-favorites:", JSON.stringify(this.entries));
  }

  async add(moviename) {
    try {
      console.log(moviename);
      const movieExist = this.entries.find(
        (movieExist) =>
          movieExist.Title.toLowerCase() === moviename.toLowerCase()
      );
      if (movieExist) {
        throw new Error("Catalogo Já inserido");
      }
      const mdbMovie = await searchMovie.search(moviename);
      console.log(mdbMovie);
      if (mdbMovie.Title === undefined) {
        throw new Error("Filme não encontrado");
      }
      this.entries = [mdbMovie, ...this.entries];
      // console.log(this.entries);
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(movie) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.Title !== movie.Title
    );
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("tbody");
    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".btn-search");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      // acrescentando um + nos espaço do nome do filme!
      // const valueNew = value.replace(/\s/g, "+");

      this.add(value);
    };
  }

  update() {
    this.removeAlltr();

    this.entries.forEach((movie) => {
      const row = this.createRow();
      row.querySelector(".movie p").textContent = movie.Title;
      row.querySelector(".movie span").textContent = `(${movie.Year})`;
      row.querySelector(".director p").textContent = movie.Director;
      row.querySelector(".plot p").textContent = movie.Plot;
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?");
        if (isOk) {
          this.delete(movie);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="movie">
      <p>Guardians of the Galaxy Vol. 2</p>
      <span>2017</span>
    </div>
    </td>
      <td class="director">
      <p>James Gunn</p>
    </td>
    <td class="plot">
      <p>The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father, the ambitious celestial being Ego.</p>
    </td>
    <td><button class="remove">&times;</button></td></td>`;
    // retorno para cada elemento inserido na tabela
    return tr;
  }
  removeAlltr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
