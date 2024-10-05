export class CallbackDataPayload {
  public data: string;
  public doNotDelete?: boolean;
  public removeKeyboard?: boolean;

  constructor(data: string, doNotDelete?: boolean, removeKeyboard?: boolean) {
    this.data = data;
    this.doNotDelete = doNotDelete;
    this.removeKeyboard = removeKeyboard;
  }

  public toString() {
    return JSON.stringify(this);
  }
}
