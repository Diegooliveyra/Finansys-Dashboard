import { Category } from "./category.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiPath: string = "api/categories";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategories));
  }

  getByid(id: number): Observable<Category> {
    const url: string = `${this.apiPath}/${id}`
    return this.http.get<Category>(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategorie)
    )
  }

  create(categorie: Category): Observable<Category>{
    return this.http.post(this.apiPath, categorie).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategorie)
    )
  }

  update(category: Category): Observable<Category>{
    const url: string = `${this.apiPath}/${category.id}`
    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(()=> category)
    )
  }

  delete(id:number): Observable<any>{
    const url: string = `${this.apiPath}/${id}`
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError),
      map(()=> null)
    )
  }

  // Private Methods
  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach((element) => categories.push(element as Category));
    return categories;
  }

  private jsonDataToCategorie(jsonData:any): Category {
    return jsonData as Category
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}
