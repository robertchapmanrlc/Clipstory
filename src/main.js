
const { invoke } = window.__TAURI__.tauri;

let clipboardHistory = [];
let filteredHistory = [];
let selectedIndex = null;
document
  .getElementById("search-bar")
  .addEventListener("input", filterClipboardHistory);

document
  .getElementById("copy-button")
  .addEventListener("click", copyToSystemClipboard);

async function fetchClipboardHistory() {
  const newHistory = await window.__TAURI__.invoke("get_clipboard_history");

  if (JSON.stringify(newHistory) !== JSON.stringify(clipboardHistory)) {
    clipboardHistory = newHistory;
    filterClipboardHistory();
  }
}

function updateClipboardHistoryUI(history) {
  const historyElement = document.getElementById("clipboard-history");

  historyElement.innerHTML = "";
  history.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("line");

    const p = document.createElement("p");
    div.appendChild(p);

    let img = document.createElement("img");
    img.src = "assets/x.svg";
    img.alt = "Delete Button";
    img.onclick = () => deleteItem(item);
    div.appendChild(img);

    p.classList.add("item");
    p.innerText = item;

    if (index === selectedIndex) {
      div.classList.add("selected");
    }

    p.onclick = () => {
      showPreview(item);
      highlightSelectedItem(index);
    };
    historyElement.appendChild(div);
  });
}

function showPreview(content) {
  let previewElement = document.getElementById("current-clip");
  previewElement.textContent = content;
}

async function deleteItem(content) {
  let previewElement = document.getElementById("current-clip");
  if (content == previewElement.textContent) {
    previewElement.textContent = "";
  }

  await invoke("delete_item", { item: content });
}

async function copyToSystemClipboard() {
  const previewElementContent =
    document.getElementById("current-clip").textContent;
  if (previewElementContent !== "") {
    await invoke("copy_to_system", { content: previewElementContent });
  }
}

function highlightSelectedItem(index) {
  selectedIndex = index;
  updateClipboardHistoryUI(filteredHistory);
}

function filterClipboardHistory() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  filteredHistory = clipboardHistory.filter((item) =>
    item.toLowerCase().includes(searchTerm)
  );
  const previewElement = document.getElementById("current-clip");
  filteredHistory.forEach((line, index) => {
    if (line == previewElement.textContent) {
      selectedIndex = index;
    }
  });
  updateClipboardHistoryUI(filteredHistory);
}

setInterval(fetchClipboardHistory, 1000);

filteredHistory = clipboardHistory;
