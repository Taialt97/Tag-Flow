import TagFlowPlugin from "main";
import { App, FuzzySuggestModal } from "obsidian";

export default class TagSuggester extends FuzzySuggestModal<string> {
	tags: string[];
	plugin: TagFlowPlugin;

	constructor(app: App, plugin: TagFlowPlugin, tags: string[]) {
		super(app);
		this.tags = tags;
		this.plugin = plugin;
	}

	getItems(): string[] {
		return this.tags;
	}

	getItemText(item: string): string {
		return item;
	}

	onChooseItem(item: string) {
		this.plugin.handleTagSelection(item);
	}
}
