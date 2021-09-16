import { Observable } from "rxjs";
import { CsNotificationServiceConfig } from "src";

export interface CsNotificationService {
  notificationRead( uid: string, config?: CsNotificationServiceConfig): Observable<CsNotificationReadResponse>;
  notificationUpdateStatus(request: any, config?: CsNotificationServiceConfig): Observable<CsNotificationUpdateResponse>;
  // notificationDelete( req: NotificationDeleteReq, config?: CsNotificationServiceConfig): Observable<any>;
}

export interface CsNotificationReadResponse {
    result: { userFeed: Array<Notification> }
}

export interface NotificationDeleteReq {
  result: any
}

export interface CsNotificationUpdateResponse {
    result: any
}
