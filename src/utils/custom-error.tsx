import { CKANResponseError } from "@/models/ckan";

export function ComponentError<T = any>(props: CKANResponseError<T>["error"]) {
  const { message, __type, ...errorObject } = props;
  return (
    <div>
      {message && <p className="">{message}</p>}
      {Object.entries<string[]>(errorObject as { [s: string]: string[] }).map(
        ([field, restrictions]) => (
          <div key={field}>
            <h3>{field}</h3>
            <ul>
              {restrictions.map((restriction) => (
                <li key={restriction}>{restriction}</li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}
