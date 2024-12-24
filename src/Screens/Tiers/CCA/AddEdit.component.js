import { Input, Message, TagInput } from "rsuite";

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

      <label>Emails</label>
      <TagInput
        block
        size="md"
        //   placeholder="emails "
        value={model.emails ? model.emails.split(",") : []}
        onChange={(emails) => {
          let m = { ...model };

          m.emails = emails.join(",");
          _setmodel(m);
        }}
      />
      <label>Télephones</label>
      <TagInput
        block
        size="md"
        value={model.phones ? model.phones.split(",") : []}
        onChange={(phones) => {
          model.phones = phones.join(",");
          let m = { ...model };
          _setmodel(m);
        }}
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
