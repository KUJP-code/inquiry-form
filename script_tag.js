const inquiryForm = document.getElementById("formContactUs");
const originalForm = inquiryForm.innerHTML;
const LABEL_TRANSLATIONS = {
  school_id: "お問い合わせ先",
  parent_name: " 保護者のお名前",
  phone: "電話番号",
  email: "Email",
  child_name: "お子様のお名前",
  child_birthday: "お子様の生年月日",
  kindy: "保育園・幼稚園名と在園状況 ",
  ele_school: "小学校名と在学状況 ",
  requests: "本文",
};

inquiryForm.addEventListener("submit", function showSummary(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const inquiryObject = Object.fromEntries(data);
  inquiryForm.removeEventListener("submit", showSummary);
  createSummary(inquiryObject);
});

function createSummary(inquiry) {
  inquiryForm.innerHTML = "";
  inquiryForm.append(...createSummaryHeadings());
  Object.entries(inquiry)
    .filter((pair) => pair[0] !== "category")
    .forEach((pair) => {
      inquiryForm.appendChild(createSummaryField(pair));
    });
  inquiryForm.appendChild(createButtonContainer(inquiry));
  addSummaryStyles();
  window.location.replace("#pagetop", "");
}

function createSummaryHeadings() {
  const heading = document.createElement("h2");
  heading.innerText = "お問い合わせ内容の確認";
  heading.style.width = "100%";

  const message = document.createElement("p");
  message.classList.add("kids-sub");
  message.innerText = "お問い合わせ内容をご確認下さい。";
  message.style.width = "100%";

  return [heading, message];
}

function createSummaryField(pair) {
  const fieldContainer = document.createElement("div");

  const label = document.createElement("label");
  label.innerText = LABEL_TRANSLATIONS[pair[0]];

  const value = document.createElement("p");
  value.innerText = pair[1];

  fieldContainer.append(label, value);
  fieldContainer.style.width = "20%";
  return fieldContainer;
}

function createButtonContainer(inquiry) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.width = "100%";
  container.appendChild(createBackButton(inquiry));
  container.appendChild(createSubmitButton(inquiry));
  return container;
}

function createBackButton(inquiry) {
  const button = document.createElement("button");
  button.id = "btnBack";
  button.type = "submit";
  button.innerText = "戻る";
  button.classList.add("btn", "btn-info", "btn-md");
  button.addEventListener("click", function showForm(e) {
    e.preventDefault();
    inquiryForm.innerHTML = originalForm;
    Object.entries(inquiry).forEach((pair) => {
      const input = document.getElementById(pair[0]);
      if (input.type === "select") {
        const optGroups = input.children;
        [...optGroups].forEach((group) => {
          const selected = group.find((o) => o.value === pair[1]);
          if (selected) selected.selected = pair[1];
        });
      } else {
        input.value = pair[1];
      }
    });
  });
  return button;
}

function createSubmitButton(inquiry) {
  const button = document.createElement("button");
  button.id = "btnContactUs";
  button.type = "submit";
  button.innerText = "送信する";
  button.classList.add("btn", "btn-primary", "btn-md");
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    response = await sendInquiry(inquiry);
    if (response.status === 200) {
      document.location = "https://kids-up.jp/inquiry/complete/";
    } else {
      inquiryForm.innerHTML = "";
      inquiryForm.appendChild(createErrorMessage());
    }
  });
  return button;
}

function createErrorMessage() {
  const message = document.createElement("h1");
  message.innerText = "お問い合わせは送信できませんでした。";
  return message;
}

function addSummaryStyles() {
  inquiryForm.style.display = "flex";
  inquiryForm.style.flexDirection = "row";
  inquiryForm.style.flexWrap = "wrap";
  inquiryForm.style.justifyContent = "center";
  inquiryForm.style.alignItems = "center";
  inquiryForm.style.gap = "0.5rem";
}

async function sendInquiry(inquiry) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const response = await fetch("https://kids-up.app/create_inquiry.json", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ inquiry: inquiry }),
  });
  return response;
}
