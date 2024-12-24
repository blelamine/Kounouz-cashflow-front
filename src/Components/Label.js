export default function Label({ required, ...props }) {
  return (
    <>
      <label>
        {props.children} {required && <span style={{ color: "red" }}> *</span>}
      </label>
    </>
  );
}
