export class Credentials {
  private username: string;
  private password: string;
  private grant_type: string;
  private client_id: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.client_id = 'fooClientIdPassword';
    this.grant_type = 'password';
  }
}
