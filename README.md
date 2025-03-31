# Theme To CSS

This extension allows you to extract your current VSCode theme's colors settings into a `.css` file using `--vscode-*` variables.

## Usage

- Open the command palette.
- Run **Extract Current Theme as CSS VSCode Vars**.
- Save the file where you want.

## Example Output

```css
/* Css vars of theme : Visual Studio Dark */
:root {
	--vscode-actionBar-toggledBackground:  #383a49;
	--vscode-activityBarBadge-background:  #007acc;
	--vscode-checkbox-border:  #6b6b6b;
	--vscode-editor-background:  #1e1e1e;
	--vscode-editor-foreground:  #d4d4d4;
	--vscode-editor-inactiveSelectionBackground:  #3a3d41;
	--vscode-editor-selectionHighlightBackground:  #add6ff26;
  ...
}
```
