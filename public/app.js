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

let searchbar = document.getElementById("uk-search-input");
let listCache = [...document.getElementById("list").children];

searchbar.addEventListener("input", (evt) => {
  debounce(
    0,
    (params) => {
      return () => {
        params.new = document.getElementById("uk-search-input").value;
        console.log(params.old, params.new);
        if (params.new != params.old) {
          console.log("not filtering list bc input has changed since");
          return;
        } else {
          let list = document.getElementById("list");
          let filtered = listCache.filter(
            (e) =>
              e.innerText.toLowerCase().indexOf(params.old.toLowerCase()) != -1
          );
          list.replaceChildren();
          filtered.forEach((child) => {
            list.appendChild(child);
          });
        }
      };
    },
    { old: evt.target.value }
  );
});

function debounce(ms, cb, params) {
  setTimeout(cb(params), ms);
}
