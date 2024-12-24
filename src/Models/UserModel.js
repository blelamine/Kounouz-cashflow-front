export default class UserModel {
  userName = "";
  email = "";
  phoneNumber = "";
  firstName = "";
  lastName = "";
  position = "SimpleUser";
  password = "";
  constructor(position) {
    this.position = position;
  }
}
