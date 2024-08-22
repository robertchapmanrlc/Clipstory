# ClipStory

A desktop application that can be used to keep track of things in your clipboard history.

## Install

### Prerequisites

To properly run the application you need to have the following on your machine:

* [Rust](https://www.rust-lang.org/tools/install)
* [Tauri](https://tauri.app)

### Download

Download the codebase to your machine. Navigate to the repo via the command line and run the following command.

```bash
cargo tauri dev
```

## Usage

When the application is running, it will keep a list of things copied to the system's clipboard. Clicking on an item on the list will show a full preview of the item's full content.

Specific items can be searched for with the search bar, and the button next to it can place the currently selected item to the system's clipboard without duplicating it in the application's list.

![ClipStory Screenshot](https://i.ibb.co/TPrcytS/Clip-Story-Screenshot.webp)

## Built With
* Rust
* Tauri
* JavaScript
* HTML
* CSS
