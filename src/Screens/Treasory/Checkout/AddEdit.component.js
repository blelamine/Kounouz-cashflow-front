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

      <label>Solde Initial :</label>
      <Input
        type="number"
        step={0.1}
        onChange={(beginBalance) => {
          _setmodel((prev) => {
            return { ...prev, beginBalance: parseFloat(beginBalance) };
          });
        }}
        value={model.beginBalance}
      />
      <label>N°Compte (Sage) :</label>
      <Input
        type="number"
        step={1}
        onChange={(accountingNumber) => {
          _setmodel((prev) => {
            return { ...prev, accountingNumber: parseInt(accountingNumber) };
          });
        }}
        value={model.accountingNumber}
      />
      <label>Code Journal (Sage) :</label>
      <Input
        onChange={(code) => {
          _setmodel((prev) => {
            return { ...prev, code };
          });
        }}
        value={model.code}
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
