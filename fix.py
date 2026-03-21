lines = open('src/App.css', 'r', encoding='utf-8').readlines()
new_lines = lines[:269] + [
    '}\n\n',
    '.controls {\n',
    '  position: fixed;\n',
    '  bottom: 20px;\n',
    '  right: 20px;\n',
    '  background: rgba(0, 0, 0, 0.8);\n',
    '  color: white;\n',
    '  padding: 10px;\n',
    '  border-radius: 5px;\n',
    '  z-index: 10;\n',
    '}\n'
]
open('src/App.css', 'w', encoding='utf-8').writelines(new_lines)
print("File rewritten successfully")
