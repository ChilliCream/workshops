# Learning by Doing

## Create a starter project

We'll use a starter project so we can begin writing code quickly. The starter contains the minimum structure we need to start developing a React/Relay application by using Next. It includes some prebuilt utilities (e.g., components, hooks, utils) so we can focus on the data integration and some technical details in place of the look and feel.

### Setup

Open a terminal or command window and run the following commands:

1. Clone the repository.

   ```sh
   git clone https://github.com/ ...
   ```

1. Install the required packages.

   ```sh
   cd frontend
   yarn
   ```

1. Open the directory in Visual Studio Code.

   ```sh
   code .
   ```

### Explore

Let's explore the folders and files in the starter project:

```text
frontend/
├─ .proactive/
├─ assets/
├─ client/
├─ components/
├─ config/
├─ generated/
├─ hooks/
├─ icons/
├─ pages/
├─ public/
├─ scenes/
├─ schema/
├─ styles/
├─ utils/
├─ ...
├─ next.config.js
├─ README.md
└─ package.json
```

As mentioned above, some of the folders contain prebuilt utilities (e.g., assets, components, config, hooks, icons, public, styles, utils), there are also some configuration files to setup the tooling environment (e.g., git, prettier, next).
Don't worry, we will discover the others alongside the examples.
