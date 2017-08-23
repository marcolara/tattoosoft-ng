export class Identity {
  authorities: string[];
  user: any
  constructor(user : any, authorities: string[]) {
    this.user = user;
    this.authorities = authorities;
  }
  addAuthorities(authority: string) {
    this.authorities.push(authority);
  }
  setAuthorities(authorities: string[]) {
    this.authorities = authorities;
  }
  getAuthorities() {
    return this.authorities;
  }
  hasAuthorities(): boolean {
    return this.authorities.length > 0;
  }
}
