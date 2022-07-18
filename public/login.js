const historyBtns = document.querySelectorAll(".history");
const table = document.getElementById("dashboard-table");
const dashboardInput = document.getElementById("dashboard-input");

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
  let filter, tr, td, txtValue;
  tr = table.getElementsByTagName("tr");

  dashboardInput.addEventListener("keyup", () => {
    filter = dashboardInput.value.toUpperCase();
    for (let i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
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

tableSearch();
