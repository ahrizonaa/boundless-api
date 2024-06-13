import { debounce, filterList } from "./assets/scripts/core.js";

document.getElementById("heading").addEventListener("animationend", (evt) => {
  if (evt.animationName == "slide-in-blurred-bl") {
    let typewriter = document.getElementById("typewriter");
    typewriter.addEventListener("animationend", (evt) => {
      if (evt.animationName == "animated-text") {
        document.getElementById("emoji").classList.add("jello-vertical");
      }
    });
    typewriter.classList.add("typewriter");

    document.getElementById("list-content").classList.add("fade-in-bck");
  }
});

let listCache = [...document.getElementById("list").children];

document.getElementById("uk-search-input").addEventListener("input", (evt) => {
  let params = {
    old: evt.target.value,
    cache: listCache,
    inputid: "uk-search-input",
    listid: "list",
  };

  debounce(200, filterList, params);
});
