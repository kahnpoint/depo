# 🚚 Depo

### This is a new project and a work in progress, not yet recommended for use.

![depo header](docs/images/depo-header.png)

Depo is a simple package manager for [Deno](https://deno.land/), mostly wrapping
the [esm.sh](https://esm.sh/) package cache. _Not affiliated with Deno or
esm.sh_

# Installation

# Usage

`depo init my-app -y` to get started

Depo will manage creating and caching the deps.ts file for you, so it is
recommended to import dependencies using their import maps and let Deno handle
the tree-shaking.

## Commands

- init [name]
  - Initialize repo with Depo.
- install, i [source] [modules...]
  - Install module(s) from a source.
- update, u <modules...>
  - Upgrade Modules
- remove, r <modules...> - Remove (uninstall) module(s)
- cache, c
  - Generate and cache deps.ts
  - This is used if you manually add a module to deno.json
- search, s [source] [library] [count]
  - Search Deno.land, NPM, or Github.
    ![depo search](docs/images/depo-search.png)

# Future

This is my first project using Deno, so I am planning on adding more features as
I use it more.

Todo list:

- Tests
- CI/CD
- Reduce the number of init confirmation questions
- Use Deno.openKv() for user settings
- Automod: a feature to automatically generate a mod.ts file for each folder
- docs: set up a docs folder for static site generation with
  [Lume](https://lume.land/)
