export class LoginCredentials {
  public email: string;
  public password: string;
  public grant_type: string;
  public client_id: string;

  constructor(email: string, password: string, client_id?: string, grant_type?: string) {
    this.email = email;
    this.password = password;
    this.client_id = client_id;
    this.grant_type = grant_type;
  }
}
