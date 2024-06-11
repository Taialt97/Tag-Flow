# Tag Flow, Easily Create Tag Pages in Obsidian

[![Buy me a coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg)]( https://www.buymeacoffee.com/YourLink )
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Status: Beta](https://img.shields.io/badge/Status-Beta-orange.svg)

> :warning: **Beta Version**: This plugin is currently in beta. While it is functional and has been tested to work well, please be aware that some features are still under development and may not be fully stable. If you encounter any bugs, please open a new issue on the GitHub repository.

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

This plugin helps with the creation of tag pages inside Obsidian, streamlining the generation of note lists based on specific tags.

## Features

- **Tag Selection Modal**: Displays all available tags in the vault. Selecting a tag triggers list creation.
- **List Creation**: Creates a list of notes tagged with the selected tag. Inserts list at the cursor's location in the active note.
- **Quick List**: Quickly create a new list using the file name (title).
- **List Updating**: Automatically updates files in lists based on triggers like active leaf changes, file saves, and Obsidian's open and close.
- **Data Persistence**: Maintains state between Obsidian sessions.
- **List Deletion**: Allows users to delete a list via a dedicated function or manually (work in progress).
- **Front Matter Support**: Support for YAML front matter tags.

## Demo

![Demo](https://user-images.githubusercontent.com/45160819/263471872-5346c595-ea93-446a-bc09-565237b24646.gif)

## Installation

### Manual Installation

1. Download the latest zip file called `Tag Flow Beta`.
2. Unzip the folder.
3. Move the folder to `Your Obsidian Vault > .obsidian > Plugin`.

> **Note**: If you can't find the `.obsidian` folder, it's likely hidden.
**Mac:** Open Finder > Press Command + Shift + . (dot)
**Windows:** Open File Explorer > Click on 'View' tab > Check 'Hidden items' in the Show/hide section

## Usage

To create a new tag-based list, open the "Tag Flow: Open Tag Flow" modal via Obsidian's command palette (Cmd+P / Ctrl+P) , and then choose a tag from which to create a list. The list will be created at the mouse location.

## Known Issues

- Easy Typing Compatibility Issue, Lists initiated at the beginning of a note don't refresh properly
- Unexpected tags may appear within the list on Mac systems.

## Roadmap

The following are features we plan to implement in upcoming versions. Your feedback and contributions are welcome!

- Adding Inline Only List
- Adding Front Matter Only List
- Integration with Templates
- Integration with Easy Typing
- List deletion without command palette 

## Contributing

If you find this plugin useful and have ideas or spot a bug, you can always open an issue on my GitHub. 
You can also support by [Buy me a coffee](https://www.buymeacoffee.com/taialt)
If you want to support the development of this plugin even more and help improve it on your own, that would be awesome. Don't hesitate to jump in!

## License

MIT License - see the [LICENSE.md](https://github.com/Taialt97/Tag-Flow/blob/master/LICENSE) file for details
