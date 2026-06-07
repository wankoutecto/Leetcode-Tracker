chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "GET_PROBLEM_DATA") {
      sendResponse(getProblemData());
  }
});



function getProblemData(){
    const title = getTitle();
    const solution = getSolution();
    const url = window.location.href;
    const difficulty = getDifficultyLevel();
    const slug = window.location.pathname.split("/")[2];
    const topics = getTopics();
    const description = getCleanDescription();
    const createdAt = new Date().toISOString().split("T")[0];

    return {
      title,
      solution,
      slug,
      url,
      difficulty,
      topics,
      description,
      createdAt
    };
}

function getSolution() {
  const editor = document.querySelector(".monaco-editor .view-lines");

  if (!editor) return null;

  return [...editor.querySelectorAll(".view-line")]
  .map(line => line.textContent || "")
  .join("\n");
}

function getTitle(){
  const links = document.querySelectorAll('a[href^="/problems/"]');
  let title = "";
  for (let el of links) {
    const text = el?.textContent?.trim();

    if (/^\d+\.\s+/.test(text)) {
      title = text;
      break;
    }
  }
  return title;
}
function getDifficultyLevel(){
  return [...document.querySelectorAll('div')].find(el => ['Easy', 'Medium', 'Hard'].includes(el.innerText.trim()))
  .innerText.trim();
}

function getCleanDescription() {
  const container = document.querySelector('[data-track-load="description_content"]');

  if (!container) return "";

  const elements = container.querySelectorAll('p');

  let text = "";

  for (let el of elements) {
    const t = el.innerText.trim();

    if (t.startsWith("Example") || t.startsWith("Constraints")) break;

    text += t + "\n\n ";
  }
  return text.trim();
}

function getTopics(){
  return [...document.querySelectorAll('a[href*="/tag/"]')]
  .map(t => t.innerText.trim())
  .filter(Boolean);
}
