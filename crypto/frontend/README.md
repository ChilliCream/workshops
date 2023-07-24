# Crypto

_Where the magic happens_

[![maintained with: yarn][yarn-badge]][yarn]
[![code style: prettier][prettier-badge]][prettier]

We’ll guide you through the thought process of building a real world application that will allow us to deep dive into the GraphQL ecosystem.

---

## Prerequisites

Before getting started, bear in mind that we assume some level of familiarity with:

- [JavaScript][learn-javascript]
- [React][learn-react]
- [GraphQL][learn-graphql]
- [Relay][learn-relay]
- [Next.js][learn-next]
- [Node.js][learn-node]

The list above contains links to training resources that might be useful and a great place to get started.

If you’re new to this ecosystem, don’t panic! You don’t have to be an expert. We’ll share with you some tips and walk through hands-on examples to cover most of the basic and advanced features.

---

## Requirements

1. Open the integrated terminal in Visual Studio Code by selecting `View > Terminal` or by selecting `Ctrl+`. On a Mac, select `Cmd+` instead.

1. Check if you’ve already intalled [Git][git] version 2.13 or higher:

   ```sh
   git --version
   ```

   Otherwise you’ll need to install it, [Git v2][git-install].

1. Check if you’ve already installed [Node.js][node] version 16.10 or higher:

   ```sh
   node --version
   ```

   Otherwise you’ll need to install it, [Node.js LTS][node-lts].

1. Check if you’ve already installed [Yarn][yarn]:

   ```sh
   yarn --version
   ```

   Otherwise you’ll need to install it, [Yarn Modern][yarn-install]:

   ```sh
   corepack enable
   ```

1. You’ll need [Visual Studio Code][vscode] or similar IDE.

---

## Setup

We’ll use a starter project so we can begin writing code quickly. The starter contains the minimum structure we need to start developing a React/Relay application by using Next.js. It includes some prebuilt utilities (e.g., components, hooks, utils) so we can focus on the data integration and some technical details in place of the look and feel.

Open a terminal or command window and run the following commands:

1. Clone the repository.

   ```sh
   git clone https://github.com/ChilliCream/workshops.git
   ```

1. Move into the folder containing the frontend code.

   ```sh
   cd workshops/crypto/frontend
   ```

1. Install the required packages.

   ```sh
   yarn
   ```

1. Open the directory in Visual Studio Code.

   ```sh
   code .
   ```

#### Explore

Let’s explore the folders and files in the starter project:

```text
frontend/
├─ .proactive/
├─ assets/
├─ components/
├─ config/
├─ hooks/
├─ icons/
├─ public/
├─ styles/
├─ utils/
├─ ...
├─ next.config.js
├─ README.md
└─ package.json
```

As mentioned above, some of the folders contain prebuilt utilities (e.g., assets, components, config, hooks, icons, public, styles, utils), there are also some configuration files to setup the tooling environment (e.g., git, prettier, next).

Don’t worry, we’ll discover the others alongside the examples.

---

## Examples

The purpose of these examples is to introduce some topics and use them as a guide throughout the workshop. You’ll find them in the folder `playground`.

We’ll guide you _step-by-step_ and we’ll iterate several times to cover each topic.

#### Startup

We’ll reuse the same prebuilt utilities (e.g., components, hooks, utils) and configurations for all the examples.

In order to prepare the workspace for an example we’ll copy some folders (e.g., client, generated, pages, scenes, schema) into the root using the following command:

```sh
# for the kick-off
yarn goto --initial
# or
yarn goto playground/0-initial

# for the first example (`.n` for multi-step)
yarn goto playground/1-hello.1

# for your own sandbox
yarn goto playground/mysandbox

# for the full app
yarn goto --final
# or
yarn goto playground/X-final
```

You can also print more details about this command by calling:

```sh
yarn goto --help
```

It’ll print something like:

```text
Usage:
ㅤgoto PLAYGROUND_SUBFOLDER
ㅤgoto {--initial | --final | --source=PLAYGROUND_SUBFOLDER}

Options:
  --initial  Initial sandbox                                           [boolean]
  --final    Final sandbox                                             [boolean]
  --source   Path to content folder                                     [string]

Examples:
  goto --initial
  goto playground/1-hello.1
  goto playground/mysandbox
  goto --final
```

The examples are completely independent and not interconnected in any way. It is important to note that any modifications made to one example will not carry over when switching to another. Additionally, please be aware that the changes are neither stored nor saved, so it is recommended to save your modifications externally if needed.

---

## Preflight Checklist

1. Open the integrated terminal in Visual Studio Code by selecting `View > Terminal` or by selecting `Ctrl+`. On a Mac, select `Cmd+` instead.

1. Use the `goto` script to setup the sandbox:

   ```sh
   yarn goto --initial
   # or
   yarn goto playground/0-initial
   ```

````

1. Use the following command to start the Next.js development server:

   ```sh
   yarn dev
   ```

1. Open your browser and visit [http://localhost:3000](http://localhost:3000). You should see the message “Keep Calm and Carry On.”.

Awesome! Cleared for takeoff. Let’s go ahead.

---

<!-- -->

[yarn]: https://yarnpkg.com/
[yarn-badge]: https://img.shields.io/badge/maintained%20with-yarn-2188b6.svg
[yarn-install]: https://yarnpkg.com/getting-started/install
[prettier]: https://prettier.io/
[prettier-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[git]: https://git-scm.com/
[git-install]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[node]: https://nodejs.org/
[node-lts]: https://nodejs.org/en/download/
[vscode]: https://code.visualstudio.com/
[learn-javascript]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript
[learn-react]: https://reactjs.org/docs/getting-started.html#learn-react
[learn-graphql]: https://graphql.org/learn/
[learn-relay]: https://relay.dev/docs/getting-started/step-by-step-guide/
[learn-next]: https://nextjs.org/learn/foundations/about-nextjs
[learn-node]: https://nodejs.dev/learn
````
