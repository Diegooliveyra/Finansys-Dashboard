import { CategoryService } from "./../../categories/shared/category.service";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { flatMap } from "rxjs/operators";
import { Entry } from "./entry.model";
import { BaseResourceService } from "src/app/shared/services/base-resource.service";

@Injectable({
  providedIn: "root",
})
export class EntryService extends BaseResourceService<Entry> {
  constructor(
    protected injector: Injector,
    private categoryService: CategoryService
  ) {
    super("api/entries", injector);
  }

  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getByid(entry.categoryId).pipe(
      flatMap((category: any) => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getByid(entry.categoryId).pipe(
      flatMap((category: any) => {
        entry.category = category;
        console.log(entry);
        return super.update(entry);
      })
    );
  }

  // Private Methods
  protected jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach((element) =>
      entries.push(Object.assign(new Entry(), element))
    );
    return entries;
  }

  protected jsonDataToCategorie(jsonData: any): Entry {
    return jsonData as Entry;
  }
}
