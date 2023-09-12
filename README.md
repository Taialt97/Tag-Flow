# Tag Flow for Obsidian 

[![Buy me a coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg)]( https://www.buymeacoffee.com/YourLink )
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Status: Beta](https://img.shields.io/badge/Status-Beta-orange.svg)

> :warning: **Beta Version**: This plugin is currently in beta. While it is functional and has been tested to work well, please be aware that some features are still under development and may not be fully stable.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Known Issues](#known-issues)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

Streamline the generation and administration of note lists based on specific tags within Obsidian.

## Features

- **Tag Selection Modal**: Displays all available tags in the vault. Selecting a tag triggers list creation.
- **List Creation**: Creates a list of notes tagged with the selected tag. Inserts list at the cursor's location in the active note.
- **List Updating**: Automatically updates lists based on triggers like active leaf changes, file saves, and Obsidian's open and close.
- **Data Persistence**: Maintains state between Obsidian sessions.
- **List Deletion**: Allows users to delete a list via a dedicated function or manually.
- **File Change Handling**: Updates all tags and lists upon file changes.
- **Front Matter Support**: Support for YAML front matter tags.

## Demo

![Demo](https://user-images.githubusercontent.com/45160819/263471872-5346c595-ea93-446a-bc09-565237b24646.gif)

## Installation

### Manual Installation

1. Download the zip file called `Tag Flow Beta`.
2. Unzip the folder.
3. Move the folder to `Your Obsidian Vault > .obsidian > Plugin`.

> **Note**: If you can't find the `.obsidian` folder, it's likely hidden.
**Mac:** Open Finder > Press Command + Shift + . (dot)
**Windows:** Open File Explorer > Click on 'View' tab > Check 'Hidden items' in the Show/hide section

## Usage

To create a new tag-based list, open the "Tag Flow: Open Tag Flow" modal via Obsidian's command palette, and then choose a tag from which to create a list. The list will be created at the mouse location.

## Known Issues

- Easy Typing Compatibility Issue, Lists initiated at the beginning of a note don't refresh properly
- Unexpected tags may appear within the list on Mac systems.

## Roadmap

The following are features we plan to implement in upcoming versions. Your feedback and contributions are welcome!

- **Adding All Tags List:** Create a list of all tags.
- **Adding Nested Tags:** Support tags in the format `{{nameOfNote/NameOfNote}}`, allowing nested categorization.
- **Inline Tag Headers:** Provide the ability to link inline tags to their headers.
- **Integration with Templates:** Ensure the plugin works with Obsidian's templates.
- **Anchor Support:** Enable linking to a specific tag within a document, navigating to the exact location.
- **User-Selectable List Types:** Allow users to choose different types of tag lists (Simple List, Expanded List, Front Matter Only, Simple Inline, Expanded Inline).

## Contributing

If you find this plugin useful and have ideas or spot a bug, you can always open an issue on my GitHub. You can also support by [Buy me a coffee](https://www.buymeacoffee.com/taialt)
If you want to support the development of this plugin even more and help improve it on your own, that would be seriously awesome. Don't hesitate to jump in!

## License

MIT License - see the [LICENSE.md](https://github.com/Taialt97/Tag-Flow/blob/master/LICENSE) file for details
