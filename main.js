const DRAWN_GROUPS_KEY = "DRAWN_GROUPS";
const REMAINING_GROUPS_KEY = "REMAINING_GROUPS";

const start = () => {
  const groupCountMin = document.getElementById("groupCountMin");
  const groupCountMax = document.getElementById("groupCountMax");
  const card = document.querySelector(".card");
  const currentGroup = document.getElementById("currentGroup");
  const remainGroups = document.getElementById("remainGroups");

  const enqueue = document.getElementById("enqueue");
  const reset = document.getElementById("reset");
  const draw = document.getElementById("draw");

  const history = document.getElementById("history");

  let drawn = JSON.parse(localStorage.getItem(DRAWN_GROUPS_KEY)) || [];
  let remaining = JSON.parse(localStorage.getItem(REMAINING_GROUPS_KEY)) || [];

  const [storageMin] = [...drawn, ...remaining].sort();
  // @ts-expect-error
  groupCountMin.value = storageMin || 0;
  // @ts-expect-error
  groupCountMax.value = drawn.length + remaining.length + storageMin - 1 || 0;
  remainGroups.innerHTML = remaining.length;

  enqueue.addEventListener("click", () => {
    // @ts-expect-error
    const minCount = parseInt(groupCountMin.value);
    // @ts-expect-error
    const maxCount = parseInt(groupCountMax.value);

    if (drawn.length === 0 && remaining.length === 0) {
      console.log("Test");
      remaining = [];
      for (let i = minCount; i <= maxCount; i++) remaining.push(i);
      remainGroups.innerHTML = remaining.length;
    }

    if (minCount > 0 && maxCount > 0 && minCount <= maxCount) {
      enqueue.setAttribute("disabled", "disabled");
      reset.removeAttribute("disabled");
      card.removeAttribute("hidden");
      groupCountMin.setAttribute("disabled", "disabled");
      groupCountMax.setAttribute("disabled", "disabled");
      draw.removeAttribute("disabled");
    }
  });

  reset.addEventListener("click", () => {
    // @ts-expect-error
    groupCountMin.value = "0";
    // @ts-expect-error
    groupCountMax.value = "0";

    enqueue.removeAttribute("disabled");
    reset.setAttribute("disabled", "disabled");
    card.setAttribute("hidden", "hidden");
    groupCountMin.removeAttribute("disabled");
    groupCountMax.removeAttribute("disabled");
    localStorage.removeItem(DRAWN_GROUPS_KEY);
    localStorage.removeItem(REMAINING_GROUPS_KEY);

    remaining = [];
    drawn = [];

    currentGroup.innerHTML = "";
    remainGroups.innerHTML = "";
    history.innerHTML = "";
  });

  draw.addEventListener("click", () => {
    remaining = remaining.sort(() => Math.random() - 0.5);
    const current = remaining.pop();
    drawn.push(current);

    currentGroup.innerHTML = current;
    remainGroups.innerHTML = remaining.length;

    localStorage.setItem(DRAWN_GROUPS_KEY, JSON.stringify(drawn));
    localStorage.setItem(REMAINING_GROUPS_KEY, JSON.stringify(remaining));

    history.innerHTML = drawn.map((g) => `<li>${g}</li>`).join("\n");
    history.scrollTop = history.scrollHeight;
    if (remaining.length === 0) {
      draw.setAttribute("disabled", "disabled");
    }
  });

  // manage reload
  if (remaining.length > 0 || drawn.length > 0) {
    enqueue.click();
    history.innerHTML = drawn.map((g) => `<li>${g}</li>`).join("\n");
    history.scrollTop = history.scrollHeight;
  }
  if (remaining.length === 0) draw.setAttribute("disabled", "disabled");
};

window.addEventListener("load", start);
