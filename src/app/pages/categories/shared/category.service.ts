import { Category } from "./category.model";

import { Injectable, Injector } from "@angular/core";
import { BaseResourceService } from "src/app/shared/services/base-resource.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CategoryService extends BaseResourceService<Category> {
  constructor(protected injector: Injector) {
    super(environment.Api, injector, Category.fromJson);
  }
}
