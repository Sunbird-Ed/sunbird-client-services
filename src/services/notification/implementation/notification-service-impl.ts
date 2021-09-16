import { CsHttpRequestType, CsHttpService, CsRequest } from '../../../core/http-service/interface';
import { Container, inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CsNotificationServiceConfig } from '../../../cs-module';
import { InjectionTokens } from '../../../injection-tokens';
import { CsNotificationReadResponse, CsNotificationService, CsNotificationUpdateResponse, CsNotificationDeleteReq, CsNotificationUpdateReq } from '../interface/cs-notification-service';

@injectable()
export class NotificationServiceImpl implements CsNotificationService {
  constructor(
    @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
    @inject(InjectionTokens.services.notification.NOTIFICATION_SERVICE_API_PATH) private apiPath: string,
    @inject(InjectionTokens.CONTAINER) private container: Container
  ) {
  }

  notificationRead(uid: string, config?: CsNotificationServiceConfig): Observable<CsNotificationReadResponse> {
    const apiRequest = new CsRequest.Builder()
      .withType(CsHttpRequestType.GET)
      .withPath(`${config ? config.apiPath : this.apiPath}/read/${uid}`)
      .withBearerToken(true)
      .withUserToken(true)
      .build();
    console.log('apiRequest: ', apiRequest)
    return this.httpService.fetch<{ result: CsNotificationReadResponse }>(apiRequest).pipe(
      map((response) => response.body.result)
    );
  }

  notificationDelete(request: CsNotificationDeleteReq, config?: CsNotificationServiceConfig): Observable<any> {
    console.log('request from portal notificationDelete', this.apiPath, config)
    const apiRequest = new CsRequest.Builder()
      .withType(CsHttpRequestType.POST)
      .withPath(`${config ? config.apiPath : this.apiPath}/delete`)
      .withBearerToken(true)
      .withUserToken(true)
      .withBody({ request })
      .build();
    console.log('apiRequest: ', apiRequest)
    return this.httpService.fetch<{ result: any }>(apiRequest).pipe(
      map((response) => response.body.result)
    );
  }

  notificationUpdateStatus(request: CsNotificationUpdateReq, config?: CsNotificationServiceConfig): Observable<CsNotificationUpdateResponse> {
    console.log('request from portal notificationUpdate', this.apiPath, config)
    const apiRequest = new CsRequest.Builder()
      .withType(CsHttpRequestType.PATCH)
      .withPath(`${config ? config.apiPath : this.apiPath}/update`)
      .withBearerToken(true)
      .withUserToken(true)
      .withBody({ request })
      .build();
    console.log('apiRequest: ', apiRequest)

    return this.httpService.fetch<{ result: CsNotificationUpdateResponse }>(apiRequest)
      .pipe(
        map((response) => {
          return response.body.result;
        })
      );
  }
}