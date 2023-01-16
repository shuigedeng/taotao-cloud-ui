import { Axios } from '../http';

class HttpConfig {
  private http = {} as Axios;
  private project = '';
  private clientId = '';
  private clientSecret = '';
  private oidc = false;
  private uaaAddress = '';
  private upmsAddress = '';
  private bpmnAddress = '';
  private cmdbAddress = '';
  private msgAddress = '';
  private proxy = '';

  public constructor(
    project: string,
    clientId: string,
    clientSecret: string,
    http: Axios,
    oidc = false,
    proxy = '/api'
  ) {
    this.project = project;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.http = http;
    this.oidc = oidc;
    this.proxy = proxy;
    this.switch(project);
  }
  private switch(type: string) {
    switch (type) {
      case 'taotaocloud':
        this.uaaAddress = '/taotaocloud-cloud-uaa';
        this.upmsAddress = '/taotaocloud-cloud-upms';
        this.bpmnAddress = '/taotaocloud-cloud-bpmn-ability/engine-rest';
        this.cmdbAddress = '/taotaocloud-cloud-cmdb-ability';
        this.msgAddress = '/taotaocloud-cloud-message';
        break;
      case 'taotaocloud':
        this.uaaAddress = '/taotaocloud-cloud-uaa';
        this.upmsAddress = '/taotaocloud-cloud-upms';
        this.bpmnAddress = '/taotaocloud-cloud-bpmn-ability/engine-rest';
        this.cmdbAddress = '/taotaocloud-cloud-cmdb-ability';
        this.msgAddress = '/taotaocloud-cloud-message';
        break;
      default:
        this.uaaAddress = '';
        this.upmsAddress = '';
        this.bpmnAddress = '/engine-rest';
        this.cmdbAddress = '';
        this.msgAddress = '';
    }
  }

  public getProject(): string {
    return this.project;
  }

  public getClientSecret(): string {
    return this.clientSecret;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public isOidc(): boolean {
    return this.oidc;
  }

  public getProxy(): string {
    return this.proxy;
  }

  public getHttp(): Axios {
    return this.http;
  }

  private processProxy(content: string, withProxy: boolean = true): string {
    if (withProxy) {
      return this.proxy + content;
    } else {
      return content;
    }
  }

  public getUaa(withProxy: boolean = true): string {
    return this.processProxy(this.uaaAddress, withProxy);
  }

  public getUpms(withProxy: boolean = true): string {
    return this.processProxy(this.upmsAddress, withProxy);
  }

  public getBpmn(withProxy: boolean = true): string {
    return this.processProxy(this.bpmnAddress, withProxy);
  }

  public getCmdb(withProxy: boolean = true): string {
    return this.processProxy(this.cmdbAddress, withProxy);
  }

  public getMsg(withProxy: boolean = true): string {
    return this.processProxy(this.msgAddress, withProxy);
  }
}

export { HttpConfig };
