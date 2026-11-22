// Поля формы.
const monitorName = document.getElementById('monitor-name');
const monitorTitle = document.getElementById('monitor-title');
const monitorContent = document.getElementById('monitor-content');
const monitorHex = document.getElementById('monitor-hex');
const monitorColor = document.getElementById('monitor-color');
const monitorTarget = document.getElementById('monitor-target');
const monitorPreset = document.getElementById('monitor-preset');
const monitorScreen = document.getElementById('monitor-screen');
const monitorStatus = document.getElementById('monitor-status');
const commandsOutput = document.getElementById('monitor-commands');
const yamlOutput = document.getElementById('monitor-yaml');
const presetCommand = document.getElementById('preset-command');
const copyCommandsButton = document.getElementById('copy-commands');
const copyYamlButton = document.getElementById('copy-yaml');
const downloadButton = document.getElementById('download-preset');
const saveButton = document.getElementById('save-draft');
const resetButton = document.getElementById('reset-monitor');
const draftKey = 'atlas.monitors.draft.v1';

function readMonitor() {
  return {
    Name: monitorName.value,
    Title: monitorTitle.value,
    Content: monitorContent.value,
    HexColor: monitorHex.value
  };
}

function updateMonitor() {
  const preset = readMonitor();
  const color = MonitorCore.normalizeColor(preset.HexColor);
  const error = MonitorCore.validate(preset);
  const colorHelp = document.getElementById('color-help');

  if (color) {
    monitorHex.setAttribute('aria-invalid', 'false');
    colorHelp.textContent = 'HEX из 6 символов. Например, FF4747.';
    monitorColor.value = '#' + color;
    monitorScreen.style.setProperty('--screen-color', '#' + color);
  } else {
    monitorHex.setAttribute('aria-invalid', 'true');
    colorHelp.textContent = 'Укажите 6 символов: 0–9 и A–F.';
  }

  MonitorCore.renderRichText(document.getElementById('preview-title'), preset.Title);
  MonitorCore.renderRichText(document.getElementById('preview-content'), preset.Content);
  const hasError = error !== '';
  copyCommandsButton.disabled = hasError;
  copyYamlButton.disabled = hasError;
  downloadButton.disabled = hasError;
  saveButton.disabled = hasError;
  monitorStatus.textContent = error;

  if (hasError) {
    commandsOutput.value = '';
    yamlOutput.value = '';
    presetCommand.value = '';
    return;
  }

  const output = MonitorCore.exportsFor(preset, monitorTarget.value);
  commandsOutput.value = output.commands;
  yamlOutput.value = output.yaml;
  presetCommand.value = output.presetCommand;
}

function applyMonitorPreset(preset) {
  monitorName.value = preset.Name;
  monitorTitle.value = preset.Title;
  monitorContent.value = preset.Content;
  monitorHex.value = preset.HexColor;
  monitorPreset.value = '';
  for (let i = 0; i < MonitorCore.presets.length; i++) {
    const saved = MonitorCore.presets[i];
    if (saved.Name === preset.Name && saved.Title === preset.Title &&
        saved.Content === preset.Content && saved.HexColor === preset.HexColor) {
      monitorPreset.value = String(i);
      break;
    }
  }
  updateMonitor();
}

function editMonitor() {
  monitorPreset.value = '';
  updateMonitor();
}

function saveMonitor() {
  try {
    localStorage.setItem(draftKey, JSON.stringify(readMonitor()));
    monitorStatus.textContent = 'Монитор сохранён в этом браузере.';
  } catch {
    monitorStatus.textContent = 'Хранилище браузера недоступно. Скачайте YAML.';
  }
}

function loadMonitor() {
  try {
    const draft = localStorage.getItem(draftKey);
    if (!draft) {
      return;
    }
    const preset = JSON.parse(draft);
    if (MonitorCore.validate(preset)) {
      monitorStatus.textContent = 'Не удалось загрузить черновик.';
      return;
    }
    applyMonitorPreset(preset);
    monitorStatus.textContent = 'Восстановлен сохранённый в браузере монитор.';
  } catch {
    monitorStatus.textContent = 'Не удалось загрузить черновик.';
  }
}

function resetMonitor() {
  applyMonitorPreset(MonitorCore.presets[4]);
  try {
    localStorage.removeItem(draftKey);
    monitorStatus.textContent = 'Восстановлен стандартный монитор. Черновик удалён.';
  } catch {
    monitorStatus.textContent = 'Восстановлен стандартный монитор. Хранилище недоступно.';
  }
}

async function copyMonitorText(field) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(field.value);
      monitorStatus.textContent = 'Скопировано в буфер обмена.';
      return;
    } catch {
      // Если Clipboard API недоступен, пробуем обычное копирование.
    }
  }
  field.focus();
  field.select();
  try {
    if (document.execCommand('copy')) {
      monitorStatus.textContent = 'Скопировано в буфер обмена.';
      return;
    }
  } catch {
    // Текст остаётся выделенным для ручного копирования.
  }
  monitorStatus.textContent = 'Текст выделен. Нажмите Ctrl+C, чтобы скопировать.';
}

function downloadMonitor() {
  const file = new Blob([yamlOutput.value], {type: 'text/yaml;charset=utf-8'});
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'monitor-preset.yaml';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 1000);
  monitorStatus.textContent = 'YAML подготовлен к скачиванию.';
}

// Добавляем шаблоны в список.
for (let i = 0; i < MonitorCore.presets.length; i++) {
  const option = document.createElement('option');
  option.value = String(i);
  option.textContent = MonitorCore.presets[i].Name;
  monitorPreset.appendChild(option);
}

monitorPreset.addEventListener('change', function () {
  if (monitorPreset.value !== '') {
    applyMonitorPreset(MonitorCore.presets[Number(monitorPreset.value)]);
    monitorStatus.textContent = 'Шаблон применён.';
  }
});
monitorName.addEventListener('input', editMonitor);
monitorTitle.addEventListener('input', editMonitor);
monitorContent.addEventListener('input', editMonitor);
monitorHex.addEventListener('input', editMonitor);
monitorColor.addEventListener('input', function () {
  monitorHex.value = monitorColor.value.slice(1).toUpperCase();
  editMonitor();
});
monitorTarget.addEventListener('change', updateMonitor);
saveButton.addEventListener('click', saveMonitor);
resetButton.addEventListener('click', resetMonitor);
downloadButton.addEventListener('click', downloadMonitor);
copyCommandsButton.addEventListener('click', function () {
  copyMonitorText(commandsOutput);
});
copyYamlButton.addEventListener('click', function () {
  copyMonitorText(yamlOutput);
});

applyMonitorPreset(MonitorCore.presets[4]);
loadMonitor();
