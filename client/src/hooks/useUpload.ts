import { useReducer, useMemo, useCallback } from "react";

export interface UploadState<Config> {
  file?: File;
  config: Config;
  progress: number;
  uploadedSrc: string;
  status: "idle" | "loading" | "success" | "error";
  error?: Error;
}

export interface InitArgs<Config> {
  config: Config;
}

export function init<Config>({ config }: InitArgs<Config>): UploadState<Config> {
  return {
    file: undefined,
    config,
    progress: -1,
    uploadedSrc: "",
    status: "idle",
    error: undefined,
  };
}

export type UploadAction<Config> =
  | { type: "SELECT_FILE"; payload: { file: File } }
  | { type: "UPDATE_CONFIG"; payload: { config: Partial<Config> } }
  | { type: "UPDATE_PROGRESS"; payload: { progress: number } }
  | { type: "START_UPLOAD" }
  | { type: "FINISH_UPLOAD"; payload: { uploadedSrc: string } }
  | { type: "FAIL_UPLOAD"; payload: { error: Error } };

export function reducer<Config>(
  state: UploadState<Config>,
  action: UploadAction<Config>,
): UploadState<Config> {
  switch (action.type) {
    case "SELECT_FILE":
      return { ...state, file: action.payload.file, progress: 0 };
    case "UPDATE_CONFIG":
      return { ...state, config: { ...state.config, ...action.payload.config } };
    case "UPDATE_PROGRESS":
      return { ...state, progress: action.payload.progress };
    case "START_UPLOAD":
      return { ...state, progress: 0, error: null, status: "loading" };
    case "FINISH_UPLOAD":
      return {
        ...state,
        status: "success",
        progress: 100,
        uploadedSrc: action.payload.uploadedSrc,
      };
    case "FAIL_UPLOAD":
      return { ...state, status: "error", progress: 100, error: action.payload.error };
    default:
      throw new Error();
  }
}

export interface UploadActions<Config> {
  selectFile: (file: File) => void;
  updateConfig: (partialConfig: Partial<Config>) => void;
  updateProgress: (progress: number) => void;
  startUpload: () => void;
  finishUpload: (uploadedSrc: string) => void;
  failUpload: (error: Error) => void;
}

export interface UploadHook<Config> extends UploadState<Config>, UploadActions<Config> {}

export interface UploadHookArgs<Config> {
  initialConfig?: Config;
}

export function useUpload<Config = Record<string, any>>({
  initialConfig,
}: UploadHookArgs<Config>): UploadHook<Config> {
  const [state, dispatch] = useReducer<
    (state: UploadState<Config>, action: UploadAction<Config>) => UploadState<Config>,
    InitArgs<Config>
  >(reducer, { config: initialConfig }, init);

  const selectFile = useCallback(
    (file: File) => dispatch({ type: "SELECT_FILE", payload: { file } }),
    [],
  );

  const updateConfig = useCallback(
    (updatedConfig: Partial<Config>) =>
      dispatch({ type: "UPDATE_CONFIG", payload: { config: updatedConfig } }),
    [],
  );

  const startUpload = useCallback(async () => dispatch({ type: "START_UPLOAD" }), []);
  const finishUpload = useCallback(
    async (uploadedSrc: string) => dispatch({ type: "FINISH_UPLOAD", payload: { uploadedSrc } }),
    [],
  );
  const failUpload = useCallback(
    (error: Error) => dispatch({ type: "FAIL_UPLOAD", payload: { error } }),
    [],
  );

  const updateProgress = useCallback(
    (progress: number) => dispatch({ type: "UPDATE_PROGRESS", payload: { progress } }),
    [],
  );

  const actions: UploadActions<Config> = {
    selectFile,
    updateConfig,
    updateProgress,
    startUpload,
    finishUpload,
    failUpload,
  };

  const returnValue = useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state],
  );

  return returnValue;
}
