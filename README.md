# Media Upload

## Client

React hook `useUpload`

```js
const mediaUpload = useUpload({ initialConfig: {} })
```

- `useUpload` accepts an object with `initialConfig` field as the initial value for the config object
- `useUpload` returns an object with relevant state and actions
  - state:
    - `file`: JS `File` when uploaded
    - `progress`: number
    - `config`: an object with the same type as `initialConfig`
    - `status`: `"idle" | "loading" | "success" | "error"` - upload status
    - `error`: `Error`
    - `uploadedSrc`: the preview URL after successful upload
  - actions:
    - `selectFile`
    - `updateConfig`
    - `updateProgress`
    - `startUpload`
    - `finishUpload`
    - `failUpload`

## Server

The API that goes with media uploading

- REST endpoint `/upload`: takes `FormData` with `media` (image) and `compression`, uses `jimp` to convert the image to JPG with the `compression` as quality, and returns a URL of the uploaded image
- WebSocket connection `/ws` that does the same thing but will upload progress periodically. **Note**: not working, [read more](#webSocket-issue)

## WebSocket Issue

I couldn't figure out a good way to send `File` value over WebSocket. Seems like some MIME type is lost during the connection. This seems to be beyond the scope of the project, so I won't spend more time looking into this.

## Demos

4 different demos:

- Sample image upload vis REST
- Sample image upload with `react-dropzone` via REST
- Sample image upload via WebSocket (not working)
- Sample video upload (no server)

## Installations and setup

After cloning the repo:

```
cd media-upload

# go into `client` folder
cd client
yarn
yarn dev

# in a different tab, go into `server` folder
cd server
yarn
yarn dev
```

The client should be on `localhost:3000` and server on `localhost:8000`.