import { Input, Message } from "rsuite";

function AddEdit({ _setmodel, error, model, agencies }) {
  return (
    <>
      <label>Prénom:</label>
      <Input
        onChange={(firstName) => {
          _setmodel((prev) => {
            return { ...prev, firstName };
          });
        }}
        value={model.firstName}
      />
      <label>Nom:</label>
      <Input
        onChange={(lastName) => {
          _setmodel((prev) => {
            return { ...prev, lastName };
          });
        }}
        value={model.lastName}
      />
      <label>Email :</label>
      <Input
        type="email"
        value={model.email}
        onChange={(email) => {
          _setmodel((prev) => {
            return { ...prev, email };
          });
        }}
      />
      <label>Télephone :</label>
      <Input
        value={model.phoneNumber}
        onChange={(phoneNumber) => {
          _setmodel((prev) => {
            return { ...prev, phoneNumber };
          });
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
// AddEdit.defaultProps = {
//   model: new ClientModel(),
// };
export default AddEdit;
