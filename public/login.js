const historyBtns = document.querySelectorAll(".history");


// go back to previous page
if (historyBtns !== null) {
    for (let i = 0; i < historyBtns.length; i++) {
      historyBtns[i].addEventListener("click", () => {
        history.back();
      });
    }
}