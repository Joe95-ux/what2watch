const historyBtns = document.querySelectorAll(".history");


// go back to previous page
if (historyBtns !== null) {
    for (let i = 0; i < historyBtns.length; i++) {
      historyBtns[i].addEventListener("click", () => {
        history.back();
      });
    }
}

function handleTextArea(){
  $("textarea").each(function () {
    this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
  }).on("input", function () {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
  });
}

handleTextArea();