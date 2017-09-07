export class LoginCredentials {
  public emailAddress: string;
  public password: string;
  public grant_type: string;
  public client_id: string;

  constructor(emailAddress: string, password: string, client_id?: string, grant_type?: string) {
    this.emailAddress = emailAddress;
    this.password = password;
    this.client_id = client_id;
    this.grant_type = grant_type;
  }
}
