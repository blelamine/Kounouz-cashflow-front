import { Input, Message } from "rsuite";

function AddEdit({ _setmodel, error, model }) {
  return (
    <>
      <label>Nom:</label>
      <Input
        onChange={(name) => {
          _setmodel((prev) => {
            return { ...prev, name };
          });
        }}
        value={model.name}
      />
      <br></br>

      {error && (
        <Message showIcon type="error">
          {error}
        </Message>
      )}
    </>
  );
}

export default AddEdit;
