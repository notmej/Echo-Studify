"""Patch Studify first-launch accessibility disclosure rerouting.
Run from the Studify repository root: python3 fix_studify_consent.py
"""
from pathlib import Path

root = Path.cwd()
app = root / 'App.js'
block = root / 'AppInternals/Views/ViewAppBlock.js'

if not app.is_file() or not block.is_file():
    raise SystemExit('Run this script from the Studify project root (with App.js and AppInternals/Views/ViewAppBlock.js).')

app_text = app.read_text()
block_text = block.read_text()

old_state = '  const [showPermissionIntro, setShowPermissionIntro] = useState(false);'
new_state = old_state + '''

  // Allow the App Blocking screen to reopen the same informed-consent disclosure.
  function requestAccessibilityConsent() {
    setShowPermissionIntro(true);
  }'''
old_screen = '        <Stack.Screen name="AppBlock" component={ViewAppBlock} />'
new_screen = '''        <Stack.Screen name="AppBlock">
          {(props) => (
            <ViewAppBlock
              {...props}
              onRequestAccessibilityConsent={requestAccessibilityConsent}
            />
          )}
        </Stack.Screen>'''
old_signature = 'export default function ViewAppBlock({ navigation }) {'
new_signature = '''export default function ViewAppBlock({
  navigation,
  onRequestAccessibilityConsent,
}) {'''
old_press = 'onPress={permissionStatus ? undefined : openPermissionSettings}'
new_press = '''onPress={
                permissionStatus
                  ? undefined
                  : onRequestAccessibilityConsent
              }'''

changes = [
    ('App.js state', app_text, old_state, new_state),
    ('App.js screen', app_text, old_screen, new_screen),
    ('ViewAppBlock signature', block_text, old_signature, new_signature),
    ('ViewAppBlock permission button', block_text, old_press, new_press),
]
for label, source, old, new in changes:
    if new in source:
        continue
    if source.count(old) != 1:
        raise SystemExit(f'Cannot safely patch {label}: expected exactly one matching location, found {source.count(old)}. No files were modified.')

for old, new in [(old_state,new_state),(old_screen,new_screen)]:
    if new not in app_text:
        app_text = app_text.replace(old,new,1)
for old, new in [(old_signature,new_signature),(old_press,new_press)]:
    if new not in block_text:
        block_text = block_text.replace(old,new,1)

if app.read_text() != app_text:
    (root / 'App.js.before-consent-fix.bak').write_text(app.read_text())
    app.write_text(app_text)
if block.read_text() != block_text:
    (block.parent / 'ViewAppBlock.js.before-consent-fix.bak').write_text(block.read_text())
    block.write_text(block_text)
print('Consent retry flow patched. Backups created for changed files.')
