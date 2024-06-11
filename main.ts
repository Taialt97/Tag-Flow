import { load as loadYAML } from "js-yaml";
import DeleteListModal from "modals/DeleteListModal";
import TagSuggester from "modals/TagSuggester";
import { Plugin, MarkdownView, TFile } from "obsidian";

export interface TagList {
	tag: string;
	notePath: string;
	id: number; // Timestamp when the list was created
}

export default class TagFlowPlugin extends Plugin {
	allTags: string[] = [];
	lists: TagList[] = [];
	tagCache = new Map<string, Set<string>>();
	hasSelectedTag = false;
	tagChanged = false;
	public tempTitle: string = ''; // Property to hold the title

	async onload() {
		console.log("Plugin loaded");

		// this.registerCodeMirror((cm: CodeMirror.Editor) => {
		// 	cm.on("change", this.handleFileChange.bind(this));
		// });

		this.addCommand({
			id: "create-list-from-title-command",  // This is the ID you will reference in Templater
			name: "Create List from Title",
			callback: () => {
				const title = this.tempTitle;  // Ensure this is set somewhere relevant in your plugin
				if (title) {
					this.createListFromTitle(title);
				} else {
					console.error("No title set for creating list.");
				}
			}
		});

		this.addCommand({
			id: "delete-current-list",
			name: "Delete Current List",
			callback: () => new DeleteListModal(this.app, this).open(),
		});

		this.addCommand({
			id: "open-tag-flow",
			name: "Open Tag Flow",
			callback: () => this.createTagList(),
		});

		this.app.workspace.on("active-leaf-change", () => {
			this.updateLists();
		});

		this.app.workspace.on("layout-change", () => {
			if (this.app.workspace.getLeavesOfType("graph").length > 0) {
				this.updateLists();
			}
		});
		this.app.workspace.onLayoutReady(async () => {
			await this.loadData();
			this.allTags = this.fetchAllTags();
		});

		this.registerEvent(
			this.app.vault.on("create", (file) => {
				this.tagCache.set(file.path, new Set());
			})
		);
		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (!(file instanceof TFile)) return;
				// oldPath = the previous path of the file
				// file, the new file data i.e the new name of file alongwith other properties

				const data = this.tagCache.get(oldPath) as Set<string>;
				this.tagCache.delete(oldPath);
				this.tagCache.set(file.path, data);

				// overwrite the file's notepath with the new path
				this.lists = this.lists.map((tagList) => {
					if (tagList.notePath === oldPath) {
						tagList.notePath = file.path;
					}
					return tagList;
				});
			})
		);
		this.registerEvent(
			this.app.vault.on("delete", async (file) => {
				if (!(file instanceof TFile)) {
					return;
				}
				this.lists = this.lists
					.map((tagList) => {
						if (tagList.notePath !== file.path) {
							return tagList;
						}
					})
					.filter(Boolean) as TagList[];

				if (this.tagCache.has(file.path)) {
					this.tagCache.delete(file.path);
				}
				await this.saveData();
			})
		);
		// Update the cache whenever a file is modified
		this.registerEvent(
			this.app.vault.on("modify", async (file) => {
				if (!(file instanceof TFile)) {
					return;
				}
				if (file.basename === "tagFlowData") return;

				const newTags = await this.processTags(file);

				this.tagChanged = this.hasTagChanged(file, newTags);

				this.tagCache.set(file.path, new Set(newTags));

				if (this.tagChanged) {
					this.updateLists();
				}
				if (this.hasSelectedTag) {
					this.updateLists();
				}
			})
		);

		setInterval(() => {
			this.updateLists();
		}, 60 * 60 * 1000);

	}

	public async createListFromTitle(title: string){
		console.log("Opening Tag Flow with title: " + title); // Consider reducing debug logs in production
		this.handleTagSelection(title)
	}


	hasTagChanged(file: TFile, newTags: Set<string>) {
		let tagChanged = false;
		// Check if any tag has been changed
		const oldTags = this.tagCache.get(file.path);
		if (oldTags) {
			// iterate through the tags in the tag cache for the currently modified file
			tagChanged = [...newTags].some((element) => !oldTags.has(element));
		}
		return tagChanged;
	}
	async filterContent(file: TFile) {
		const content = await this.app.vault.read(file);
		// Define a regular expression pattern to match the anchor tags
		const anchorTagPattern =
			/<!--tag-list\s[^>]+-->[\s\S]*?<!--end-tag-list\s[^>]+-->/g;
		// Remove all anchor tags using the replace() method with the pattern
		const cleanedContent = content.replace(anchorTagPattern, "");
		return cleanedContent;
	}

	getFrontmatterTags(file: TFile) {
		let newTags: Set<string> = new Set();
		const cache = this.app.metadataCache.getFileCache(file);
		if (cache && cache.frontmatter) {
			const frontMatterTags: string = cache.frontmatter.tags;
			const frontmatterTagsArr = frontMatterTags
				?.split(",")
				?.map((tag) => {
					tag = tag.trim();
					if (tag !== "") return "#" + tag;
				})
				.filter(Boolean) as string[];

			newTags = new Set(frontmatterTagsArr);
		}
		return newTags;
	}
	async deleteList(
		list: TagList,
		note: TFile | null,
		content: string | null
	) {
		// If no file content has been passed as argument then read the file and get the file content
		if (!content || !note) {
			note = this.app.vault.getAbstractFileByPath(list.notePath) as TFile;
			content = await this.app.vault.read(note);
		}
		const startAnchor = `<!--tag-list ${list.tag} ${list.id}-->`;
		const endAnchor = `<!--end-tag-list ${list.tag} ${list.id}-->`;

		const startIndex = content.indexOf(startAnchor);
		const endIndex = content.indexOf(endAnchor);
		if (startIndex >= 0) {
			if (endIndex >= 0) {
				// If the end anchor exists, delete the content between start and end anchors
				content =
					content.substring(0, startIndex) +
					content.substring(endIndex + endAnchor.length);
			} else {
				// If the end anchor does not exist, only delete the content from start anchor to the next line
				const nextLineIndex = content.indexOf("\n", startIndex);
				content =
					content.substring(0, startIndex) +
					content.substring(nextLineIndex + 1);
			}

			// Remove the list from the plugin's lists
			this.lists = this.lists.filter((l) => l !== list);
			// Save the data
			await this.saveData();
			// Update the file
			await this.app.vault.modify(note, content);
		}
	}

	fetchAllTags() {
		const allTags = new Set<string>();
		for (const tagSet of this.tagCache.values()) {
			for (const tag of tagSet) {
				allTags.add(tag.slice(1, tag.length));
			}
		}
		return Array.from(allTags);
	}


	createTagList() {
		this.allTags = this.fetchAllTags(); // Retrieve all tags, consider caching if performance is an issue
		 if (this.allTags.length > 0) {
			console.log("No tag provided, opening tag selector.");
			new TagSuggester(this.app, this, this.allTags).open(); // Open tag suggester if no tag is provided
		} else {
			console.log("No tags available to select."); // Handle case where no tags are available
		}
	}
	

	async handleTagSelection(tag: string) {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView && activeView.file) {
			const activeEditor = activeView.editor;
			const cursor = activeEditor.getCursor();
			const id = Date.now();
			activeEditor.replaceRange(
				`<!--tag-list #${tag} ${id}-->\n<!--end-tag-list #${tag} ${id}-->\n`,
				cursor
			);

			this.lists.push({
				tag: `#${tag}`,
				notePath: activeView.file.path,
				id: id,
			});
			this.hasSelectedTag = true;
			await this.saveData();
		}
	}

	alreadyExistingHyperlinks(
		startIndex: number,
		endIndex: number,
		content: string,
		startAnchor: string,
		links: string
	) {
		if (startIndex !== -1 && endIndex !== -1) {
			// Extract the content between startAnchor and endAnchor
			const extractedContent = content.substring(
				startIndex + startAnchor.length,
				endIndex
			);
			if (links.length > 0 && extractedContent === links) {
				// the hyperlinks for tags inside the anchors are not modified so dont modify them again
				return true;
			}
		}
		return false;
	}
	async replaceAnchorContents(
		startIndex: number,
		endIndex: number,
		content: string,
		startAnchor: string,
		endAnchor: string,
		links: string,
		note: TFile,
		list: TagList
	) {
		links = links.trim();
		if (startIndex >= 0 && links.length > 0) {
			if (endIndex >= 0) {
				// If the end anchor exists, replace the content between start and end anchors
				content =
					content.substring(0, startIndex) +
					startAnchor +
					"\n" +
					links +
					"\n" +
					endAnchor +
					content.substring(endIndex + endAnchor.length);
			} else {
				// If the end anchor does not exist, insert it after the list
				content =
					content.substring(0, startIndex) +
					startAnchor +
					"\n" +
					links +
					"\n" +
					endAnchor +
					content.substring(startIndex + startAnchor.length);
			}
			// ! Check modify vs process
			await this.app.vault.modify(note, content);
		} else {
			//Remove the Tags and modify content
			this.deleteList(list, note, content);
		}
	}

	async updateLists() {
		if (!this.lists.length) {
			console.log("no lists");
			return;
		}
		this.hasSelectedTag = false;

		const markdownFiles = this.app.vault.getMarkdownFiles();
		// Get the currently opened file as activeLeaf
		const activeLeaf = this.app.workspace.activeLeaf?.view;
		if (!(activeLeaf instanceof MarkdownView)) {
			return;
		}
		const file = activeLeaf.file;

		if (file) {

			
			// filtering out those tag-lists from this.lists that are only present in the currently opened file
			const extractedLists = this.lists.filter(
				(list) => file && list.notePath === file.path
				);
				
				for (const list of extractedLists) {
					// Use the tag cache to find the files that contain the tag from tag list
					const filesWithTag = markdownFiles.filter((file) => {
						const tags = this.tagCache.get(file.path);
						return tags && tags.has(list.tag);
					});
					
					const links = filesWithTag
					.map((file) => `- [[${file.basename}]]`)
					.join("\n");
					
					// * Read the contents of the currently opened file
					const content = await this.app.vault.read(file);
					// * Get the anchor tags & the index for the currently iterated list
					const startAnchor = `<!--tag-list ${list.tag} ${list.id}-->`;
					const endAnchor = `<!--end-tag-list ${list.tag} ${list.id}-->`;
					const startIndex = content.indexOf(startAnchor);
					const endIndex = content.indexOf(endAnchor);
					
					// * Check if the links are same as the links between anchor tags
					const existingHyperlinks = this.alreadyExistingHyperlinks(
						startIndex,
						endIndex,
						content,
						startAnchor,
						links
						);
						if (existingHyperlinks) {
							continue;
						}
						await this.replaceAnchorContents(
							startIndex,
							endIndex,
							content,
							startAnchor,
							endAnchor,
							links,
							file,
							list
							);
						}
					}
	}

	async saveData() {
		const data = {
			lists: this.lists.map((list) => ({
				tag: list.tag,
				notePath: list.notePath,
				id: list.id,
			})),
		};
		await this.app.vault.adapter.write(
			"tagFlowData.json",
			JSON.stringify(data),
			{ ctime: Date.now() }
		);
	}

	async loadData() {
		try {
			const content = await this.app.vault.adapter.read(
				"tagFlowData.json"
			);
			const data = JSON.parse(content);

			this.lists = data.lists;
		} catch (error) {
			console.error("Failed to load data:", error);
		}
		this.addToCache();
	}

	async addToCache() {
		const tagMap = new Map<string, Set<string>>();

		await Promise.all(
			this.app.vault.getMarkdownFiles().map(async (file) => {
				const notePath = file.path;
				const combinedTags = await this.processTags(file);
				tagMap.set(notePath, new Set(combinedTags));
			})
		);
		this.tagCache = tagMap;
	}

	async processTags(file: TFile) {

		let frontmatterTagsArr: string[] | undefined = undefined;
		let combinedTags: Set<string> = new Set();
	
		try {
			const cleanedContent = await this.filterContent(file);
			const tagMatches = cleanedContent.match(/#([a-zA-Z0-9_-]+)/g);
	
			const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
			const fmMatch = cleanedContent.match(frontMatterRegex);
	
			if (fmMatch && cleanedContent.startsWith(fmMatch[0])) {
				const frontMatterString = fmMatch[1];
				const frontMatter = loadYAML(frontMatterString) as {tags: string | unknown};
				
				if (typeof frontMatter.tags === "string") {
					// console.log("Processing tags as a string.");
					// Existing code for string format
					frontmatterTagsArr = frontMatter.tags
						.split(',')
						.map((tag: string) => tag.trim())
						.filter((tag: string) => tag !== "")
						.map((tag: string) => "#" + tag);
				} else if (Array.isArray(frontMatter.tags)) {
					// console.log("Processing tags as an array.");
					// New code to handle array format
					frontmatterTagsArr = frontMatter.tags
						.map((tag: any) => tag.toString().trim())  // Convert to string and trim
						.filter((tag: string) => tag !== "")  // Remove empty strings
						.map((tag: string) => "#" + tag);  // Add '#' prefix
				} else {
					console.warn("No tags found in frontMatter. frontMatter.tags is neither a string nor an array. Skipping tag processing for front matter.");
				}
			}
	
			if (tagMatches && frontmatterTagsArr) {
				combinedTags = new Set([...tagMatches, ...frontmatterTagsArr]);
			} else if (tagMatches) {
				combinedTags = new Set([...tagMatches]);
			} else if (frontmatterTagsArr) {
				combinedTags = new Set([...frontmatterTagsArr]);
			}
		} catch (error) {
			console.error("An error occurred while processing tags:", error);
		}
	
		return combinedTags;
	}

	onunload() {
		console.log("unloading plugin");
	}
}
