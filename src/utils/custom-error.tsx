import { CKANResponseError } from "@/models/ckan";

export function ComponentError(props: CKANResponseError<unknown>["error"]) {
  const { message, __type, ...errorObject } = props;
  return (
    <div>
      {message && <p className="">{message}</p>}
      {Object.entries(errorObject).map(
        ([field, restrictions]) =>
          Array.isArray(restrictions) && (
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
