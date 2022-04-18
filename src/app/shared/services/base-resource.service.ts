import { HttpClient } from "@angular/common/http";
import { Injector } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { BaseResource } from "src/app/shared/models/base-resource.model";

export abstract class BaseResourceService<T extends BaseResource> {
  protected http: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData)=> T
  ) {
    this.http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.http
      .get<T[]>(this.apiPath)
      .pipe(
        map(this.jsonDataToResources.bind(this)),
        catchError(this.handleError),
        );
  }

  getByid(id: number): Observable<T> {
    const url: string = `${this.apiPath}/${id}`;
    return this.http
      .get<T>(url)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError),
        );
  }

  create(resource: T): Observable<T> {
    return this.http
      .post(this.apiPath, resource)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError),
        );
  }

  update(resource: T): Observable<T> {
    const url: string = `${this.apiPath}/${resource.id}`;
    return this.http.put(url, resource).pipe(
      map(() => resource),
      catchError(this.handleError),
    );
  }

  delete(id: number): Observable<any> {
    const url: string = `${this.apiPath}/${id}`;
    return this.http.delete<any>(url).pipe(
      map(() => null),
      catchError(this.handleError),
    );
  }

  // Protected Methods
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach((element) => resources.push(this.jsonDataToResourceFn(element)));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData)
  }

  protected handleError(error: any): Observable<any> {
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}
