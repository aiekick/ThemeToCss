import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('themeToCss.extractTheme', async () => {
		try {
			// excecute the command to generate a color theme
			await vscode.commands.executeCommand('workbench.action.generateColorTheme');

			// wait for the command to finish
			await new Promise(resolve => setTimeout(resolve, 1000));

			// find the color theme document
			const colorThemeDocument = vscode.workspace.textDocuments.find(doc =>
				doc.getText().startsWith('{\n\t"$schema": "vscode://schemas/color-theme"')
			);

			// color theme document found
			if (colorThemeDocument) {
				// get content rows
				let rows = colorThemeDocument.getText().split('\n');

				// get current theme name
				let theme_name = vscode.workspace.getConfiguration().get<string>('workbench.colorTheme', 'Default Theme');

				// iterate lines
				let colorProperties: string[] = [];
				for (let index = 0; index < rows.length; ++index) {
					const row = rows[index];
					// check for colors
					if (row.includes('"colors":')) {
						for (let i = index + 1; i < rows.length; i++) {
							if (rows[i].includes('}')) {
								break;
							}
							const key_value = rows[i].trim().
								replaceAll('//', ''). // remvoe commennt
								replaceAll('"', ''). // remove quotes
								replaceAll('.', '-').// replace dot by dash
								replaceAll(',', ''). // remove comma
								split(':'); // split by colon
							if (!key_value[1].includes('null')) { // check for 'null' values
								colorProperties.push(`--vscode-${key_value[0]}: ${key_value[1]};`);
							}
						}
						break; // no parse the rest of the file
					}
				}

				// final content
				const finalContent = `/* Css vars of theme : ${theme_name} */\n:root {\n\t${colorProperties.join('\n\t')}\n}\n`;

				// replace current editor content
				const editor = await vscode.window.showTextDocument(colorThemeDocument);
				await editor.edit(editBuilder => {
					const fullRange = new vscode.Range(
						new vscode.Position(0, 0),
						new vscode.Position(colorThemeDocument.lineCount, 0)
					);
					editBuilder.replace(fullRange, finalContent);
				});

				// change current editor language type to css
				await vscode.languages.setTextDocumentLanguage(colorThemeDocument, 'css');
			} else {
				vscode.window.showErrorMessage('No theme document found');
			}
		} catch (e) {
			vscode.window.showErrorMessage('ThemeToCss error. see console for more details');
			console.error(e);
		}
	});

	context.subscriptions.push(disposable);
}
