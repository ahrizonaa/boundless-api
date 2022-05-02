export function debounce(ms, cb, params) {
  let f = (params) => {
    return () => {
      params.new = document.getElementById(params.inputid).value;
      if (params.new != params.old) {
        return;
      } else {
        cb(params);
      }
    };
  };

  setTimeout(f(params), ms);
}

export function filterList(params) {
  let list = document.getElementById(params.listid);
  let filtered = params.cache.filter(
    (e) => e.innerText.toLowerCase().indexOf(params.old.toLowerCase()) != -1
  );
  list.replaceChildren();
  filtered.forEach((child) => {
    list.appendChild(child);
  });
}
