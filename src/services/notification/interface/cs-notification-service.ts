import { Observable } from "rxjs";
import { CsNotificationServiceConfig } from "src";
import { NotificationData } from "src/models/notification";

export interface CsNotificationService {
  notificationRead( uid: string, config?: CsNotificationServiceConfig): Observable<CsNotificationReadResponse>;
  notificationUpdateStatus( req: CsNotificationUpdateReq, config?: CsNotificationServiceConfig): Observable<any>;
  notificationDelete( req: CsNotificationDeleteReq, config?: CsNotificationServiceConfig): Observable<any>;
}

export interface CsNotificationReadResponse {
    feeds: Array<NotificationData>
}
export interface CsNotificationUpdateReq {
  ids: string[],
  userId: string
}
export interface CsNotificationDeleteReq {
  ids: string[],
  userId: string
}

export interface CsNotificationUpdateResponse {
    result: any
}
