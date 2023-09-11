import { FuzzySuggestModal, FuzzyMatch } from "obsidian";
import TagFlowPlugin from "../main";

export default class TagPromptModal extends FuzzySuggestModal<string> {
	plugin: TagFlowPlugin;

	constructor(plugin: TagFlowPlugin) {
		super(plugin.app);
		this.plugin = plugin;
	}

	getItems(): string[] {
		const allFiles = this.plugin.app.vault.getMarkdownFiles();
		const tags = new Set<string>();

		allFiles.forEach((file) => {
			const cache = this.plugin.app.metadataCache.getFileCache(file);
			if (cache && cache.tags) {
				cache.tags.forEach((t) => tags.add(t.tag));
			}
		});

		return Array.from(tags);
	}

	getItemText(item: string): string {
		return item;
	}

	onChooseItem(item: string, evt: MouseEvent | KeyboardEvent) {
		// this.plugin.activeTag = item;
		// this.plugin.tagToListMap.set(item, this.plugin.originalNotePath);
		// this.plugin.updateList(item, this.plugin.originalNotePath);
	}

	renderSuggestion(item: FuzzyMatch<string>, el: HTMLElement) {
		el.innerText = `#${item.item}`;
	}
}
