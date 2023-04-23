// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

enum ChartTypes {
	Bar = "bar",
	Bubble = "bubble",
	Doughnut = "doughnut",
	Line = "line",
	Pie = "pie",
	PolarArea = "polarArea",
	Radar = "radar",
	Scatter = "scatter",
}

export function activate(context: vscode.ExtensionContext) {
	const importCommand = vscode.commands.registerCommand('ChartJS.import', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found');
			return;
		}

		// the latest minified version of chart.js
		const snippet = new vscode.SnippetString("<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>");
		editor.insertSnippet(snippet);
	});

	context.subscriptions.concat(
		importCommand,
		registerNewChartCommand(ChartTypes.Bar),
		registerNewChartCommand(ChartTypes.Bubble),
		registerNewChartCommand(ChartTypes.Doughnut),
		registerNewChartCommand(ChartTypes.Line),
		registerNewChartCommand(ChartTypes.Pie),
		registerNewChartCommand(ChartTypes.PolarArea),
		registerNewChartCommand(ChartTypes.Radar),
		registerNewChartCommand(ChartTypes.Scatter),
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }

function registerNewChartCommand(type: ChartTypes) {
	return vscode.commands.registerCommand('ChartJS.newChart' + capitalize(type), () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found');
			return;
		}

		// insert a line before
		// editor.edit((edit: vscode.TextEditorEdit) => {
		// 	const line = editor.document.lineAt(editor.selection.active.line);
		// 	edit.insert(new vscode.Position(line.lineNumber, 0), '\n');
		// });
		
		const snippet = newChartSnippet(type);
		editor.insertSnippet(snippet);
	});
}

function capitalize(str: string) {
	return str && str[0].toUpperCase() + str.slice(1);
}

function newChartSnippet(type: ChartTypes) {
	let data = "12, 18, 19";
	if (type == ChartTypes.Bubble || type == ChartTypes.Scatter) {
		data = "[12, 4, 14], [18, 2, 12], [9, 8, 22]";
	}

	let prefix = "", suffix = "";
	if (vscode.window.activeTextEditor?.document.languageId == 'html') {
		prefix = `<canvas id="\${1:${type}Chart}" width="" height=""></canvas>
<script>`;
		suffix = `
</script>`;
	}

	return new vscode.SnippetString(prefix + `
var \${1:${type}Chart} = document.getElementById('\${1:${type}Chart}');
var chart = new Chart(\${1:${type}Chart}, {
\ttype: '${type}',
\tdata: {
\t\tlabels: [\${2:'Label1', 'Label2', 'Label3'}],
\t\tdatasets: [{
\t\t\tlabel: "\${3:New Dataset}",
\t\t\tdata: [\${4:${data}}],
\t\t\tborderWidth: 1
\t\t}]
\t},
\toptions: {
\t\tresponsive: true,
\t\ttitle: {
\t\t\ttext: "\${5:New ${capitalize(type)} Chart}",
\t\t\tdisplay: true,
\t\t},
\t\tscales: {},
\t\tevents: [],
\t\tlegend: {
\t\t\tdisplay: true,
\t\t},
\t\ttooltips: {
\t\t\tmode: ''
\t\t},
\t\tlayout: {},
\t\tanimation: {}
\t}
});`+ suffix);
}