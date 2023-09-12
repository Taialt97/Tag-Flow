import TagFlowPlugin, { TagList } from "main";
import { App, FuzzySuggestModal, MarkdownView } from "obsidian";

export default class DeleteListModal extends FuzzySuggestModal<TagList> {
	plugin: TagFlowPlugin;

	constructor(app: App, plugin: TagFlowPlugin) {
		super(app);
		this.plugin = plugin;
	}

	getItems(): TagList[] {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView && activeView.file) {
			return this.plugin.lists.filter(list => list.notePath === activeView.file?.path);
		}
		return [];
	}

	getItemText(item: TagList): string {
		console.log("Item ID:", item.id);
		return `${item.tag} (ID: ${item.id})`;
	}

	onChooseItem(item: TagList) {
		this.plugin.deleteList(item, null, null);
	}
}
