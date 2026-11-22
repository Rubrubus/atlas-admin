const cardPresets = [
  {
    "name": "Директор Участка-07",
    "author": "Hovers",
    "cardType": "KeycardCustomMetalCase",
    "keycardName": "Ключ-Карта_Директора",
    "department": "ADMINISTATIVE_DEPARTAMENT",
    "position": "Директор Участка-07",
    "color": "#960030",
    "containment": 3,
    "armory": 3,
    "admin": 3
  },
  {
    "name": "Инженер",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_Инженера",
    "department": "ENGINERING_&_TECHICAL_DEPARTAMENT",
    "position": "Инженер",
    "color": "#00ad76",
    "containment": 3,
    "armory": 0,
    "admin": 1
  },
  {
    "name": "Инженер Камер Содержаний",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_Инженера_К.С",
    "department": "ENGINERING_&_TECHICAL_DEPARTAMENT",
    "position": "Инженер Камер Содержаний",
    "color": "#00ad76",
    "containment": 3,
    "armory": 0,
    "admin": 1
  },
  {
    "name": "Научный Сотрудник",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_Научного-Сотрудника",
    "department": "SCIENTIFIC_DEPARTAMENT",
    "position": "Научный-Сотрудник",
    "color": "#ffcd42",
    "containment": 2,
    "armory": 0,
    "admin": 1
  },
  {
    "name": "Старший Научный Сотрудник",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_Ст._Научного-Сотрудника",
    "department": "SCIENTIFIC_DEPARTAMENT",
    "position": "Старший_Научный-Сотрудник",
    "color": "#ffcd42",
    "containment": 3,
    "armory": 0,
    "admin": 1
  },
  {
    "name": "Куратор SCP-000",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_Куратора",
    "department": "SCIENTIFIC_DEPARTAMENT",
    "position": "Куратор_SCP-000",
    "color": "#ffcd42",
    "containment": 3,
    "armory": 2,
    "admin": 1
  },
  {
    "name": "Руководитель",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_Руководителя",
    "department": "SCIENTIFIC_DEPARTAMENT",
    "position": "Руководитель",
    "color": "#960030",
    "containment": 3,
    "armory": 1,
    "admin": 3
  },
  {
    "name": "Штатный Логист",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_Штатного-Логиста",
    "department": "LOGISTICS_DEPARTAMENT",
    "position": "Штатный_Логист",
    "color": "#0048ad",
    "containment": 1,
    "armory": 0,
    "admin": 0
  },
  {
    "name": "Логист",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_Логиста",
    "department": "LOGISTICS_DEPARTAMENT",
    "position": "Логист",
    "color": "#0048ad",
    "containment": 1,
    "armory": 0,
    "admin": 0
  },
  {
    "name": "Грузчик",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_Грузчик",
    "department": "LOGISTICS_DEPARTAMENT",
    "position": "Грузчик",
    "color": "#0048ad",
    "containment": 1,
    "armory": 0,
    "admin": 0
  },
  {
    "name": "IT-Специалист",
    "author": "Hovers",
    "cardType": "KeycardCustomSite02",
    "keycardName": "Ключ-Карта_IT-Специалист",
    "department": "ENGINERING_&_TECHICAL_DEPARTAMENT",
    "position": "IT-Специалист",
    "color": "#00ad76",
    "containment": 2,
    "armory": 0,
    "admin": 1
  }
];

// Поля карты и уровни доступа.
const cardId = document.getElementById('cardId');
const keycardName = document.getElementById('keycardName');
const department = document.getElementById('department');
const position = document.getElementById('position');
const cardType = document.getElementById('cardType');
const cardColor = document.getElementById('cardColor');
const containmentLevel = document.getElementById('containmentLevel');
const armoryLevel = document.getElementById('armoryLevel');
const adminLevel = document.getElementById('adminLevel');
const keycardPreview = document.getElementById('keycardPreview');
const result = document.getElementById('result');
const copyButton = document.getElementById('copyBtn');
const presetsContainer = document.getElementById('presetsContainer');

function validateLevel(input) {
  let value = parseInt(input.value, 10);
  if (isNaN(value) || value < 0) {
    value = 0;
  }
  if (value > 3) {
    value = 3;
  }
  input.value = value;
}

function changeLevel(input, amount) {
  validateLevel(input);
  input.value = Number(input.value) + amount;
  updateCard();
}

function updateCard() {
  validateLevel(containmentLevel);
  validateLevel(armoryLevel);
  validateLevel(adminLevel);
  document.getElementById('previewCardId').textContent = cardId.value || '0';
  document.getElementById('previewDepartment').textContent = department.value || 'LOGISTIC DEPARTMENT';
  document.getElementById('previewPosition').textContent = position.value || 'Должность';
  document.getElementById('previewCardType').textContent = cardType.options[cardType.selectedIndex].text;
  document.getElementById('previewContainmentLevel').textContent = containmentLevel.value;
  document.getElementById('previewArmoryLevel').textContent = armoryLevel.value;
  document.getElementById('previewAdminLevel').textContent = adminLevel.value;
  document.getElementById('previewColorSwatch').style.background = cardColor.value;
  document.getElementById('colorHex').textContent = cardColor.value;
  keycardPreview.style.setProperty('--card-accent', cardColor.value);

  const name = keycardName.value.replace(/ /g, '_');
  const cardDepartment = department.value.replace(/ /g, '_');
  const cardPosition = position.value.replace(/ /g, '_');
  result.value = `ckrp add ${cardType.value} ${containmentLevel.value} ${adminLevel.value} ${armoryLevel.value} ${cardDepartment} ${cardPosition} ${cardColor.value} ${name} ${cardId.value}`;
}

function applyCardPreset(preset) {
  cardType.value = preset.cardType;
  keycardName.value = preset.keycardName.replace(/_/g, ' ');
  department.value = preset.department;
  position.value = preset.position.replace(/_/g, ' ');
  cardColor.value = preset.color;
  containmentLevel.value = preset.containment;
  armoryLevel.value = preset.armory;
  adminLevel.value = preset.admin;

  let author = document.querySelector('.keycard-author');
  if (!author) {
    author = document.createElement('div');
    author.className = 'keycard-author';
    keycardPreview.appendChild(author);
  }
  author.textContent = 'Шаблон: ' + preset.author;
  updateCard();
}

function showCardPresets() {
  presetsContainer.replaceChildren();
  for (const preset of cardPresets) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'preset-item';

    const name = document.createElement('div');
    name.className = 'preset-name';
    name.textContent = preset.name;
    const details = document.createElement('div');
    details.className = 'preset-details';
    details.textContent = `Уровни: Содержание ${preset.containment} | Оружейная ${preset.armory} | Админ ${preset.admin}`;
    const author = document.createElement('div');
    author.className = 'preset-author';
    author.textContent = 'Автор: ' + preset.author;

    button.appendChild(name);
    button.appendChild(details);
    button.appendChild(author);
    button.addEventListener('click', function () {
      applyCardPreset(preset);
    });
    presetsContainer.appendChild(button);
  }
}

async function copyCardCommand() {
  let copied = false;
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(result.value);
      copied = true;
    } catch {
      // В старых браузерах используем выделение текста.
    }
  }
  if (!copied) {
    result.focus();
    result.select();
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
  }
  if (copied) {
    copyButton.textContent = 'Скопировано!';
  } else {
    copyButton.textContent = 'Нажмите Ctrl+C';
  }
  setTimeout(function () {
    copyButton.textContent = 'Копировать команду';
  }, 2000);
}

// Обработчики формы.
const cardInputs = document.querySelectorAll('input, select');
for (const input of cardInputs) {
  input.addEventListener('input', updateCard);
  input.addEventListener('change', updateCard);
}
document.getElementById('plusContainment').addEventListener('click', function () {
  changeLevel(containmentLevel, 1);
});
document.getElementById('minusContainment').addEventListener('click', function () {
  changeLevel(containmentLevel, -1);
});
document.getElementById('plusArmory').addEventListener('click', function () {
  changeLevel(armoryLevel, 1);
});
document.getElementById('minusArmory').addEventListener('click', function () {
  changeLevel(armoryLevel, -1);
});
document.getElementById('plusAdmin').addEventListener('click', function () {
  changeLevel(adminLevel, 1);
});
document.getElementById('minusAdmin').addEventListener('click', function () {
  changeLevel(adminLevel, -1);
});
document.getElementById('generateBtn').addEventListener('click', updateCard);
copyButton.addEventListener('click', copyCardCommand);

showCardPresets();
updateCard();
