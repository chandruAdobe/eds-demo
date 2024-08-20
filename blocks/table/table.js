/* eslint-disable no-const-assign */
/* eslint-disable quotes */
const resultsPerPage = 20;
async function createTableHeader(table) {
  const tr = document.createElement('tr');
  const sno = document.createElement('th');
  sno.appendChild(document.createTextNode('SNO'));
  const text = document.createElement('th');
  text.appendChild(document.createTextNode('Text'));
  tr.append(sno);
  tr.append(text);
  table.append(tr);
}
async function createTableRow(table, row) {
  const tr = document.createElement('tr');
  const sno = document.createElement('td');
  sno.appendChild(document.createTextNode(row.ID));
  const text = document.createElement('td');
  text.appendChild(document.createTextNode(row.Text));
  tr.append(sno);
  tr.append(text);
  table.append(tr);
}

async function createTable(jsonURL, val, nxtButton, offset) {
  let pathname = null;
  if (val) {
    pathname = jsonURL;
  } else {
    pathname = new URL(jsonURL);
  }

  const resp = await fetch(pathname);
  const json = await resp.json();

  const table = document.createElement("table");
  createTableHeader(table);
  json.data.forEach((row) => {
    createTableRow(table, row);
  });
  if (nxtButton) {
    nxtButton.disabled = parseInt(json.total, 10) <= offset;
  }
  return table;
}

async function createPagination(parentDiv, dummies) {
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "action-buttons";
  const prevButton = document.createElement("button");
  prevButton.className = "previous-btn";
  prevButton.textContent = "Prev";
  const nxtButton = document.createElement("button");
  nxtButton.className = "next-btn";
  nxtButton.textContent = "Next";
  buttonWrapper.append(prevButton);
  buttonWrapper.append(nxtButton);
  /* Previous button action */
  prevButton.addEventListener("click", async () => {
    document.getElementById("loader-action").style.display = "flex";
    const pageNumber = parseInt(sessionStorage.getItem("page"), 10);
    const offset = pageNumber - resultsPerPage;
    const pageResults = await createTable(
      `${dummies.href}?offset=${offset}&limit=${resultsPerPage}&guessTotal=true`,
      null,
      nxtButton,
      offset - resultsPerPage,
    );
    parentDiv.innerHTML = "";
    parentDiv.append(pageResults);
    parentDiv.prepend(buttonWrapper);
    sessionStorage.setItem("page", offset);
    document.getElementById("loader-action").style.display = "none";
    prevButton.disabled = parseInt(sessionStorage.getItem("page"), 10) === 0;
  });
  /* Next button action */
  nxtButton.addEventListener("click", async () => {
    document.getElementById("loader-action").style.display = "flex";
    const pageNumber = parseInt(sessionStorage.getItem("page"), 10);
    const offset = pageNumber + resultsPerPage;
    const pageResults = await createTable(
      `${dummies.href}?offset=${offset}&limit=${resultsPerPage}&guessTotal=true`,
      null,
      nxtButton,
      offset + resultsPerPage,
    );
    parentDiv.innerHTML = "";
    parentDiv.append(pageResults);
    parentDiv.prepend(buttonWrapper);
    sessionStorage.setItem("page", offset);
    document.getElementById("loader-action").style.display = "none";
    prevButton.disabled = parseInt(sessionStorage.getItem("page"), 10) === 0;
  });
  prevButton.disabled = (parseInt(sessionStorage.getItem("page"), 10) === 0);
  return buttonWrapper;
}

export default async function decorate(block) {
  const dummies = block.querySelector("a[href$='.json']");
  const parentDiv = document.createElement('div');
  parentDiv.classList.add('dummies-block');

  if (dummies) {
    sessionStorage.setItem('page', 0);
    // parentDiv.append(await createPagination(createPagination));
    // eslint-disable-next-line prefer-template
    parentDiv.append(
      await createTable(
        `${dummies.href}?offset=0&limit=20&guessTotal=true`,
        null,
      ),
    );
    dummies.replaceWith(parentDiv);
  }
  // eslint-disable-next-line prefer-template
  parentDiv.prepend(await createPagination(parentDiv, dummies));
  const loaderDiv = document.createElement('div');
  loaderDiv.className = "loader-wrapper";
  loaderDiv.id = "loader-action";
  const loader = document.createElement('div');
  loader.className = 'loader';
  loaderDiv.append(loader);
  block.append(loaderDiv);
}
