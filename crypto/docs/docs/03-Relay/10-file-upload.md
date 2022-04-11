# File Upload

Uploading files with Relay requires an enhancement in the Network layer to deal with uploadables and an operation, usually a `mutation`.

This involves two main parts:

- creating a new FormData object that contains the file you want to upload
- making sure the `Content-Type` header is `multipart/form-data` instead of `application/json`

:::note

You don’t need to explicitly set the `Content-Type` header for the upload request, but you do need to explicitly set it to `application/json` for all other requests.

:::

Even if files can be passed using [`uploadables` option of the mutation's config](https://relay.dev/docs/api-reference/commit-mutation/#type-mutationconfigtmutationconfig-mutationparameters), it we will use a variable of scalar type `Upload` that will give us some extra type safety.

Here a simplified snippet for the `fetchFn`:

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

Here how we can instrument a mutation to upload a profile image:

```js title="/scenes/settings/SettingsProfile.js"
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
          const record = store.get(id);

          record.setValue(displayName, 'displayName');

          if (previewUrl !== undefined) {
            record.setValue(previewUrl, 'imageUrl');
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
          onSubmit={(e) => {
            e.preventDefault();

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

In this example we render a preview of the image to upload until we receive the image url from the server.
