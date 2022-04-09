import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Entry } from "./entry.model";

@Injectable({
  providedIn: "root",
})
export class EntryService {
  private apiPath: string = "api/entries";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Entry[]> {
    return this.http
      .get<Entry[]>(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntries));
  }

  getByid(id: number): Observable<Entry> {
    const url: string = `${this.apiPath}/${id}`;
    return this.http
      .get<Entry>(url)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategorie));
  }

  create(entry: Entry): Observable<Entry> {
    return this.http
      .post(this.apiPath, entry)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategorie));
  }

  update(entry: Entry): Observable<Entry> {
    const url: string = `${this.apiPath}/${entry.id}`;
    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    );
  }

  delete(id: number): Observable<any> {
    const url: string = `${this.apiPath}/${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  // Private Methods
  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach((element) =>
      entries.push(Object.assign(new Entry(), element))
    );
    return entries;
  }

  private jsonDataToCategorie(jsonData: any): Entry {
    return jsonData as Entry;
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}
