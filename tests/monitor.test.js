const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../monitor-core');
test('all six game presets generate valid commands without losing markup', () => {
  assert.equal(core.presets.length, 6);
  for (const preset of core.presets) {
    for (const target of ['monitor','globalmonitor']) {
      const result = core.exportsFor(preset,target);
      assert.deepEqual(result.commands.split('\n'),[`${target} color ${preset.HexColor}`,`${target} title ${preset.Title}`,`${target} content ${preset.Content}`]);
      assert.equal(result.presetCommand, `${target} preset ${preset.Name}`);
      assert.ok(result.yaml.includes(`hex_color: "${preset.HexColor}"`));
    }
  }
});
test('browser presets match C# configuration when available', t => {
  const config = path.resolve(__dirname,'../../Modules/Monitors/Config.cs');
  if (!fs.existsSync(config)) return t.skip('Standalone site checkout');
  const source = fs.readFileSync(config,'utf8');
  const blocks = [...source.matchAll(/new MonitorPreset\(\)\s*\{([^}]+)\}/g)];
  const presets = blocks.map(block => Object.fromEntries([...block[1].matchAll(/(Name|Title|Content|HexColor)\s*=\s*"([^"]*)"/g)].map(match => [match[1],match[2]])));
  assert.deepEqual(core.presets,presets);
  assert.match(source,/Presets\s*\{\s*get;\s*set;\s*\}/);
});
test('multiline and quotes survive YAML and become single-line RA arguments', () => {
  const preset = {Name:'Связь: "тест"',Title:'Первая\r\nВторая',Content:'A\nB\\C "Q"',HexColor:'#ff4747'};
  const result = core.exportsFor(preset,'monitor');
  assert.equal(result.commands.split('\n').length,3);
  assert.ok(result.commands.includes('title Первая<br>Вторая'));
  const lines = result.yaml.trim().split('\n');
  assert.equal(JSON.parse(lines[0].slice('- name: '.length)),preset.Name);
  assert.equal(JSON.parse(lines[2].slice('  content: '.length)),'A<br>B\\C "Q"');
});
test('invalid colors, blank fields and line injection are rejected', () => {
  for (const HexColor of ['red','fff','00000000','GG1234','123456;']) assert.throws(() => core.exportsFor({...core.presets[0],HexColor},'monitor'));
  assert.equal(core.normalizeColor(' #aBc123 '),'ABC123');
  for (const key of ['Name','Title','Content']) assert.throws(() => core.exportsFor({...core.presets[0],[key]:' '},'monitor'));
  assert.throws(() => core.exportsFor({...core.presets[0],Name:'A\nB'},'monitor'));
  assert.throws(() => core.exportsFor(core.presets[0],'other'));
});
test('rich text renders with safe DOM nodes and scoped formatting', () => {
  function element(tag) { return {tag,style:{},children:[],appendChild(node){this.children.push(node);},replaceChildren(){this.children=[];},ownerDocument:doc}; }
  const doc = {createElement:element,createTextNode:text=>({text})};
  const root = element('div');
  core.renderRichText(root,'<SIZE=0.9><color=#FF4747>КРАСНЫЙ<br><b>ЖИРНЫЙ</b></color>БЕЛЫЙ</size><img src=x onerror=alert(1)>');
  assert.equal(root.children[0].style.fontSize,'0.9em');
  assert.equal(root.children[0].children[0].style.color,'#FF4747');
  assert.equal(root.children[0].children[0].children[1].tag,'br');
  assert.equal(root.children[0].children[1].text,'БЕЛЫЙ');
  assert.equal(root.children[1].text,'<img src=x onerror=alert(1)>');
  assert.equal(core.tagStyle('color','red;position:fixed'),null);
  assert.equal(core.tagStyle('size','99999').fontSize,'10em');
  core.renderRichText(root,'<script>alert(1)</script><color="red">безопасно</color>');
  assert.equal(root.children[0].text,'<script>');
  assert.equal(root.children[3].style.color,'red');
});
