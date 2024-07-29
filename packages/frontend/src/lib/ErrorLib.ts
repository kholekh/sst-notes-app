export function onError(error: any) {
  const message = error instanceof Error ? error.message : String(error);

  alert(message);
}
