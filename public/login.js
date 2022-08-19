const historyBtns = document.querySelectorAll(".history");
const table = document.getElementById("dashboard-table");
const dashboardInput = document.getElementById("dashboard-input");
let filter, tr, td, txtValue;

// go back to previous page
if (historyBtns !== null) {
  for (let i = 0; i < historyBtns.length; i++) {
    historyBtns[i].addEventListener("click", () => {
      history.back();
    });
  }
}

function handleTextArea() {
  $(".textarea")
    .each(function() {
      this.setAttribute(
        "style",
        "height:" + this.scrollHeight + "px;overflow-y:hidden;"
      );
    })
    .on("input", function() {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
}

handleTextArea();

// dashboard table filter

function tableSearch() {
  if (table !== null) {
    tr = table.getElementsByTagName("tr");
  }

  if (dashboardInput !== null) {
    dashboardInput.addEventListener("keyup", () => {
      filter = dashboardInput.value.toUpperCase();
      for (let i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    });
  }
}

tableSearch();


function readingTime() {
  let text = document.querySelector(".post-content");
  if (text !== null) {
    text = text.innerText;
    const wpm = 180;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    document.querySelector(".read-time span").innerText = time + " min read";
  }
}
readingTime();

function getDescription() {
  const descs = [...document.querySelectorAll(".post-desc")];
  for (let desc of descs) {
    let paragraphs = [...desc.getElementsByTagName("p")].slice(0, 2);
    let content = [];
    paragraphs.forEach(p => content.push(p.innerText));
    content = content.join(",");
    desc.innerText = content;
  }
}
getDescription()
