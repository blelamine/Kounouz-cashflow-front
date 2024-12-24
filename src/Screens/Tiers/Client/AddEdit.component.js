import { Input, Message, SelectPicker, TagInput } from "rsuite";

function AddEdit({ _setmodel, error, model, agencies }) {
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

      <label>Ville</label>
      <Input
        value={model.city}
        onChange={(city) => {
          _setmodel((prev) => {
            return { ...prev, city };
          });
        }}
      />
      <label>Adresse</label>
      <Input
        value={model.address}
        onChange={(address) => {
          _setmodel((prev) => {
            return { ...prev, address };
          });
        }}
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
        // placeholder="numéros des télephones"
        value={model.phones ? model.phones.split(",") : []}
        onChange={(phones) => {
          model.phones = phones.join(",");
          let m = { ...model };
          _setmodel(m);
        }}
      />
      <label>Code Tax </label>
      <Input
        value={model.taxCode}
        onChange={(taxCode) => {
          _setmodel((prev) => {
            return { ...prev, taxCode };
          });
        }}
      />
      <label>Société</label>
      <SelectPicker
        data={[{ label: "Tout", value: 0 }].concat(
          agencies.map((c) => {
            return { label: c.name, value: c.id };
          })
        )}
        block
        noSearch
        value={model.agencyId}
        onSelect={(agencyId) => {
          _setmodel((prev) => {
            return { ...prev, agencyId };
          });
        }}
      />
      {/* <label>Type de Client</label>

      <SelectPicker
        searchable={false}
        data={clientTypes}
        block
        noSearch
        value={model.clientType}
        onSelect={(clientType) => {
          _setmodel((prev) => {
            return { ...prev, clientType };
          });
        }}
      /> */}
      <br></br>
      {error && (
        <Message showIcon type="error">
          {error}
        </Message>
      )}
    </>
  );
}
// AddEdit.defaultProps = {
//   model: new ClientModel(),xO
// };
export default AddEdit;
