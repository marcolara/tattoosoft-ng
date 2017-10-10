export abstract class AbstractService {
  constructor() {

  }

  public interpolateUrl(url: string, data: any, params?: any) {
    const that = this;
    // Make sure we have an object to work with - makes the rest of the
    // logic easier.
    params = (params || {});
    data = (data || {});
    // Strip out the delimiter fluff that is only there for readability
    // of the optional label paths.
    url = url.replace(/(\(\s*|\s*\)|\s*\|\s*)/g, '');
    // Replace each label in the URL (ex, :userID).
    url = url.replace(
      /:([a-z]\w*)/gi,
      function($0, label) {
        // NOTE: Giving "data" precedence over "params".
        return (that._popFirstKey(data, params, label) || '');
      }
    );
    // Strip out any repeating slashes (but NOT the http:// version).
    // url = url.replace(/(^|[^:])[\/]{2,}/g, '$1/');
    // Strip out any trailing slash.
    url = url.replace(/\/+$/i, '');
    console.log(url);
    return (url);
  }

  private _popFirstKey(object1?: any, object2?: any, objectN?: any, k?: any): any {
    // Convert the arguments list into a true array so we can easily
    // pluck values from either end.
    const objects = Array.prototype.slice.call(arguments);
    // The key will always be the last item in the argument collection.
    const key = objects.pop();
    let object = null;
    // Iterate over the arguments, looking for the first object that
    // contains a reference to the given key.
    while (object = objects.shift()) {
      if (object.hasOwnProperty(key)) {
        return (this._popKey(object, key));
      }
    }
  }

  private _popKey(object, key) {
    const value = object[key];
    delete (object[key]);
    return (value);
  }
}
