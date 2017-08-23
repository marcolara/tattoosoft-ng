export class LoginCredentials {
  public username: string;
  public password: string;
  public grant_type: string;
  public client_id: string;

  constructor(username: string, password: string, client_id?: string, grant_type?: string) {
    this.username = username;
    this.password = password;
    this.client_id = client_id;
    this.grant_type = grant_type;
  }
}
