// Пресеты из конфигурации плагина.
const presets = [
  {
    "Name": "Эвакуация",
    "Title": "ЭВАКУАЦИЯ",
    "Content": "<size=0.9>ЧС ОКОНЧЕНО<br>ПРОСЬБА ПРОЙТИ НА ЭВАКУАЦИЮ",
    "HexColor": "9ED692"
  },
  {
    "Name": "Вторжение",
    "Title": "ВТОРЖЕНИЕ",
    "Content": "<size=0.9>ЗАМЕЧЕНА ГРУППА<br>НЕАВТОРИЗОВАННЫХ ЛИЦ",
    "HexColor": "FF0000"
  },
  {
    "Name": "Приезд МОГ/ТГ",
    "Title": "OPERATION STARTED",
    "Content": "<size=0.9>ОПЕРАТИВНОЕ ПОДРАЗДЕЛЕНИЕ<br>ВОШЛО В УЧРЕЖДЕНИЕ",
    "HexColor": "60698A"
  },
  {
    "Name": "Поломка D-Блока",
    "Title": "WARNING",
    "Content": "<size=0.9>ГРУППЕ ИТС ПРОЙТИ В D-BLOCK<br>ОСТАЛЬНЫМ НЕ ВОЛНОВАТЬСЯ",
    "HexColor": "F58E40"
  },
  {
    "Name": "Стандарт",
    "Title": "SECURE. CONTAIN. PROTECT.",
    "Content": "<size=0.9>МЫ УМИРАЕМ ВО ТЬМЕ<br>ЧТОБЫ ВЫ МОГЛИ ЖИТЬ В СВЕТЕ",
    "HexColor": "DCE6E6"
  },
  {
    "Name": "НОУС",
    "Title": "<color=#FF4747>CONTAINMENT BREACH",
    "Content": "<SIZE=0.9><color=#FF4747>ВСЕМУ ПЕРСОНАЛУ СЛЕДОВАТЬ<br>СТАНДАРТНЫМ ПРОТОКОЛАМ БЕЗОПАСНОСТИ",
    "HexColor": "FF4747"
  }
];

function normalizeColor(value) {
  const color = String(value).trim().replace(/^#/, '');
  if (/^[0-9a-f]{6}$/i.test(color)) {
    return color.toUpperCase();
  }
  return null;
}
function normalizeText(value) {
  return String(value).replace(/\r\n?|\n/g, '<br>');
}
function validate(preset) {
  if (!preset || typeof preset !== 'object') {
    return 'Некорректный пресет.';
  }
  if (!normalizeColor(preset.HexColor)) {
    return 'Укажите корректный HEX: 6 символов от 0 до 9 и от A до F.';
  }
  if (!validText(preset.Name, 120)) {
    return 'Укажите имя пресета: от 1 до 120 символов.';
  }
  if (!validText(preset.Title, 2000)) {
    return 'Укажите заголовок: от 1 до 2000 символов.';
  }
  if (!validText(preset.Content, 8000)) {
    return 'Укажите текст сообщения: от 1 до 8000 символов.';
  }
  if (/[\r\n]/.test(preset.Name)) {
    return 'Имя пресета должно быть в одну строку.';
  }
  return '';
}

function validText(value, limit) {
  if (typeof value !== 'string' || value.trim() === '' || value.length > limit) {
    return false;
  }
  // Запрещаем служебные символы, которые могут сломать команду.
  return !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u2028\u2029]/.test(value);
}
function exportsFor(preset, target) {
  const error = validate(preset);
  if (error) {
    throw new Error(error);
  }
  if (target !== 'monitor' && target !== 'globalmonitor') {
    throw new Error('Неизвестная команда.');
  }
  const color = normalizeColor(preset.HexColor);
  const title = normalizeText(preset.Title);
  const content = normalizeText(preset.Content);
  return {
    commands: `${target} color ${color}\n${target} title ${title}\n${target} content ${content}`,
    yaml: `- name: ${JSON.stringify(preset.Name.trim())}\n  title: ${JSON.stringify(title)}\n  content: ${JSON.stringify(content)}\n  hex_color: ${JSON.stringify(color)}\n`,
    presetCommand: `${target} preset ${preset.Name.trim()}`
  };
}
// Разрешаем только известные теги. Произвольный HTML не выполняется.
function tagStyle(name, value) {
  if (!value) {
    switch (name) {
      case 'b': return {fontWeight: 'bold'};
      case 'i': return {fontStyle: 'italic'};
      case 'u': return {textDecoration: 'underline'};
      case 's': return {textDecoration: 'line-through'};
      case 'uppercase': return {textTransform: 'uppercase'};
      case 'lowercase': return {textTransform: 'lowercase'};
      case 'smallcaps': return {fontVariant: 'small-caps'};
      case 'sub': return {verticalAlign: 'sub', fontSize: '0.7em'};
      case 'sup': return {verticalAlign: 'super', fontSize: '0.7em'};
    }
  }
  const color = /^(?:#[0-9a-f]{6}(?:[0-9a-f]{2})?|#[0-9a-f]{3}|white|black|red|green|blue|yellow|orange|purple|cyan|magenta)$/i;
  if (name === 'color' && color.test(value)) {
    return {color: value};
  }
  if (name === 'mark' && color.test(value)) {
    return {backgroundColor: value};
  }
  if (name === 'alpha' && /^#[0-9a-f]{2}$/i.test(value)) {
    return {opacity: String(parseInt(value.slice(1), 16) / 255)};
  }
  if (name === 'size' && /^(?:\d+(?:\.\d+)?|\.\d+)(?:%|em|px)?$/.test(value)) {
    const number = parseFloat(value);
    let scale = number;
    if (value.endsWith('%')) {
      scale = number / 100;
    } else if (value.endsWith('px')) {
      scale = number / 32;
    }
    return {fontSize:`${Math.max(0.1,Math.min(scale,10))}em`};
  }
  if (name === 'align' && /^(left|center|right|justified)$/.test(value)) {
    if (value === 'justified') {
      value = 'justify';
    }
    return {display: 'block', textAlign: value};
  }
  return null;
}
function renderRichText(element, source) {
  const doc = element.ownerDocument;
  element.replaceChildren();
  // В стеке храним открытые теги, чтобы правильно обрабатывать вложенность.
  const stack = [{name: 'root', element: element}];
  const tokens = String(source).split(/(<[^<>]*>)/g);
  function text(value) {
    const parent = stack[stack.length - 1].element;
    parent.appendChild(doc.createTextNode(value));
  }
  for (const token of tokens) {
    if (!token) {
      continue;
    }
    if (/^<br\s*\/?>$/i.test(token)) {
      stack[stack.length - 1].element.appendChild(doc.createElement('br'));
      continue;
    }
    const closing = token.match(/^<\/(\w+)>$/);
    if (closing) {
      const name = closing[1].toLowerCase();
      let index = stack.length-1;
      while (index > 0 && stack[index].name !== name) {
        index--;
      }
      if (index > 0) {
        stack.length = index;
      } else {
        text(token);
      }
      continue;
    }
    const opening = token.match(/^<(\w+)(?:=(?:"([^"<>]*)"|'([^'<>]*)'|([^<>]*)))?>$/);
    if (!opening) {
      text(token);
      continue;
    }
    const name = opening[1].toLowerCase();
    const value = opening[2] || opening[3] || opening[4] || '';
    const style = tagStyle(name, value.trim());
    if (!style || stack.length >= 64) {
      text(token);
      continue;
    }
    const span = doc.createElement('span');
    Object.assign(span.style, style);
    stack[stack.length-1].element.appendChild(span);
    // Прозрачность действует до конца текущего блока.
    if (name === 'alpha') {
      stack[stack.length - 1].element = span;
    } else {
      stack.push({name: name, element: span});
    }
  }
}
// Объект нужен странице мониторов и проверкам в Node.js.
const MonitorCore = {
  presets: presets,
  normalizeColor: normalizeColor,
  normalizeText: normalizeText,
  validate: validate,
  exportsFor: exportsFor,
  tagStyle: tagStyle,
  renderRichText: renderRichText
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MonitorCore;
} else {
  window.MonitorCore = MonitorCore;
}
