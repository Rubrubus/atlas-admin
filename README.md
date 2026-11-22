# Atlas HRP Admin Tools

Генератор ключ-карт и редактор мониторов для Atlas HRP.

Сайт: https://rubrubus.github.io/atlas-admin/

Основные файлы: `index.html`, `keycards.js`, `keycards.css`, `monitors.html`, `monitors.js`, `monitor-core.js`, `monitors.css`.

GitHub Pages публикует корень ветки `main`. Для обновления измените исходники и отправьте коммит в `main`. Сборка для GitHub Pages не требуется. Команда `node build.mjs` создаёт отдельную копию в `dist` для других хостингов.

Проверки: `node --test tests/monitor.test.js`. Оба раздела работают в браузере и генерируют команды для ручного выполнения в Remote Admin.

Исходный генератор карт: [ScoutTrooper2/AtlasCardsAdmin](https://github.com/ScoutTrooper2/AtlasCardsAdmin). Оригинальная идея Rysik5318, изменения Scout Trooper.
