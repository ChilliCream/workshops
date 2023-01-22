# Mutating Data

In GraphQL, data in the server is updated using so-called [GraphQL Mutations](https://graphql.org/learn/queries/#mutations).

Mutations are _read-write_ server operations, which both modify data on the backend, and allow querying for the modified data from the server in the same request.

There’re generally three kinds of mutations:

- creating new data
- updating existing data
- deleting existing data

---

## Writing Mutations

A GraphQL mutation looks very similar to a query, with the exception that it uses the `mutation` keyword:

```graphql
mutation ViewerHeaderAATWMutation($input: AddAssetToWatchlistInput!) {
  addAssetToWatchlist(input: $input) {
    addedAsset {
      isInWatchlist
    }
  }
}
```

In order to execute a mutation against the server in Relay, we can use the `commitMutation` and `useMutation` APIs. Let’s take a look at an example using the [useMutation](https://relay.dev/docs/api-reference/use-mutation/) hook:

```jsx title="@/scenes/viewer/ViewerHeader.js"
// ...
import {memo, useCallback} from 'react';
import {graphql, useFragment, useMutation} from 'react-relay';

const useAddToWatchlist = () => {
  const [commit, isInFlight] = useMutation(graphql`
    mutation ViewerHeaderAATWMutation($input: AddAssetToWatchlistInput!) {
      addAssetToWatchlist(input: $input) {
        addedAsset {
          isInWatchlist
        }
      }
    }
  `);

  const execute = useCallback(
    ({id, symbol}) => {
      commit({
        variables: {input: {symbol}},
        optimisticUpdater(store) {
          store.get(id)?.setValue(true, 'isInWatchlist');
        },
        updater(store) {
          store
            .getRoot()
            .getLinkedRecord('me')
            ?.getLinkedRecord('watchlist')
            ?.invalidateRecord();
        },
        onCompleted() {
          console.log(`${symbol} was added to the watchlist`);
        },
        onError() {
          console.log(
            `there was a problem with ${symbol} while adding to the watchlist`,
          );
        },
      });
    },
    [commit],
  );

  return [execute, isInFlight];
};

// ...

export default memo(function ViewerHeader({fragmentRef}) {
  const asset = useFragment(
    graphql`
      fragment ViewerHeaderFragment_asset on Asset {
        id
        symbol
        name
        imageUrl
        isInWatchlist
        hasAlerts
      }
    `,
    fragmentRef,
  );

  const [addToWatchlist] = useAddToWatchlist();
  const [removeFromWatchlist] = useRemoveFromWatchlist();

  // ...

  return (
    <Checkbox
      color="primary"
      icon={<WatchIcon />}
      checkedIcon={<WatchedIcon />}
      checked={!!asset.isInWatchlist}
      disabled={asset.isInWatchlist === null}
      inputProps={{
        'aria-label': 'watch',
      }}
      onChange={(event) => {
        if (event.target.checked) {
          addToWatchlist(asset);
        } else {
          removeFromWatchlist(asset);
        }
      }}
    />
  );
});
```

We pass into the hook the following arguments:

- `mutation`: GraphQL mutation specified using a `graphql` template literal.

- `commitMutationFn`: An optional function with the same signature as [commitMutation](https://relay.dev/docs/api-reference/commit-mutation/), which will be called in its stead. Defaults to `commitMutation`.

And it returns:

- `commitMutation`: The function that will execute the mutation.

- `areMutationsInFlight`: Will be `true` if any mutation triggered by calling `commitMutation` is still in flight. If you call `commitMutation` multiple times, there can be multiple mutations in flight at once.

:::info

Mutations can have both optimistic and regular updaters. Optimistic updaters are executed when a mutation is triggered. When that mutation completes or errors, the optimistic update is rolled back. When a mutation completes successfully, the mutation response is written to the store and regular updaters are executed.

For a snappy UX, we can use `optimisticUpdater` like in the example above, or `optimisticResponse`. We’ve also used the `updater` to invalidate specific records in the store. That means that any query that is cached and references that invalidated records will now be considered stale, and will require to be refetched again the next time it’s evaluated.

:::

### File Upload

Uploading files with Relay requires an enhancement in the Network layer to deal with uploadables and an operation, usually a `mutation`.

This involves two main parts:

- creating a new `FormData` object that contains the file you want to upload
- making sure the `Content-Type` header is `multipart/form-data` instead of `application/json`

:::note

You don’t need to explicitly set the `Content-Type` header for the upload request, but you do need to explicitly set it to `application/json` for all other requests.

:::

Even if files can be passed using [`uploadables` option of the mutation’s config](https://relay.dev/docs/api-reference/commit-mutation/#type-mutationconfigtmutationconfig-mutationparameters), we’ll use a variable of scalar type `Upload` that will give us some extra type safety.

Here’s a simplified snippet for the `fetchFn`:

```js
const fetchFn = (operation, variables, cacheConfig, uploadables) => {
  const httpEndpoint = Config.HTTP_ENDPOINT;
  const authToken = Config.AUTH_TOKEN;

  return Observable.create((sink) => {
    const init = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: authToken ? `basic ${authToken}` : undefined,
      },
    };

    const {clone, files} = extractFiles(
      {
        id: operation.id ?? undefined,
        query: operation.text ?? undefined,
        variables,
      },
      isExtractableFile,
    );

    if (files.size) {
      const form = new FormData();

      form.set('operations', JSON.stringify(clone));

      const map = {};
      let i = 0;

      files.forEach((paths) => {
        map[i++] = paths;
      });

      form.set('map', JSON.stringify(map));

      i = 0;
      files.forEach((paths, file) => {
        form.set(`${i++}`, file, file.name);
      });

      merge(init, {
        body: form,
      });
    } else {
      merge(init, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clone),
      });
    }

    // ...
  });
};
```

Here’s how we can instrument a mutation to upload a profile image:

```js title="@/scenes/settings/SettingsProfile.js"
import {
  AccordionActions,
  AccordionDetails,
  Avatar,
  Button,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {graphql, useFragment, useMutation} from 'react-relay';

import {DeleteIcon, FileUploadIcon, ProfileIcon} from '@/icons';

import {Group} from './Group';

const useUpdateUserProfile = () => {
  const [commit, isInFlight] = useMutation(graphql`
    mutation SettingsProfileUUPMutation($input: UpdateUserProfileInput!) {
      updateUserProfile(input: $input) {
        updatedUser {
          displayName
          imageUrl
        }
      }
    }
  `);

  const execute = useCallback(
    ({id, displayName, image, previewUrl}) => {
      commit({
        variables: {
          input: Object.assign({displayName}, image !== undefined && {image}),
        },
        optimisticUpdater(store) {
          const user = store.get(id)?.setValue(displayName, 'displayName');

          if (previewUrl !== undefined) {
            user?.setValue(previewUrl, 'imageUrl');
          }
        },
        onCompleted() {
          console.log('profile was updated');
        },
        onError() {
          console.log('there was a problem while updating the profile');
        },
      });
    },
    [commit],
  );

  return [execute, isInFlight];
};

export default memo(function SettingsProfile({active, onChange, fragmentRef}) {
  const data = useFragment(
    graphql`
      fragment SettingsProfileFragment_query on Query {
        me {
          id
          name
          displayName
          imageUrl
        }
      }
    `,
    fragmentRef,
  );
  const me = data.me;

  const [updateUserProfile] = useUpdateUserProfile();

  const [[image, previewUrl], setAvatar] = useState([]);

  const {getRootProps, getInputProps, open} = useDropzone({
    accept: 'image/*',
    multiple: false,
    maxFiles: 1,
    maxSize: 1_024_000,
    onDropAccepted: ([file]) => {
      console.log('image drop accepted');

      setAvatar([file, URL.createObjectURL(file)]);
    },
    onDropRejected: (fileRejections) => {
      console.log('image drop rejected', fileRejections);
    },
  });

  const displaynameRef = useRef(null);

  useEffect(() => {
    if (previewUrl) {
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  }, [previewUrl]);

  return (
    <Group
      id="profile"
      icon={ProfileIcon}
      title="Profile"
      active={active}
      disabled={!me}
      onChange={onChange}
    >
      {me && (
        <form
          name="links"
          onSubmit={(event) => {
            event.preventDefault();

            const displayName = displaynameRef.current?.value || null;

            updateUserProfile({
              id: me.id,
              displayName,
              image,
              previewUrl,
            });
          }}
        >
          <AccordionDetails id="panel-profile-content" sx={{p: 6}}>
            <Stack direction="column" alignItems="center" gap={8}>
              <input {...getInputProps()} />
              <Avatar
                src={previewUrl === undefined ? me.imageUrl : previewUrl}
                sx={(theme) => ({
                  width: 192,
                  height: 192,
                  border: `1px solid ${theme.palette.action.focus}`,
                  backgroundColor: theme.palette.action.focus,
                  outline: 0,
                  '&:hover': {
                    borderColor: theme.palette.text.primary,
                  },
                  '&:focus': {
                    borderWidth: 2,
                    borderColor: theme.palette.primary.main,
                  },
                })}
                {...getRootProps()}
              />
              <Stack direction="row">
                <IconButton
                  size="medium"
                  aria-label="remove image"
                  disabled={!previewUrl && !me.imageUrl}
                  onClick={() => {
                    setAvatar([null, null]);
                  }}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="medium"
                  aria-label="upload image"
                  onClick={open}
                >
                  <FileUploadIcon fontSize="inherit" />
                </IconButton>
              </Stack>
              <TextField
                inputRef={displaynameRef}
                label="Displayname"
                defaultValue={me.displayName}
                autoComplete="displayname"
                helperText="Your name may appear around where you contribute or are mentioned. You can remove it at any time."
                fullWidth
              />
            </Stack>
          </AccordionDetails>
          <AccordionActions
            sx={{flexDirection: 'row-reverse', justifyContent: 'flex-start'}}
          >
            <Button type="submit" color="primary">
              Save
            </Button>
            <Button
              type="reset"
              color="secondary"
              onClick={() => {
                setAvatar([]);
              }}
            >
              Cancel
            </Button>
          </AccordionActions>
        </form>
      )}
    </Group>
  );
});
```

In this example, we render an image preview until we receive the image URL from the server.

---
