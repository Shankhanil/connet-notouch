exports.today = function today() {
  const d = new Date();
  //        el_up.innerHTML = today;
  let dd = d.getDate();
  let mm = d.getMonth() + 1;

  const yyyy = d.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  const DATE = `${dd}/${mm}/${yyyy}`;
  return DATE;
};
