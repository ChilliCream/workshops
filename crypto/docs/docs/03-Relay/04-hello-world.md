# Hello, World!

The most common way to start any programming course is to display the text "Hello, World!". Continuing with this tradition, we'll use React/Relay to display the famous text.

## Create the scene and page host

1. Create a file at `/scenes/Greetings.js`.

   ```jsx title="@/scenes/Greetings.js"
   export default function Greetings() {
     return <>Hello, World!</>;
   }
   ```

1. Create a file at `/pages/index.js`.

   ```jsx title="@/pages/index.js"
   export {default} from '@/scenes/Greetings';
   ```

:::tip Use the `patch` as a shorthand to reproduce the mentioned changes

```sh
git apply playground/example1-1.patch
```

:::

:::tip Use `git stash` to save your local changes between excersises

```sh
git stash -u -- .
```

:::

## Check it out

Now that we've created our code, let's see our app in action!

1. Open the integrated terminal in Visual Studio Code by selecting `View > Terminal` or by selecting `Ctrl+`. On a Mac, select `Cmd+` instead.

1. Use the following command to start Next's development server:

   ```sh
   yarn dev
   ```

1. A new page is now available at [http://localhost:3000](http://localhost:3000).

   :::note You should now see your page!

   Your default browser should automatically open and display your page. If the page doesn't appear automatically, open your browser and go to [http://localhost:3000](http://localhost:3000).

   :::
