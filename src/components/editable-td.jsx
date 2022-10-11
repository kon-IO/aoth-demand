export default function EditableTd({ number, onBlur, ind, isX }) {
  // const debouncer = debounce((e) => {
  //   onBlur(ind, e, isX);
  // });
  return (
    <div
      contentEditable="true"
      onBlur={(e) => onBlur(ind, e, isX)}
      onKeyDown={(e) => {
        // debouncer(e);
        if (e.key === "Enter") {
          // Prevent newline from being typed
          e.preventDefault();
          // Make editable span lose focus
          e.target.blur();
        }
      }}
    >
      {number}
    </div>
  );
}
